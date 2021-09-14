import { IRunBookResult } from "./Runner";
import { ITask } from "./RunBook.interfaces";
import { CustomError } from "../util/CustomError";
import { Debugger } from "../util/Debugger";

export class Task {
  task: ITask;
  instance: any;
  objectsData?: any; // IRunBookResult;
  debug: Debugger;
  constructor(task: ITask, instance: any, objectsData?: IRunBookResult) {
    this.task = task;
    this.instance = instance;
    this.objectsData = objectsData;
    this.debug = new Debugger();
    // TODO: dont check for non-sourced tasks. Like imports, uploads etc
    if (!task.source && !task.filter)
      throw new CustomError(1003, task.name, { arg1: task.name });
  }

  async process(): Promise<IRunBookResult[]> {
    const a = this.task.operation.split(".");

    if (a[1] == "get") return this.objectsData.map((d) => d.details);

    return await Promise.all(
      this.objectsData.map(async (obj) => obj[a[1]](this.task.details))
    );
  }
}
