import { IRunBookResult } from "./Runner";
import { ITask } from "./RunBook.interfaces";
import { CustomError } from "../util/CustomError";
import { Debugger } from "../util/Debugger";
import { WinOperations } from "../util/WinOperations";
import { QlikRepoApi } from "qlik-repo-api";

const winOperations = new WinOperations();
export class Task {
  task: ITask;
  instance: QlikRepoApi.client;
  objectsData?: any; // IRunBookResult;
  debug: Debugger;
  private isNoSource: boolean;
  constructor(task: ITask, instance: any, objectsData?: IRunBookResult) {
    this.task = task;
    this.instance = instance;
    this.objectsData = objectsData;
    this.debug = new Debugger();

    this.taskDataChecks();
  }

  // TODO: can this be simplified?!
  async process(): Promise<IRunBookResult[]> {
    const a = this.task.operation.split(".");
    const op = winOperations.filter(this.task.operation);

    // app.exportMany is slightly different.
    // And should be handled separately :(
    if ((this.task.operation as string) == "app.exportMany") {
      // if "source" is provided then call the export()
      // method of each object from the source task
      // no need to call the "filter" again. Will have to
      // build the filter manually and this can lead to some issues
      if (!this.task.filter && this.task.source) {
        return await Promise.all(
          this.objectsData.data.map((o) => {
            return o["export"]({ ...this.task.details });
          })
        );
      }

      // if "filter" is provided then just pass it as it is
      return (await this.instance.apps
        .exportMany({ filter: this.task.filter, ...this.task.details })
        .catch((e) => {
          e.message = `REST communication error! ${e.message}`;
          e.stack = "";
          throw e;
        })) as any;
    }

    // some tasks have to be "renamed" to match the corresponding method
    // for example:
    //    virtualProxy -> virtualProxies
    //    customProperty -> customProperties
    if (a[0].substring(a[0].length - 1) == "y" && op.isPlural)
      a[0] = `${a[0].substring(0, a[0].length - 1)}ie`;

    // if the task do NOT require initial data (filter or source)
    // for example about.*, app.import etc
    if (this.isNoSource) {
      if (
        winOperations.nonSourceOperationsPlural.indexOf(this.task.operation) ==
        -1
      ) {
        if (a[0].substring(a[0].length - 2) == "ie") a[0] = `${a[0]}s`;
        return await this.instance[a[0]]
          [a[1]](this.task.details || {}, this.task.options)
          .catch((e) => {
            e.message = `REST communication error! ${e.message}`;
            e.stack = "";
            throw e;
          });
      }

      return await this.instance[`${a[0]}s`]
        [a[1]](this.task.details || {}, this.task.options)
        .catch((e) => {
          e.message = `REST communication error! ${e.message}`;
          e.stack = "";
          throw e;
        });
    }

    // if the task require initial data
    if (a[1] == "get" || a[1] == "getAll") return this.objectsData.data; //.map((d) => d.details);

    if (!Array.isArray(this.objectsData.data))
      // check if the previous data is an array
      // and if its not then call the method directly
      return await this.objectsData.data[a[1]](
        this.task.details || {},
        this.task.options
      );

    // if the previous data is an array
    // loop though all elements and call the method in each element
    return await Promise.all(
      this.objectsData.data.map(async (obj) => {
        return obj[a[1]](this.task.details, this.task.options);
      })
    );
  }

  private taskDataChecks(): void {
    if (!this.task.operation) throw new CustomError(1010, this.task.name);

    if (this.task.filter && this.task.filter == "")
      throw new CustomError(1008, this.task.name);

    if (this.task.filter && this.task.source == "")
      throw new CustomError(1009, this.task.name);

    if (winOperations.nonSourceOperations.indexOf(this.task.operation) > -1) {
      this.isNoSource = true;
      return;
    }

    if (!this.task.source && !this.task.filter)
      throw new CustomError(1003, this.task.name, { arg1: this.task.name });

    // if no objects are found throw an error
    if (this.objectsData.data.length == 0) {
      if (!this.task.options)
        throw new CustomError(1004, this.task.name, { arg1: this.task.name });

      if (this.task.options.allowZero == false)
        throw new CustomError(1007, this.task.name, { arg1: this.task.name });
    }

    // by default task will throw an error if multiple objects are returned and config is missing
    if (
      this.objectsData.data.length > 1 &&
      !this.task.options &&
      (!this.task.operation.indexOf(".get") ||
        !this.task.operation.indexOf(".getAll"))
    )
      throw new CustomError(1005, this.task.name, { arg1: this.task.name });

    // multiple objects are returned and config.multiple is set to false
    if (
      this.objectsData.data.length > 1 &&
      this.task.options &&
      !this.task.options.multiple
    )
      throw new CustomError(1006, this.task.name, { arg1: this.task.name });
  }
}
