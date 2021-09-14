import { QlikRepoApi } from "qlik-repo-api";
// import { QlikSaaSApi } from "qlik-saas-api";
import { CustomError } from "../util/CustomError";
import { IRunBook, ITask } from "./RunBook.interfaces";
import { Task } from "./Task";
import { Debugger } from "../util/Debugger";
import { EventsBus } from "../util/EventBus";

export interface IRunBookResult {
  task: string;
  // result: ITaskResult;
  error?: boolean;
  errorMessage?: string;
}

export class Runner {
  runBook: IRunBook;
  instance: QlikRepoApi.client;
  debug: Debugger;
  private taskResults: any[];
  private emitter: EventsBus;
  constructor(runBook: IRunBook, instance) {
    this.runBook = runBook;
    this.instance = instance;
    this.taskResults = [];
    this.debug = new Debugger(this.runBook.trace);
    this.emitter = new EventsBus();
  }

  async start(): Promise<IRunBookResult[]> {
    return await Promise.all(
      this.runBook.tasks.map(async (t) => {
        // TODO: data should have type!
        // get the data for the object on which the operation will be performed
        // either from querying QRS (calling /XXX/filter)
        // or from result of previous task
        const data = !t.source
          ? await this.getFilterItems(t)
          : this.taskResults.find((a) => a.task == t.source);

        // if no objects are found throw an error
        // TODO: handle t.config.allowZero
        if (data.length == 0)
          throw new CustomError(1004, t.name, { arg1: t.name });

        // by default task will throw an error if multiple objects are returned and config is missing
        if (data.length > 1 && !t.config)
          throw new CustomError(1005, t.name, { arg1: t.name });

        // multiple objects are returned and config.multiple is set to false
        if (data.length > 1 && t.config && !t.config.multiple)
          throw new CustomError(1006, t.name, { arg1: t.name });

        // if all good - process the task, push the result to taskResult variable
        const task = new Task(t, this.instance, data);
        return await task.process().then((taskResult) => {
          this.emitter.emit("task:result", ...taskResult);
          this.taskResults.push(...taskResult);
          return taskResult;
        });
      })
    ).then(() => this.taskResults);
  }

  private async getFilterItems(task: ITask): Promise<any> {
    const a = task.operation.split(".");

    if (a.length == 1) {
      // TODO: special operation? debug? continue?
    }
    const data = await this.instance[`${a[0]}s`].getFilter({
      filter: task.filter,
    });

    this.debug.print(task.name, data.length);
    return data;
  }
}
