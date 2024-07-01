import { QlikRepoApi } from "qlik-repo-api";
import { randomUUID } from "crypto";
import ivm, { Reference } from "isolated-vm";
import { IRunBook, ITask } from "./RunBook.interfaces";
import { Task } from "./Task";
import { Debugger } from "../util/Debugger";
import { EventsBus } from "../util/EventBus";
import { CustomError } from "../util/CustomError";
import { Operations } from "../util/operations/index";
import { parseFilter } from "@informatiqal/filter-parser";

export interface IRunBookResult {
  task: string;
  // result: ITaskResult;
  details: any;
  error?: boolean;
  errorMessage?: string;
}

export interface ITaskTimings {
  start: string;
  end: string;
  totalSeconds: number;
}

export interface ITaskResult {
  data: IRunBookResult[] | IRunBookResult;
  task: ITask;
  timings: ITaskTimings;
  status: "Completed" | "Error" | "Skip" | "Error (Force exit)";
}

export class Runner {
  runBook: IRunBook;
  instance: QlikRepoApi.client;
  debug: Debugger;
  private taskResults: ITaskResult[];
  private emitter: EventsBus;
  private today: string;
  private increment: number = 1;
  private operations: Operations;
  // private inlineVariablesRegex = /(?<=\$\${)(.*?)(?=})/; // match values - $${xxxx}
  // TODO: how to re-use the regex? issue when using in multiple places when defined here
  // private inlineVariablesRegex = new RegExp(/(?<=\$\${)(.*?)(?=})/gm); // match ALL values - $${xxxx}
  constructor(runBook: IRunBook, instance) {
    this.runBook = runBook;
    this.instance = instance;
    this.taskResults = [];
    this.emitter = new EventsBus();
    this.debug = new Debugger(this.runBook.trace, this.emitter);
    this.operations = Operations.getInstance();

    const date = new Date();
    this.today = date.toISOString().split("T")[0].replace(/-/gi, "");
  }

  async start(): Promise<ITaskResult[]> {
    //return await Promise.all(
    // this.runBook.tasks.forEach(async (t) => {

    for (let t of this.runBook.tasks) {
      // parse the "when" condition only if "skip"
      // is not explicitly defined
      // aka "skip" is with higher priority
      if (!Object.hasOwnProperty("skip")) {
        let whenSkip = false;
        if (t.when) {
          let jsCondition = "";

          try {
            jsCondition = this.parseWhenCondition(t.when);
          } catch (e) {
            throw new Error(
              `Error parsing the "where" filter for task "${t.name}"`
            );
          }

          try {
            whenSkip = await this.evaluateWhenCondition(jsCondition);
          } catch (e) {
            throw new Error(
              `Error evaluating the "where" filter for task "${t.name}"`
            );
          }

          t.skip = whenSkip;
        }
      }

      if (!t.skip) await this.taskProcessing(t);
    }

    return this.taskResults;
  }

  private async getFilterItems(task: ITask): Promise<any> {
    const a = task.operation.split(".");

    if (this.operations.ops.nonSourceOperations.indexOf(task.operation) > -1)
      return {};

    // NOTE: special operation? debug? continue?
    // if (a.length == 1) {
    // }

    if (a[0].substring(a[0].length - 1) == "y") {
      a[0] = `${a[0].substring(0, a[0].length - 1)}ies`;
    } else {
      a[0] = `${a[0]}s`;
    }

    const taskOperationMeta = this.operations.ops.filter(task.operation);

    const data = await this.instance[`${a[0]}`].getFilter({
      filter: task.filter,
    });

    // taskOperationMeta.realOperation ?await this.instance

    // this.debug.print(task.name, data.length);
    return { data };
  }

