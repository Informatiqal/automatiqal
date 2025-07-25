import { QlikRepoApi } from "qlik-repo-api";
import { randomUUID } from "crypto";
import {
  ILoop,
  IRunBook,
  ITask,
  ITaskFull,
  ITaskPause,
} from "./RunBook.interfaces";
import { Task } from "./Task";
import { Debugger } from "../util/Debugger";
import { EventsBus } from "../util/EventBus";
import { CustomError } from "../util/CustomError";
import { Operations } from "../util/operations/index";
import { parseFilter } from "@informatiqal/filter-parser";
import { QlikSaaSApi } from "qlik-saas-api";
import { WinOperations } from "../util/operations/WinOperations";

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
  skipReason?: "When condition" | "Preset" | "Source skipped";
}

export class Runner {
  runBook: IRunBook;
  instances: { [k: string]: QlikRepoApi.client | QlikSaaSApi.client };
  defaultInstance: QlikRepoApi.client | QlikSaaSApi.client;
  debug: Debugger;
  private winOperations: WinOperations;
  private taskResults: ITaskResult[];
  private emitter: EventsBus;
  private today: string;
  private increment: number = 1;
  private operations: Operations;
  private taskDefaultOptions: ITaskFull["options"] = {
    appendCustomProperties: true,
    appendTags: true,
    multiple: false,
    allowZero: false,
    whitelistOperation: "add",
    virtualProxiesOperation: "add",
    tagOperation: "add",
    customPropertyOperation: "add",
    unmaskSecrets: false,
    loopParallel: false,
    parallel: false,
    concurrency: 0,
    batch: 0,
  };
  dryRun: boolean;
  // private inlineVariablesRegex = /(?<=\$\${)(.*?)(?=})/; // match values - $${xxxx}
  // TODO: how to re-use the regex? issue when using in multiple places when defined here
  // private inlineVariablesRegex = new RegExp(/(?<=\$\${)(.*?)(?=})/gm); // match ALL values - $${xxxx}
  constructor(
    runBook: IRunBook,
    instances: { [k: string]: QlikRepoApi.client | QlikSaaSApi.client },
    defaultInstance: QlikRepoApi.client | QlikSaaSApi.client,
    dryRun: boolean
  ) {
    this.runBook = runBook;
    this.instances = instances;
    this.defaultInstance = defaultInstance;
    this.taskResults = [];
    this.emitter = new EventsBus();
    this.debug = new Debugger(this.runBook.trace, this.emitter);
    this.operations = Operations.getInstance();
    this.dryRun = dryRun;
    this.winOperations = new WinOperations();

    const date = new Date();
    this.today = date.toISOString().split("T")[0].replace(/-/gi, "");
  }

  async start(): Promise<ITaskResult[]> {
    //return await Promise.all(
    // this.runBook.tasks.forEach(async (t) => {

    for (let t of this.runBook.tasks) {
      if (t.operation == "pause")
        t.name = `Pause (${(t as ITaskPause).details.seconds}s)`;
      // if task is preset to be skipped
      // then just emit the event and do not process it further
      if (t.hasOwnProperty("skip") && t.skip == true) {
        const result: ITaskResult = {
          task: this.maskSensitiveData(t),
          timings: {} as ITaskTimings,
          data: {} as any,
          status: "Skip",
          skipReason: "Preset",
        };

        this.emitter.emit("task:result", result);
        this.emitter.emit("runbook:log", `${t.name} skipped`);
        this.taskResults.push(result);
        this.emitter.emit("runbook:result", this.taskResults);

        continue;
      }

      // parse the "when" condition only if "skip"
      // is not explicitly defined
      // aka "skip" is with higher priority
      if (!t.hasOwnProperty("skip") || t.skip == false) {
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
            const evaluateCondition = function (condition) {
              return new Function("return (" + condition + ")")();
            };

            whenSkip = evaluateCondition(jsCondition);
          } catch (e) {
            throw new Error(
              `Error evaluating the "where" filter for task "${t.name}"`
            );
          }

          t.skip = !whenSkip;

          // if the "when" condition yeld skip to be true
          // then just emit and do not process the task any further
          if (t.skip == true) {
            const result: ITaskResult = {
              task: this.maskSensitiveData(t),
              timings: {} as ITaskTimings,
              data: {} as any,
              status: "Skip",
              skipReason: "When condition",
            };

            this.emitter.emit("task:result", result);
            this.emitter.emit("runbook:log", `${t.name} skipped`);
            this.taskResults.push(result);
            this.emitter.emit("runbook:result", this.taskResults);

            continue;
          }
        }
      }

