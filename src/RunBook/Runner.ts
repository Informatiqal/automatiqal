import { QlikRepoApi } from "qlik-repo-api";
// import { QlikSaaSApi } from "qlik-saas-api";
// import { CustomError } from "../util/CustomError";
import { IRunBook, ITask } from "./RunBook.interfaces";
import { Task, nonSourceOperations } from "./Task";
import { Debugger } from "../util/Debugger";
import { EventsBus } from "../util/EventBus";

export interface IRunBookResult {
  task: string;
  // result: ITaskResult;
  error?: boolean;
  errorMessage?: string;
}

export interface ITaskTimings {
  start: string;
  end: string;
  totalSeconds: number;
}

export interface ITaskResult {
  data: IRunBookResult[];
  task: ITask;
  timings: ITaskTimings;
  status: "completed" | "error" | "skip";
}

export class Runner {
  runBook: IRunBook;
  instance: QlikRepoApi.client;
  debug: Debugger;
  private taskResults: ITaskResult[];
  private emitter: EventsBus;
  constructor(runBook: IRunBook, instance) {
    this.runBook = runBook;
    this.instance = instance;
    this.taskResults = [];
    this.debug = new Debugger(this.runBook.trace);
    this.emitter = new EventsBus();
  }

  async start(): Promise<ITaskResult[]> {
    //return await Promise.all(
    // this.runBook.tasks.forEach(async (t) => {
    for (let t of this.runBook.tasks) {
      // TODO: data should have type!
      // get the data for the object on which the operation will be performed
      // either from querying QRS (calling /XXX/filter)
      // or from result of previous task
      const data = !t.source
        ? await this.getFilterItems(t)
        : this.taskResults.find((a) => a.task.name == t.source);

      // process the task, push the result to taskResult variable
      const timings: ITaskTimings = {
        start: null,
        end: null,
        totalSeconds: -1,
      };

      try {
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
            status: "completed",
          };
          this.emitter.emit("task:result", result);
          this.taskResults.push(result);
          this.emitter.emit("runbook:result", this.taskResults);
          return result;
        });
      } catch (e) {
        this.taskResults.push({
          task: t,
          status: "error",
          data: [],
          timings: { start: "", end: "", totalSeconds: -1 },
        });
        this.emitter.emit("runbook:result", this.taskResults);

        // TODO: handle onError block section (if any)
        if (t.onError) {
          let a = 1;
        }

        throw e;
      }
    }
    //   this.runBook.tasks.map(async (t) => {

    //   })
    // )

    //.then(() => this.taskResults);
    return this.taskResults;
  }

  private async getFilterItems(task: ITask): Promise<any> {
    const a = task.operation.split(".");

    if (nonSourceOperations.indexOf(task.operation) > -1) {
      this.debug.print(task.name, "0");
      return {};
    }

    // NOTE: special operation? debug? continue?
    // if (a.length == 1) {
    // }

    const data = await this.instance[`${a[0]}s`].getFilter({
      filter: task.filter,
    });

    this.debug.print(task.name, data.length);
    return { data };
  }
}