  private async taskProcessing(t: ITask) {
    if (!t.operation) throw new CustomError(1012, t.name, { arg1: t.name });
    try {
      // TODO: data should have type!
      // get the data for the object on which the operation will be performed
      // either from querying QRS (calling /XXX/filter)
      // or from result of previous task

      // check for inline variables inside the filter
      const regex = new RegExp(/(?<=\$\${)(.*?)(?=})/gm);
      if (t.filter && regex.test(t.filter)) {
        t.filter = this.replaceInlineVariables(t.filter, t.name);
      }

      const data = !t.source
        ? await this.getFilterItems(t).catch((e) => {
            throw new CustomError(1011, t.name, {
              arg1: t.name,
              arg2: e.message,
            });
          })
        : this.taskResults.find((a) => a.task.name == t.source);

      // process the task, push the result to taskResult variable
      const timings: ITaskTimings = {
        start: null,
        end: null,
        totalSeconds: -1,
      };

      const regex1 = new RegExp(/(?<=\$\${)(.*?)(?=})/gm);
      // check for inline variables inside the task details
      if (t.details && regex1.test(JSON.stringify(t.details))) {
        t.details = this.replaceInlineVariables(t.details, t.name);
      }

      t = this.replaceSpecialVariables(t);

      const task = new Task(t, this.instance, data);
      timings.start = new Date().toISOString();

      await task.process().then((taskResult) => {
        timings.end = new Date().toISOString();
        timings.totalSeconds =
          (new Date(timings.end).getTime() -
            new Date(timings.start).getTime()) /
          1000;

        const result: ITaskResult = {
          task: this.maskSensitiveData(t),
          timings: timings,
          // by default all sensitive data will be automatically masked
          // unless the task options specifically disables this behavior
          // aka: options.unmaskSecrets == true
          data:
            t.options && t.options?.unmaskSecrets == true
              ? taskResult
              : this.maskSensitiveDataDetails(taskResult, t.operation),
          status: "Completed",
        };
        this.emitter.emit("task:result", result);
        this.emitter.emit("runbook:log", `${task.task.name} complete`);
        this.taskResults.push(result);
        this.emitter.emit("runbook:result", this.taskResults);
        return result;
      });
    } catch (e) {
      this.taskResults.push({
        task: this.maskSensitiveData(t),
        status: "Error",
        data: [],
        timings: { start: "", end: "", totalSeconds: -1 },
      });
      this.emitter.emit("runbook:result", this.taskResults);

      // ignore the error and continue with the next task
      // (outside the onError block)
      if (t.onError && t.onError.ignore) return;
      // if ignore is specifically set to false - throw the error
      if (t.onError && t.onError.ignore == false) throw e;

      // throw custom error if onError.exit is provided
      if (t.onError && t.onError.exit) throw new CustomError(1017, t.name);

      // if there are any tasks specified in onError block
      // loop through them and run them as regular tasks
      if (t.onError && t.onError.tasks?.length > 0) {
        for (let onErrorTask of t.onError.tasks) {
          if (!onErrorTask.skip) await this.taskProcessing(onErrorTask);
        }
      }

      if (!t.onError) throw e;
    }
  }

  // if at least one of the details prop values
  // is an inline variable $${xxx} then
  // replace its value with the id(s) from
  // the prev task result
  private replaceInlineVariables(details, taskName) {
    const _this = this;
    const regex = new RegExp(/(?<=\$\${)(.*?)(?=})/gm);

    let detailsString = JSON.stringify(details);

    const inlineVariablesMatch = [...detailsString.matchAll(regex)];
    const inlineVariables = [...new Set(inlineVariablesMatch.map((m) => m[1]))];
    if (inlineVariables.length == 0) return details;

    inlineVariables.map((v) => {
      const inlineVariableDefinition = "".concat("$${", v, "}");
      // const regexReplace = new RegExp(inlineVariableDefinition, "g");
      const value = _this.getPropertyFromTaskResult(v, taskName);
      // const regexSurrounding = new RegExp(/(...)(?<=\$\${)(.*?)(?=})(.)/gm);

      if (Array.isArray(value) && value.length > 1)
        throw new CustomError(1024, "", {
          arg1: taskName,
          arg2: v,
        });

      detailsString = detailsString
        .split(inlineVariableDefinition)
        .join(Array.isArray(value) ? value[0] : value);
    });

    return JSON.parse(detailsString);
  }

