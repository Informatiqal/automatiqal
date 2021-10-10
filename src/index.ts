// import { QlikRepoApi } from "qlik-repo-api";
import { QlikRepoApi } from "../../qlik-repo-api/src/index";
import { QlikSaaSApi } from "qlik-saas-api";

import { IRunBookResult, ITaskResult, Runner } from "./RunBook/Runner";
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

    // set default trace level if not provided in the run book
    if (!this.runBook.trace) this.runBook.trace = "error";

    // perform obvious checks before execution
    this.initialChecks();

    // if QSEoW - set up Qlik Repo client
    if (runBook.edition == "windows") {
      this.restInstance = new QlikRepoApi.client({
        port: runBook.environment.port,
        httpsAgent: httpsAgent,
        host: runBook.environment.host,
        proxy: runBook.environment.proxy ? runBook.environment.proxy : "",
        authentication: runBook.environment.authentication,
      });
    }

    // initialize the Runner
    this.runner = new Runner(this.runBook, this.restInstance);
  }

  async run(): Promise<ITaskResult[]> {
    return await this.runner.start();
  }

  private initialChecks() {
    if (!this.runBook.tasks || this.runBook.tasks.length == 0)
      throw new CustomError(1000, "RunBook");

    this.checkDuplicateTasks();

    if (this.runBook.edition != "windows" && this.runBook.edition != "saas")
      throw new CustomError(1001, "RunBook", { arg1: this.runBook.edition });
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
