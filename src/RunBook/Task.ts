import { IRunBookResult } from "./Runner";
import { ITask } from "./RunBook.interfaces";
import { CustomError } from "../util/CustomError";
import { Debugger } from "../util/Debugger";
import { QlikRepoApi } from "qlik-repo-api";

export const winOperations: {
  name: string;
  isNonSource: boolean;
  type?: string;
  isPlural?: boolean;
}[] = [
  { name: "about.apiDefaults", isNonSource: true },
  { name: "about.apiDescription", isNonSource: true },
  { name: "about.apiRelations", isNonSource: true },
  { name: "about.enums", isNonSource: true },
  { name: "about.openApi", isNonSource: true },
  { name: "about.get", isNonSource: true },
  { name: "app.upload", isNonSource: true, type: "App", isPlural: true },
  { name: "app.remove", isNonSource: false, type: "App" },
  { name: "app.update", isNonSource: false, type: "App" },
  { name: "app.copy", isNonSource: false, type: "App" },
  { name: "app.publish", isNonSource: false, type: "App" },
  { name: "app.switch", isNonSource: false, type: "App" },
  { name: "app.get", isNonSource: false, type: "App" },
  { name: "stream.get", isNonSource: false, type: "Stream" },
  { name: "certificate.export", isNonSource: true },
  { name: "stream.remove", isNonSource: false, type: "Stream" },
  { name: "stream.update", isNonSource: false, type: "Stream" },
  { name: "virtualProxy.create", isNonSource: true, type: "VirtualProxy" },
  { name: "virtualProxy.update", isNonSource: false, type: "VirtualProxy" },
  { name: "node.get", isNonSource: false, type: "Node" },
  { name: "tag.create", isNonSource: true, type: "Tag", isPlural: true },
  { name: "tag.update", isNonSource: false, type: "Tag" },
  { name: "tag.remove", isNonSource: false, type: "Tag" },
];

// TODO: add all required tasks
export const nonSourceOperations = winOperations
  .filter((o) => o.isNonSource == true)
  .map((o) => o.name);

export const nonSourceOperationsPlural = winOperations
  .filter((o) => o.isPlural == true)
  .map((o) => o.name);

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

    // some tasks have to be "renamed" to match the corresponding method
    // for example:
    //    virtualProxy -> virtualProxies
    //    customProperty -> customProperties
    if (a[0].substring(a[0].length - 1) == "y")
      a[0] = `${a[0].substring(0, a[0].length - 1)}ies`;

    // if the task do NOT require initial data (filter or source)
    // for example about.*, app.import etc
    if (this.isNoSource) {
      if (nonSourceOperationsPlural.indexOf(this.task.operation) == -1)
        return await this.instance[a[0]][a[1]](this.task.details || {});

      return await this.instance[`${a[0]}s`][a[1]](this.task.details || {});
    }

    // if the task require initial data
    if (a[1] == "get") return this.objectsData.data; //.map((d) => d.details);

    // check if the previous data is an array
    // and if its not then call the method directly
    if (!Array.isArray(this.objectsData.data))
      return await this.objectsData.data[a[1]](this.task.details || {});

    // if the previous data is an array
    // loop though all elements and call the method in each element
    return await Promise.all(
      this.objectsData.data.map(async (obj) => {
        // let a1 = 1;
        return obj[a[1]](this.task.details);
      })
    );
  }

  private taskDataChecks(): void {
    if (!this.task.operation) throw new CustomError(1010, this.task.name);

    if (this.task.filter && this.task.filter == "")
      throw new CustomError(1008, this.task.name);

    if (this.task.filter && this.task.source == "")
      throw new CustomError(1009, this.task.name);

    if (nonSourceOperations.indexOf(this.task.operation) > -1) {
      this.isNoSource = true;
      return;
    }

    if (!this.task.source && !this.task.filter)
      throw new CustomError(1003, this.task.name, { arg1: this.task.name });

    // if no objects are found throw an error
    if (this.objectsData.data.length == 0) {
      if (!this.task.config)
        throw new CustomError(1004, this.task.name, { arg1: this.task.name });

      if (this.task.config.allowZero == false)
        throw new CustomError(1007, this.task.name, { arg1: this.task.name });
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