  private getPropertyFromTaskResult(taskName: string, sourceTaskName: string) {
    const [name, property] = taskName.split("#");

    const taskResult = this.taskResults.filter((r) => r.task.name == name)[0];

    // if property is used then return its value
    // else return ID as default
    if (Array.isArray(taskResult.data))
      return (taskResult.data as IRunBookResult[]).map((d) => {
        if (!property) return d.details.id;

        const inlineValue = property
          .split(".")
          .reduce((a, prop) => a[prop], d.details);

        if (!inlineValue)
          throw new CustomError(1026, sourceTaskName, {
            arg1: name,
            arg2: property,
          });

        return inlineValue;
      });

    if (!property) return (taskResult.data as IRunBookResult).details["id"];

    const inlineValue = property
      .split(".")
      .reduce((a, prop) => a[prop], taskResult.data.details);

    if (!inlineValue)
      throw new CustomError(1026, sourceTaskName, {
        arg1: name,
        arg2: property,
      });

    return inlineValue;

    // return [
    //   (taskResult.data as IRunBookResult).details[property ? property : "id"],
    // ];
  }

  // replace special variables per task
  // special variables are: GUID, TODAY, NOW and INCREMENT
  private replaceSpecialVariables(t: ITask): ITask {
    const _this = this;

    // if file property exists and its value is of type Buffer
    // then store the content of the buffer into a temp variable
    // the reason for this is to not alter the buffer value
    // when replacing the special variables
    // the buffer value will be added back when all
    // special values are replaces (the end of this function)
    let tempFile: Buffer;
    if (t.details?.hasOwnProperty("file")) {
      tempFile = (t.details as { file: Buffer }).file;
      (t.details as { file: Buffer }).file = undefined;
    }

    let taskString = JSON.stringify(t);

    let a = taskString.match(/(?<=\${)(.*?)(?=})/g);

    // nothing to replace. no need to proceed
    // return the file prop value back to the object
    if (!a) {
      if (tempFile) (t.details as { file: Buffer }).file = tempFile;
      return t;
    }

    if (a.includes("TODAY"))
      taskString = taskString.replace(/\${TODAY}/gi, this.today);

    if (a.includes("GUID"))
      taskString = taskString.replace(/\${GUID}/gi, () =>
        randomUUID().replace(/-/gi, "")
      );

    if (a.includes("NOW")) {
      taskString = taskString.replace(/\${NOW}/gi, () => {
        const date = new Date();
        const time = date
          .toISOString()
          .split("T")[1]
          .split(".")[0]
          .replace(/:/gi, "");

        return `${_this.today}${time}`;
      });
    }

    if (a.includes("INCREMENT")) {
      taskString = taskString.replace(/\${INCREMENT}/gi, function () {
        const a = `${_this.increment}`;
        _this.increment++;
        return a;
      });

      this.increment++;
    }

    if (a.includes("DECREMENT")) {
      taskString = taskString.replace(/\${INCREMENT}/gi, function () {
        _this.increment--;
        const a = `${_this.increment}`;
        return a;
      });

      this.increment++;
    }

    if (a.includes("RANDOM")) {
      taskString = taskString.replace(/\${RANDOM}/gi, function () {
        return [...Array(20)]
          .map(() => Math.random().toString(36)[2])
          .join("")
          .toUpperCase();
      });
    }

    const tt = JSON.parse(taskString) as ITask;

    if (tempFile) (tt.details as any).file = tempFile;

    return tt;
  }

  /**
   * Mask any sensitive data inside the task details
   * like data connection passwords
   */
  private maskSensitiveData(taskDetails: ITask) {
    const isWithSensitiveData: boolean =
      this.operations.ops.sensitiveDataOperations.includes(
        taskDetails.operation
      );

    if (!isWithSensitiveData) return taskDetails;

    const operation = this.operations.ops.filter(taskDetails.operation);

    operation.sensitiveProperty.map((prop) => {
      // if the property exists then mask it
      if (taskDetails.details[prop]) taskDetails.details[prop] = "**********";
    });

    return taskDetails;
  }

