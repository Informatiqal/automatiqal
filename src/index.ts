import { QlikRepoApi } from "qlik-repo-api";
import { QlikSaaSApi } from "qlik-saas-api";
import {
  automatiqalWindowsSchema,
  automatiqalSaaSSchema,
} from "@informatiqal/automatiqal-schema";
import Ajv, { ValidateFunction } from "ajv";
import ajvErrors from "ajv-errors";

import { ITaskResult, Runner } from "./RunBook/Runner";
import { IRunBook, ITask } from "./RunBook/RunBook.interfaces";
import { CustomError } from "./util/CustomError";
import { EventsBus } from "./util/EventBus";
import { Operations } from "./util/operations/index";

export type initialChecksNames =
  | "checkDuplicateTasks"
  | "checkWrongOperation"
  | "checkMissingSource"
  | "checkCustomPropertiesName"
  | "checkCorrectSource"
  | "checkValidTaskName";

export class Automatiqal {
  runBook: IRunBook;
  #tasksListFlat: ITask[];
  #taskNames: string[];
  #restInstance: QlikRepoApi.client | QlikSaaSApi.client;
  #runner: Runner;
  #ops: Operations;
  #initialChecksList: initialChecksNames[];
  emitter: EventsBus;
  // #inlineVariablesRegex = new RegExp(/(?<=\$\${)(.*?)(?=})/g); // match ALL values - $${xxxx}