      // check if the sourced task is with skip = true
      // if yes then set skip = true for the current task
      // emit the event and do not process the task further
      if ((t as ITaskFull).source) {
        const sourcedTask = this.runBook.tasks.filter(
          (ts) => (t as ITaskFull).source == ts.name
        )[0];

        if (sourcedTask.skip == true) {
          const result: ITaskResult = {
            task: this.maskSensitiveData(t),
            timings: {} as ITaskTimings,
            data: {} as any,
            status: "Skip",
            skipReason: "Source skipped",
          };

          this.emitter.emit("task:result", result);
          this.emitter.emit("runbook:log", `${t.name} skipped`);
          this.taskResults.push(result);
          this.emitter.emit("runbook:result", this.taskResults);

          continue;
        }
      }

      if (t.operation == "pause") {
        const timings: ITaskTimings = {
          start: null,
          end: null,
          totalSeconds: -1,
        };

        timings.start = new Date().toISOString();

        const seconds = await this.pause((t.details as any).seconds.toString());

        timings.end = new Date().toISOString();
        timings.totalSeconds = seconds;

        const result: ITaskResult = {
          task: t,
          timings: timings,
          data: [],
          status: "Completed",
        };

        this.emitter.emit("task:result", result);
        this.emitter.emit("runbook:log", `${t.name} complete`);
        this.taskResults.push(result);
        this.emitter.emit("runbook:result", this.taskResults);

        continue;
      }

      if (t.skip == false) await this.taskProcessing(t);
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

    let data = [];

    if (!(task as ITaskFull).environment && task.operation != "pause") {
      data = await this.defaultInstance[`${a[0]}`].getFilter({
        filter: (task as ITaskFull).filter,
      });
    } else {
      data = await this.instances[(task as ITaskFull).environment][
        `${a[0]}`
      ].getFilter({
        filter: (task as ITaskFull).filter,
      });
    }

    // taskOperationMeta.realOperation ?await this.instance

