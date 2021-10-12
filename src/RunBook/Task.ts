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

    this.taskDataChecks();
  }

  async process(): Promise<IRunBookResult[]> {
    const a = this.task.operation.split(".");

    if (a[1] == "get") return this.objectsData.data; //.map((d) => d.details);

    return await Promise.all(
      this.objectsData.data.map(async (obj) => obj[a[1]](this.task.details))
    );
  }

  private taskDataChecks(): void {
    // TODO: dont check for non-sourced tasks. Like imports, uploads etc
    if (!this.task.source && !this.task.filter)
      throw new CustomError(1003, this.task.name, { arg1: this.task.name });

    // if no objects are found throw an error
    // TODO: handle t.config.allowZero
    if (this.objectsData.data.length == 0) {
      if (!this.task.config)
        throw new CustomError(1004, this.task.name, { arg1: this.task.name });

      if (this.task.config.allowZero == false)
        throw new CustomError(1004, this.task.name, { arg1: this.task.name });
    }

    // by default task will throw an error if multiple objects are returned and config is missing
    if (this.objectsData.data.length > 1 && !this.task.config)
      throw new CustomError(1005, this.task.name, { arg1: this.task.name });

    // multiple objects are returned and config.multiple is set to false
    if (
      this.objectsData.data.length > 1 &&
      this.task.config &&
      !this.task.config.multiple
    )
      throw new CustomError(1006, this.task.name, { arg1: this.task.name });
  }
}