  constructor(
    runBook: IRunBook,
    options?: {
      httpsAgent?: any;
      initialChecksList?: initialChecksNames[];
      disableSchemaValidation?: boolean;
    }
  ) {
    const ajv = new Ajv({
      allErrors: true,
      strict: true,
      strictRequired: true,
      allowUnionTypes: true,
    });

    ajvErrors(ajv);

    if (
      !runBook.edition ||
      (runBook.edition != "windows" && runBook.edition != "saas")
    )
      throw new CustomError(1001, "RunBook", { arg1: this.runBook.edition });

    let validate: ValidateFunction<unknown>;

    if (runBook.edition == "windows")
      validate = ajv.compile(automatiqalWindowsSchema);

    if (runBook.edition == "saas")
      validate = ajv.compile(automatiqalSaaSSchema);

    if (!runBook.tasks) throw new CustomError(1023, "Runbook");

    // check if all tasks are skip=true.
    // if yes - no need to validate or process. Validation complains a lot otherwise
    //TODO: this should be somehow into the initial checks
    if (runBook.tasks || runBook.tasks.length > 0) {
      const nonSkipTasks = runBook.tasks.filter((t) => !t.skip);
      if (nonSkipTasks.length == 0) throw new CustomError(1023, "Runbook");
    }

    if (!options?.disableSchemaValidation) {
      const valid = validate(runBook);

      if (!valid) {
        const errors = validate.errors.map((e) => e.message).join("\n");
        throw new Error(errors);
      }
    }

    this.runBook = runBook;
    this.#tasksListFlat = this.#flatTask(this.runBook.tasks);
    this.#taskNames = this.#tasksListFlat.map((t) => t.name);
    this.emitter = new EventsBus();
    this.#initialChecksList = options?.initialChecksList || [];

    // set default trace level if not provided in the run book
    if (!this.runBook.trace) this.runBook.trace = "error";

    // default the runbook to QSEoW edition
    if (!this.runBook.edition) this.runBook.edition = "windows";

    this.#ops = Operations.getInstance(this.runBook.edition);

    // perform obvious checks before execution
    this.initialChecks();

    // if QSEoW - set up Qlik Repo client
    if (runBook.edition == "windows") {
      if (options?.httpsAgent) {
        this.#restInstance = new QlikRepoApi.client({
          port: runBook.environment.port,
          httpsAgent: options.httpsAgent,
          host: runBook.environment.host,
          proxy: runBook.environment.proxy ? runBook.environment.proxy : "",
          authentication: runBook.environment.authentication,
        });
      } else {
        this.#restInstance = new QlikRepoApi.client({
          port: runBook.environment.port,
          host: runBook.environment.host,
          proxy: runBook.environment.proxy ? runBook.environment.proxy : "",
          authentication: runBook.environment.authentication,
        });
      }
    }

    if (runBook.edition == "saas") {
      this.#restInstance = new QlikSaaSApi.client({
        host: runBook.environment.host,
        authentication: runBook.environment.authentication,
        options: {
          saas: {
            apps: {
              swapResourceIdAndId: true,
            },
          },
        },
      });
    }

    // initialize the Runner
    this.#runner = new Runner(this.runBook, this.#restInstance);
  }

  async run(): Promise<ITaskResult[]> {
    return await this.#runner.start();
  }

  private initialChecks() {
    if (!this.runBook.tasks || this.runBook.tasks.length == 0)
      throw new CustomError(1000, "RunBook");

    // if (this.runBook.edition != "windows" && this.runBook.edition != "saas")
    //   throw new CustomError(1001, "RunBook", { arg1: this.runBook.edition });

    let errors: string[] = [];

    // TODO: anyway to solve this in a different way?
    if (!this.#initialChecksList || this.#initialChecksList.length == 0) {
      try {
        this.#checkDuplicateTasks();
      } catch (e) {
        errors.push(e.context);
      }

      try {
        this.#checkForHashInTaskNames();
      } catch (e) {
        errors.push(e.context);
      }

      try {
        this.#checkMissingInlineVariableTask();
      } catch (e) {
        errors.push(e.context);
      }

      try {
        this.#checkWrongOperation();
      } catch (e) {
        errors.push(e.context);
      }

      try {
        this.#checkMissingSource();
      } catch (e) {
        errors.push(e.context);
      }

      try {
        this.#checkCustomPropertiesName();
      } catch (e) {
        errors.push(e.context);
      }

      try {
        this.#checkCorrectSource();
      } catch (e) {
        errors.push(e.context);
      }

      try {
        this.#checkValidTaskName();
      } catch (e) {
        errors.push(e.context);
      }
    } else {
      if (this.#initialChecksList.includes("checkDuplicateTasks")) {
        try {
          this.#checkDuplicateTasks();
        } catch (e) {
          errors.push(e.context);
        }
      }

      if (this.#initialChecksList.includes("checkWrongOperation")) {
        try {
          this.#checkWrongOperation();
        } catch (e) {
          errors.push(e.context);
        }
      }

      if (this.#initialChecksList.includes("checkMissingSource")) {
        try {
          this.#checkMissingSource();
        } catch (e) {
          errors.push(e.context);
        }
      }

      if (this.#initialChecksList.includes("checkCustomPropertiesName")) {
        try {
          this.#checkCustomPropertiesName();
        } catch (e) {
          errors.push(e.context);
        }
      }

      if (this.#initialChecksList.includes("checkCorrectSource")) {
        try {
          this.#checkCorrectSource();
        } catch (e) {
          errors.push(e.context);
        }
      }

      if (this.#initialChecksList.includes("checkValidTaskName")) {
        try {
          this.#checkValidTaskName();
        } catch (e) {
          errors.push(e.context);
        }
      }
    }

    if (errors.length > 0) throw new Error(errors.join("\n"));
  }

  #checkDuplicateTasks(): void {
    const duplicateTasks = this.#tasksListFlat
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

  #checkMissingSource() {
    const missingSource = this.#tasksListFlat
      .filter((t) => !t.source && !t.filter)
      .map((t) => {
        const i = this.#ops.ops.nonSourceOperations.indexOf(t.operation);

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

  // if the inline variables task names exists in the runbook
  // https://github.com/Informatiqal/automatiqal-cli/issues/92
  #checkMissingInlineVariableTask() {
    const regEx = /(?<=\$\${)(.*?)(?=})/;
    if (regEx.test(JSON.stringify(this.#tasksListFlat))) {
      const inlineSourceTaskNames = Array.from(
        new Set(JSON.stringify(this.#tasksListFlat).match(regEx))
      );

      const missingTasks = inlineSourceTaskNames.filter((i) => {
        const [inlineTaskName, _] = i.split("#");
        return !this.#taskNames.includes(inlineTaskName);
      });

      if (missingTasks.length > 0)
        throw new CustomError(1020, "RunBook", {
          arg1: missingTasks.join(", "),
        });
    }
  }

  #checkWrongOperation() {
    const nonExistingOps = this.#tasksListFlat
      .map((t) => {
        const i = this.#ops.ops.names.indexOf(t.operation);

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

  #checkForHashInTaskNames() {
    const taskNamesWithHash = this.#tasksListFlat.filter(
      (t) => t.name.indexOf("#") > -1
    );

    if (taskNamesWithHash.length > 0)
      throw new CustomError(1015, "RunBook", {
        arg1: taskNamesWithHash.join(", "),
      });
  }

  #checkCustomPropertiesName() {
    const cpRelatesTasks = this.#tasksListFlat.filter(
      (t) =>
        t.operation == "customProperty.update" ||
        t.operation == "customProperty.create"
    );

    const incorrectValues = cpRelatesTasks
      .map((t) => {
        // is inline variable? then dont check
        const i = new RegExp(/(?<=\$\${)(.*?)(?=})/g).test(
          (t.details as any).name
        );
        if (i == true) return undefined;

        // is allowed value format
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

  #checkCorrectSource() {
    // for tasks that are using "source" property
    // check if the sourced tasks is of the same type
    // as the current task. For example:
    // if the sourced task is "app.get"
    // and the current ask is "stream.update"
    // its obvious that error will be returned from Qlik.
    // No point of running the whole runbook if its known
    // from the beginning that the task will fail

    // NOTE: any exclusions from this rule?
    const tasksReturnTypes = this.#ops.ops.opTypes;

    const opMismatchTasks = this.#tasksListFlat
      .filter((t) => t.hasOwnProperty("source"))
      .filter((t) => {
        const sourceTask = this.#tasksListFlat.filter(
          (ts) => ts.name == t.source
        )[0];

        if (!sourceTask)
          throw new CustomError(1018, "RunBook", {
            arg1: t.source,
          });

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

  // tasks name should not contain "#"
  // https://github.com/Informatiqal/automatiqal-cli/issues/92#issuecomment-1296805065
  #checkValidTaskName() {
    const nonValidTaskNames = this.#tasksListFlat
      .map((t) => {
        if (t.name.indexOf("#") > -1) return t;

        return { name: "VALID" } as ITask;
      })
      .filter((t) => t.name != "VALID")
      .map((t) => `"${t.name}"`);

    if (nonValidTaskNames.length > 0)
      throw new CustomError(1022, "RunBook", {
        arg1: nonValidTaskNames.join(", "),
      });
  }

  #flatTask(tasks: ITask[]) {
    let flatTasks: ITask[] = [];
    for (let task of tasks) {
      if (!task.skip) {
        flatTasks.push(task);

        if (
          task.onError &&
          task.onError.tasks &&
          task.onError.tasks.length > 0
        ) {
          flatTasks = [...flatTasks, ...this.#flatTask(task.onError.tasks)];
        }
      }
    }

    return flatTasks.reduce((acc, val) => acc.concat(val), []) as ITask[];
  }
}
