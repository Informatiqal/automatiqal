import { QlikRepoApi } from "qlik-repo-api";
// import { QlikSaaSApi } from "qlik-saas-api";
// import { CustomError } from "../util/CustomError";
import { IRunBook, ITask } from "./RunBook.interfaces";
import { Task } from "./Task";
import { Debugger } from "../util/Debugger";
import { EventsBus } from "../util/EventBus";
import { CustomError } from "../util/CustomError";
import { WinOperations } from "../util/WinOperations";

const winOperations = new WinOperations();
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
  // private inlineVariablesRegex = /(?<=\$\${)(.*?)(?=})/; // match values - $${xxxx}
  private inlineVariablesRegex = /(?<=\$\${)(.*?)(?=})/g; // match ALL values - $${xxxx}
  constructor(runBook: IRunBook, instance) {
    this.runBook = runBook;
    this.instance = instance;
    this.taskResults = [];
    this.emitter = new EventsBus();
    this.debug = new Debugger(this.runBook.trace, this.emitter);
  }

  async start(): Promise<ITaskResult[]> {
    //return await Promise.all(
    // this.runBook.tasks.forEach(async (t) => {
    for (let t of this.runBook.tasks) {
      if (!t.skip) await this.taskProcessing(t);
    }

    return this.taskResults;
  }

  private async getFilterItems(task: ITask): Promise<any> {
    const a = task.operation.split(".");

    if (winOperations.nonSourceOperations.indexOf(task.operation) > -1) {
      // this.debug.print(task.name, "0");
      return {};
    }

    // NOTE: special operation? debug? continue?
    // if (a.length == 1) {
    // }

    if (a[0].substring(a[0].length - 1) == "y") {
      a[0] = `${a[0].substring(0, a[0].length - 1)}ies`;
    } else {
      a[0] = `${a[0]}s`;
    }

    const data = await this.instance[`${a[0]}`].getFilter({
      filter: task.filter,
    });

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

      if (
        t.details &&
        this.inlineVariablesRegex.test(JSON.stringify(t.details))
      )
        t.details = this.replaceInlineVariables(t.details, t.name);

      const task = new Task(t, this.instance, data);
      timings.start = new Date().toISOString();

      await task.process().then((taskResult) => {
        timings.end = new Date().toISOString();
        timings.totalSeconds =
          (new Date(timings.end).getTime() -
            new Date(timings.start).getTime()) /
          1000;

        const result: ITaskResult = {
          task: t,
          timings: timings,
          data: taskResult,
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
        task: t,
        status: "Error",
        data: [],
        timings: { start: "", end: "", totalSeconds: -1 },
      });
      this.emitter.emit("runbook:result", this.taskResults);

      // ignore the error and continue with the next task
      // (outside the onError block)
      if (t.onError && t.onError.ignore) return;

      // throw custom error if onError.exit is provided
      if (t.onError && t.onError.exit) throw new CustomError(1017, t.name);

      // if there are any tasks specified in onError block
      // loop through them and run them as regular tasks
      if (t.onError && t.onError.tasks.length > 0) {
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
    Object.entries(details).map(([key, value]) => {
      if (this.inlineVariablesRegex.test(JSON.stringify(value))) {
        const prevTaskName = JSON.stringify(value).match(
          this.inlineVariablesRegex
        );

        const prevTaskIds = prevTaskName.map((d) =>
          this.getPropertyFromTaskResult(d)
        );
        if (Array.isArray(value)) {
          details[key] = [...prevTaskIds];
        }

        if (typeof value == "string") {
          if (prevTaskIds.length > 0)
            throw new CustomError(1021, "", {
              arg1: value,
              arg2: key,
              arg3: taskName,
            });
          details[key] = prevTaskIds.join("");
        }
      }
    });

    return details;
  }

  private getPropertyFromTaskResult(taskName: string) {
    const [name, property] = taskName.split("#");

    const taskResult = this.taskResults.filter((r) => r.task.name == name)[0];

    // if property is used then return its value
    // else return ID as default
    if (Array.isArray(taskResult.data))
      return (taskResult.data as IRunBookResult[]).map(
        (d) => d.details[property ? property : "id"]
      );

    return [
      (taskResult.data as IRunBookResult).details[property ? property : "id"],
    ];
  }
}
