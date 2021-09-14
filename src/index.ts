// import { QlikRepoApi } from "qlik-repo-api";
import { QlikRepoApi } from "../../qlik-repo-api/src/index";
import { QlikSaaSApi } from "qlik-saas-api";

import { IRunBookResult, Runner } from "./RunBook/Runner";
import { IRunBook } from "./RunBook/RunBook.interfaces";
import { CustomError } from "./util/CustomError";
import { EventsBus } from "./util/EventBus";

export class Automatiqal {
  private runBook: IRunBook;
  private restInstance: QlikRepoApi.client | QlikSaaSApi.client;
  private runner: Runner;
  emitter: EventsBus;

  constructor(runBook: IRunBook, httpsAgent?: any) {
    this.runBook = runBook;
    this.emitter = new EventsBus();

    if (!this.runBook.trace) this.runBook.trace = "error";

    if (!runBook.tasks || runBook.tasks.length == 0)
      throw new CustomError(1000, "RunBook");

    this.checkDuplicateTasks();

    if (runBook.edition != "windows" && runBook.edition != "saas")
      throw new CustomError(1001, "RunBook", { arg1: runBook.edition });

    if (runBook.edition == "windows") {
      this.restInstance = new QlikRepoApi.client({
        port: runBook.environment.port,
        httpsAgent: httpsAgent,
        host: runBook.environment.host,
        proxy: runBook.environment.proxy ? runBook.environment.proxy : "",
        authentication: runBook.environment.authentication,
      });
    }

    this.runner = new Runner(this.runBook, this.restInstance);
  }

  async run(): Promise<IRunBookResult[]> {
    let a = 1;
    return await this.runner.start();
  }

  private checkDuplicateTasks(): void {
    const duplicateTasks = this.runBook.tasks
      .map((t) => t.name)
      .filter(
        (
          (s) => (v) =>
            s.has(v) || !s.add(v)
        )(new Set())
      );

    if (duplicateTasks.length > 0)
      throw new CustomError(1002, "RunBook", {
        arg1: duplicateTasks.join(", "),
      });
  }
}