  /**
   * Mask any sensitive data inside the task details
   * like data connection passwords
   */
  // TODO: we should have only one function for masking
  private maskSensitiveDataDetails(
    taskResult: IRunBookResult[],
    operation: string
  ) {
    //TODO: this one and this.maskSensitiveData should not be called at all if the task dont have sensitive data
    const isWithSensitiveData: boolean =
      this.operations.ops.sensitiveDataOperations.includes(operation);

    if (!isWithSensitiveData) return taskResult;
    const o = this.operations.ops.filter(operation);

    if (Array.isArray(taskResult)) {
      return taskResult.map((d) => {
        o.sensitiveProperty.map((prop) => {
          // if the property exists then mask it
          if (d.details[prop]) d.details[prop] = "**********";
        });

        return d;
      });
    } else {
      o.sensitiveProperty.map((prop) => {
        // if the property exists then mask it
        if ((taskResult as IRunBookResult).details[prop])
          (taskResult as IRunBookResult).details[prop] = "**********";
      });

      return taskResult;
    }
  }

  private parseWhenCondition(conditions: string) {
    let parsedJsElements = parseFilter(conditions) as string;

    const regEx = /(?<=\$\${)(.*?)(?=})/g;

    const inlineConditions: string[] = Array.from(
      new Set(parsedJsElements.match(regEx))
    );

    if (inlineConditions.length > 0) {
      inlineConditions.map((ic) => {
        let taskName = ic;
        let prop = "";
        let type = "";

        if (ic.indexOf("|") > 0)
          [taskName, prop, type = "logical"] = ic.split("|");
        if (ic.indexOf("#") > 0)
          [taskName, prop, type = "property"] = ic.split("#");

        const taskResult = this.taskResults.filter(
          (r) => r.task.name == taskName
        )[0];

        if (prop) {
          const realProp = prop.endsWith("!")
            ? prop.substring(0, prop.length - 1)
            : prop;

          if (type == "logical") {
            if (realProp == "length") {
              if (Array.isArray(taskResult.data)) {
                parsedJsElements = parsedJsElements.replaceAll(
                  `$$\{${ic}}`,
                  `${taskResult.data.length}`
                );
              }
            }

            if (prop == "skip") {
              parsedJsElements = parsedJsElements.replaceAll(
                `$$\{${ic}}`,
                `${taskResult.task.skip || false}`
              );
            }
          }

          if (type == "property") {
            //@ts-ignore
            const p = taskResult.data.map((d) => d.details[realProp]);

            parsedJsElements = parsedJsElements.replaceAll(
              `$$\{${ic}}`,
              // `"${taskResult.data[0].details[prop]}"`
              `['${[...p].join("','")}']`
            );

            // let b = `$$\{${ic}}.includes('${prop}')`

            // parsedJsElements = parsedJsElements.replace(
            //   `$$\{${ic}}.includes('${prop}')`,
            //   `${p}.some(res => s.includes(res))`
            // );

            let a = 1;

            // "$${Get some apps#name}.includes('temp')"
            // "$${Get some apps#name}.includes('temp') && $${Get some apps#name} == 'temp'"
          }
        }
      });
    }

    let a = 1;
    return parsedJsElements;
  }

  private async evaluateWhenCondition(jsCondition: string) {
    const isolate = new ivm.Isolate();
    const context = await isolate.createContext();
    const jail = context.global;
    await jail.set(
      "whenCondition",
      new ivm.Reference(function () {
        return `() => { if(${jsCondition}) { return true } else { return false } }`;
      })
    );

    const fn = await context.eval(
      `(async function untrusted() {
            const condition = whenCondition.applySync();
            const evalResult = eval(condition);
            return evalResult();
        })`,
      { reference: true }
    );

    const value = (await fn.apply(undefined, [], {
      result: { promise: true },
    })) as boolean;

    return !value;
  }
}