    // this.debug.print(task.name, data.length);
    return { data };
  }

  private async taskProcessing(t: ITask) {
    if (!t.operation) throw new CustomError(1012, t.name, { arg1: t.name });
    let hasOriginalLoop = (t as ITaskFull).loop ? true : false;

    if (!(t as ITaskFull).loop) {
      (t as ITaskFull).loop = {
        values: [],
      };
    }
    if ((t as ITaskFull).options) {
      (t as ITaskFull).options = {
        ...this.taskDefaultOptions,
        ...(t as ITaskFull).options,
      };
    } else {
      (t as ITaskFull).options = { ...this.taskDefaultOptions };
    }

    // part of the dryRun logic. Since during dry run all tasks are converted to xxx.get
    // but still want to report/display as the original operation
    const taskRealOperation = t.operation;

    if (this.dryRun) {
      (t as ITaskFull).options = { allowZero: true, multiple: true };
      if (t.details) delete t.details;

      // NOTE: If the task is going to create/upload a resource then just return an empty array
      if (this.winOperations.dryRunIgnoreOperations.indexOf(t.operation) > -1) {
        const timings: ITaskTimings = {
          start: null,
          end: null,
          totalSeconds: -1,
        };

        const result: ITaskResult = {
          task: this.maskSensitiveData(t),
          timings: {} as ITaskTimings,
          data: {} as any,
          status: "Completed",
          // skipReason: "",
        };

        result.task.operation = taskRealOperation;

        timings.start = new Date().toISOString();
        timings.end = new Date().toISOString();
        timings.totalSeconds =
          (new Date(timings.end).getTime() -
            new Date(timings.start).getTime()) /
          1000;

        result.timings = timings;
        result.data = [];

        this.emitter.emit("task:result", result);
        this.emitter.emit("runbook:log", `${t.name} complete`);
        this.taskResults.push(result);
        this.emitter.emit("runbook:result", this.taskResults);

        return;
      } else {
        const [entity, operation] = t.operation.split(".");

        if (operation != "get" && operation != "getAll")
          t.operation = `${entity}.get` as any;
      }
    }

    try {
      // TODO: data should have type!
      // get the data for the object on which the operation will be performed
      // either from querying QRS (calling /XXX/filter)
      // or from result of previous task

      // check for inline variables inside the filter
      const regex = new RegExp(/(?<=\$\${)(.*?)(?=})/gm);
      if ((t as ITaskFull).filter && regex.test((t as ITaskFull).filter)) {
        (t as ITaskFull).filter = this.replaceInlineVariables(
          (t as ITaskFull).filter,
          t.name
        );
      }

      let data: IRunBookResult = undefined;

      // if task dont have loop then get its data
      // otherwise the data will be defined in the loop section
      if (!hasOriginalLoop) {
        data =
          !(t as ITaskFull).source && t.operation != "pause"
            ? await this.getFilterItems(t).catch((e) => {
                throw new CustomError(1011, t.name, {
                  arg1: t.name,
                  arg2: e.message,
                });
              })
            : this.taskResults.find(
                (a) => a.task.name == (t as ITaskFull).source
              );
      }
      // process the task, push the result to taskResult variable
      const timings: ITaskTimings = {
        start: null,
        end: null,
        totalSeconds: -1,
      };

      // check for inline variables inside the task details
      const regex1 = new RegExp(/(?<=\$\${)(.*?)(?=})/gm);
      if (t.details && regex1.test(JSON.stringify(t.details))) {
        t.details = this.replaceInlineVariables(t.details, t.name);
      }

      t = this.replaceSpecialVariables(t);

      const result: ITaskResult = {
        task: this.maskSensitiveData(t),
        timings: {} as ITaskTimings,
        data: {} as any,
        status: "Completed",
      };

      timings.start = new Date().toISOString();

      let taskResults: IRunBookResult[] = [];

      // loop through all values and execute the task again
      if (
        (t as ITaskFull).loop &&
        (t as ITaskFull).loop.values.length > 0 &&
        (t as ITaskFull).options.loopParallel == true
      ) {
        taskResults = await Promise.all(
          (t as ITaskFull).loop.values.map((loopValue, i) => {
            return this.runTaskLoop(t, i, data, loopValue);
          })
        ).then((r) => r.flat());
      } else {
        let taskResultPostLoop: IRunBookResult[][] = [];

        if ((t as ITaskFull).loop.values.length == 0) {
          const task = (t as ITaskFull).environment
            ? new Task(
                t as ITaskFull,
                this.instances[(t as ITaskFull).environment],
                data
              )
            : new Task(t as ITaskFull, this.defaultInstance, data);

          // const task = new Task(t, this.instance, data);
          const taskResult = await task.process();
          taskResultPostLoop.push(taskResult);
        } else {
          for (let i = 0; i < (t as ITaskFull).loop.values.length; i++) {
            const loopedData = await this.runTaskLoop(
              t,
              i,
              data,
              (t as ITaskFull).loop.values[i]
            );

            taskResultPostLoop.push(loopedData);

            if ((t as ITaskFull).loop.hasOwnProperty("pause"))
              await this.pause((t.details as any).seconds.toString());
          }
        }

        taskResults = taskResultPostLoop.flat();
      }

      timings.end = new Date().toISOString();
      timings.totalSeconds =
        (new Date(timings.end).getTime() - new Date(timings.start).getTime()) /
        1000;

      result.timings = timings;
      result.data = taskResults.flat();

      result.task.operation = taskRealOperation;

      this.emitter.emit("task:result", result);
      this.emitter.emit("runbook:log", `${t.name} complete`);
      this.taskResults.push(result);
      this.emitter.emit("runbook:result", this.taskResults);
    } catch (e) {
      const result: ITaskResult = {
        task: this.maskSensitiveData(t),
        status: "Error",
        data: [],
        timings: { start: "", end: "", totalSeconds: -1 },
      };

      result.task.operation = taskRealOperation;

      this.taskResults.push(result);

      this.emitter.emit("runbook:result", this.taskResults);

      // ignore the error and continue with the next task
      // (outside the onError block)
      if ((t as ITaskFull).onError && (t as ITaskFull).onError.ignore) return;
      // if ignore is specifically set to false - throw the error
      if ((t as ITaskFull).onError && (t as ITaskFull).onError.ignore == false)
        throw e;

      // throw custom error if onError.exit is provided
      if ((t as ITaskFull).onError && (t as ITaskFull).onError.exit)
        throw new CustomError(1017, t.name);

      // if there are any tasks specified in onError block
      // loop through them and run them as regular tasks
      if (
        (t as ITaskFull).onError &&
        (t as ITaskFull).onError.tasks?.length > 0
      ) {
        for (let onErrorTask of (t as ITaskFull).onError.tasks) {
          if (!onErrorTask.skip) await this.taskProcessing(onErrorTask);
        }
      }

      if (!(t as ITaskFull).onError) throw e;
    }
  }

  private async runTaskLoop(t: ITask, i: number, data: any, loopValue: ILoop) {
    const taskWithReplacedLoopVariables = this.replaceLoopVariablesInTask(
      t,
      loopValue,
      i
    );
    // delete taskWithReplacedLoopVariables.loop;

    if (!data || data.data.length == 0)
      data = !(taskWithReplacedLoopVariables as ITaskFull).source
        ? await this.getFilterItems(taskWithReplacedLoopVariables).catch(
            (e) => {
              throw new CustomError(1011, taskWithReplacedLoopVariables.name, {
                arg1: taskWithReplacedLoopVariables.name,
                arg2: e.message,
              });
            }
          )
        : this.taskResults.find(
            (a) =>
              a.task.name == (taskWithReplacedLoopVariables as ITaskFull).source
          );

    const task = taskWithReplacedLoopVariables.name
      ? new Task(
          taskWithReplacedLoopVariables as ITaskFull,
          this.instances[
            (taskWithReplacedLoopVariables as ITaskFull).environment
          ],
          data
        )
      : new Task(
          taskWithReplacedLoopVariables as ITaskFull,
          this.defaultInstance,
          data
        );

    const taskResult = await task.process();

    // by default all sensitive data will be automatically masked
    // unless the task options specifically disables this behavior
    // aka: options.unmaskSecrets == true
    const dataToReturn =
      (t as ITaskFull).options.unmaskSecrets == true
        ? taskResult
        : this.maskSensitiveDataDetails(taskResult, t.operation);

    return dataToReturn;
  }

  private replaceLoopVariablesInTask(
    task: ITask,
    loopValue: ILoop,
    index: number
  ) {
    // get all instances of something between {{ and }}
    const regex = new RegExp(/(?<={{)(.*?)(?=}})/gm);
    // make the task string
    const taskStringTemplate = JSON.stringify(task);
    // find all instances of loop variables into the stringified task
    const loopVariables = [...taskStringTemplate.matchAll(regex)];

    // if loop is defined but not loop variables are found - throw an error
    if (loopVariables.length == 0)
      throw new CustomError(1027, "RunBook", {
        arg1: task.name,
      });

    let taskString = taskStringTemplate;

    // loop through all loop variables instances
    loopVariables.map((v) => {
      const value = v[0].trim();
      // if index then replace the content with the current loop index
      if (value == "index")
        taskString = taskString.replaceAll(`{{${v[0]}}}`, index as any);

      // if item then replace the content with the current loop value
      if (value == "item")
        taskString = taskString.replaceAll(`{{${v[0]}}}`, loopValue as any);

      // if starts with item. then the loop values are in object format
      if (value.startsWith("item.")) {
        // get the property name
        const b = value.replace("item.", "");

        // if the current loop value dont have the provided property - throw an error
        if (!loopValue.hasOwnProperty(b))
          throw new CustomError(1028, "RunBook", {
            arg1: task.name,
            arg2: b,
          });

        // replace all instances with the loop value property
        taskString = taskString.replaceAll(`{{${v[0]}}}`, loopValue[b]);
      }
    });

    const newTask = JSON.parse(taskString) as ITask;

    return newTask;
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

            // once we have the values
            // check if they are strings or numbers
            // if numbers then join them directly
            // if not then wrap them in single quote before joining
            const IsNumericString =
              p.filter(function (i) {
                return isNaN(i);
              }).length > 0;

            if (IsNumericString) {
              parsedJsElements = parsedJsElements.replaceAll(
                `$$\{${ic}}`,
                `['${[...p].join("','")}']`
              );
            } else {
              parsedJsElements = parsedJsElements.replaceAll(
                `$$\{${ic}}`,
                `[${[...p].join(",")}]`
              );
            }
          }
        }
      });
    }

    return parsedJsElements;
  }

  async pause(seconds: string) {
    const numSeconds = parseFloat(seconds) * 1000;

    await new Promise((resolve) => setTimeout(resolve, numSeconds));

    return numSeconds;
  }
}
