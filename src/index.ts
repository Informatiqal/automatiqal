import { QlikRepoApi } from "qlik-repo-api";
import { QlikSaaSApi } from "qlik-saas-api";

import { IRunBookResult, ITaskResult, Runner } from "./RunBook/Runner";
import { IRunBook, ITask } from "./RunBook/RunBook.interfaces";
import { CustomError } from "./util/CustomError";
import { EventsBus } from "./util/EventBus";
import { WinOperations } from "./util/WinOperations";

const winOperations = new WinOperations();

type initialChecksNames =
  | "checkDuplicateTasks"
  | "checkWrongOperation"
  | "checkMissingSource"
  | "checkCustomPropertiesName"
  | "checkCorrectSource";

export class Automatiqal {
  private runBook: IRunBook;
  private restInstance: QlikRepoApi.client | QlikSaaSApi.client;
  private runner: Runner;
  private initialChecksList: initialChecksNames[];
  emitter: EventsBus;

  constructor(
    runBook: IRunBook,
    httpsAgent?: any,
    initialChecksList?: initialChecksNames[]
  ) {
    this.runBook = runBook;
    this.emitter = new EventsBus();
    this.initialChecksList = initialChecksList;

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

    if (runBook.edition == "saas") {
      console.log("TBA");
      process.exit(1);
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

    let errors: string[] = [];

    if (!this.initialChecksList) {
      console.log(
        `INFO: No "initialChecksList" specified. Running all initial checks ...`
      );
    }

    if (this.initialChecksList) {
      console.log(
        `INFO: "initialChecksList" specified. Running only ${this.initialChecksList.join(
          `, `
        )}`
      );
    }

    // TODO: anyway to solve this in a different way?
    if (!this.initialChecksList || this.initialChecksList.length == 0) {
      try {
        this.checkDuplicateTasks();
      } catch (e) {
        errors.push(e.context);
      }

      try {
        this.checkWrongOperation();
      } catch (e) {
        errors.push(e.context);
      }

      try {
        this.checkMissingSource();
      } catch (e) {
        errors.push(e.context);
      }

      try {
        this.checkCustomPropertiesName();
      } catch (e) {
        errors.push(e.context);
      }

      try {
        this.checkCorrectSource();
      } catch (e) {
        errors.push(e.context);
      }
    } else {
      if (this.initialChecksList.includes("checkDuplicateTasks")) {
        try {
          this.checkDuplicateTasks();
        } catch (e) {
          errors.push(e.context);
        }
      }

      if (this.initialChecksList.includes("checkWrongOperation")) {
        try {
          this.checkWrongOperation();
        } catch (e) {
          errors.push(e.context);
        }
      }

      if (this.initialChecksList.includes("checkMissingSource")) {
        try {
          this.checkMissingSource();
        } catch (e) {
          errors.push(e.context);
        }
      }

      if (this.initialChecksList.includes("checkCustomPropertiesName")) {
        try {
          this.checkCustomPropertiesName();
        } catch (e) {
          errors.push(e.context);
        }
      }

      if (this.initialChecksList.includes("checkCorrectSource")) {
        try {
          this.checkCorrectSource();
        } catch (e) {
          errors.push(e.context);
        }
      }
    }

    if (errors.length > 0) throw new Error(errors.join("\n"));

    if (!this.runBook.edition) this.runBook.edition = "windows";

    if (this.runBook.edition != "windows" && this.runBook.edition != "saas")
      throw new CustomError(1001, "RunBook", { arg1: this.runBook.edition });
  }

  private checkDuplicateTasks(): void {
    const duplicateTasks = this.runBook.tasks
      .map((t) => `"${t.name}"`)
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

  private checkMissingSource() {
    const missingSource = this.runBook.tasks
      .filter((t) => !t.source && !t.filter)
      .map((t) => {
        const i = winOperations.nonSourceOperations.indexOf(t.operation);

        if (i == -1) return t;

        return { name: "EXISTS" } as ITask;
      })
      .filter((t) => t.name != "EXISTS")
      .map((t) => `"${t.name}"`);

    if (missingSource.length > 0)
      throw new CustomError(1014, "RunBook", {
        arg1: missingSource.join(", "),
      });
  }

  private checkWrongOperation() {
    const nonExistingOps = this.runBook.tasks
      .map((t) => {
        const i = winOperations.names.indexOf(t.operation);

        if (i == -1) return t;

        return { name: "EXISTS" } as ITask;
      })
      .filter((t) => t.name != "EXISTS")
      .map((t) => `"${t.operation}"`);

    if (nonExistingOps.length > 0)
      throw new CustomError(1013, "RunBook", {
        arg1: nonExistingOps.join(", "),
      });
  }

  private checkCustomPropertiesName() {
    const cpRelatesTasks = this.runBook.tasks.filter(
      (t) =>
        t.operation == "customProperty.update" ||
        t.operation == "customProperty.create"
    );

    const incorrectValues = cpRelatesTasks
      .map((t) => {
        const a = /^[A-Za-z0-9_]+$/.test((t.details as any).name);
        if (a == false) return (t.details as any).name;

        return undefined;
      })
      .filter((v) => v != undefined);

    if (incorrectValues.length > 0)
      throw new CustomError(1015, "RunBook", {
        arg1: incorrectValues.join(", "),
      });
  }

  private checkCorrectSource() {
    // for tasks that are using "source" property
    // check if the sourced tasks is of the same type
    // as the current task. For example:
    // if the sourced task is "app.get"
    // and the current ask is "stream.update"
    // its obvious that error will be returned from Qlik.
    // No point of running the whole runbook if its known
    // from the beginning that the task will fail

    // TODO: any exclusions from this rule?
    const tasksReturnTypes = winOperations.opTypes;

    const opMismatchTasks = this.runBook.tasks
      .filter((t) => t.hasOwnProperty("source"))
      .filter((t) => {
        const sourceTask = this.runBook.tasks.filter(
          (ts) => ts.name == t.source
        )[0];
        const sourceReturnType = tasksReturnTypes[sourceTask.operation];

        return sourceReturnType != tasksReturnTypes[t.operation];
      })
      .map((t) => `"${t.name}"`);

    if (opMismatchTasks.length > 0) {
      throw new CustomError(1016, "RunBook", {
        arg1: opMismatchTasks.join(", "),
      });
    }
  }
}
