import { Debugger } from "./Debugger";
import { EventsBus } from "./EventBus";

export interface IErrorParams {
  task?: string;
  arg1?: string;
  arg2?: string;
  arg3?: string;
  // arg4?: string;
  // arg5?: string;
  // arg6?: string;
}

export class CustomError extends Error {
  debug: Debugger;
  emitter: EventsBus;
  taskName: string;
  code: number;
  messages: { [key: string]: string } = {
    1000: `Nothing to process. No tasks are specified`,
    1001: `Invalid edition value or edition value is missing. Valid editions are "windows" or "saas". Provided value "%{arg1}"`,
    1002: `Initial checks: Task names duplications. Duplicated names: %{arg1}`,
    1003: `No "source" or "filter" is provided for task "%{arg1}"`,
    1004: `Task "%{arg1}" aborted. 0 objects will be affected`,
    1005: `Task "%{arg1}" will be performed on multiple objects. Specify "options.multiple = true" to override`,
    1006: `Task "%{arg1}" will be performed on multiple objects. "options.multiple" is set to "false" or it is missing`,
    1007: `Task "%{arg1}" aborted. 0 objects will be affected and "options.allowZero" is set to "false"`,
    1008: `Task "%{arg1}" aborted. Task "filter" is provided but the filter is empty`,
    1009: `Task "%{arg1}" aborted. Task "source" is provided but the filter is empty"`,
    1010: `Task "%{arg1}" aborted. Task "operation" is required"`,
    1011: `Task "%{arg1}" aborted. %{arg2}`,
    1012: `Task "%{arg1}" aborted. "operation" property is missing`,
    1013: `Initial checks: Non existing operations found: %{arg1}`,
    1014: `Initial checks: Source/filter for tasks is required: %{arg1}`,
    1015: `Initial checks: Wrong custom property(ies) names: %{arg1}. Allowed values can be only alphanumeric and/or underline`,
    1016: `Initial checks: Mismatch source and operation: %{arg1}`,
    1017: `User defined exit. Encountered "onError.exit"`,
    1018: `Missing source task "%{arg1}"`,
    1019: `SaaS edition is not supported yet`,
    1020: `Source for inline task missing: %{arg1}`,
    1021: `Source for inline task contains more than one ID. Current parameter is string. "%{arg1}" for property "%{arg2}" in task "%{arg3}"`,
    1022: `Initial checks: Non valid task name. Name should not contain "#": %{arg1}`,
    1023: `Nothing to process. No tasks are specified or all tasks are set to skip = true`,
    1024: `Source for inline task contains more than one ID. Task %{arg1}. Inline variable %{arg2}`,
    1025: `Task names should not contain # symbol. Please rename the following task(s): %{arg1}`,
    1026: `Missing/incorrect property when extracting inline variable value from task "%{arg1}" - %{arg2}`,
  };

  constructor(code: number, taskName: string, params?: IErrorParams) {
    super();
    this.taskName = taskName;
    this.code = code;
    this.name = "CustomError";
    this.stack = ""; //(<any>new Error()).stack;
    this.debug = new Debugger("error");
    this.emitter = new EventsBus();

    // Silly Stefan! Forgot to add the error code again eh?
    if (!this.messages[code])
      this.message = this.debug.createMessage(
        "error",
        taskName,
        "UNKNOWN ERROR!"
      );

    this.message = this.debug.createMessage(
      "error",
      taskName,
      `${code} - ${this.messages[code]}`
    );

    if (params) {
      for (let [key, value] of Object.entries(params)) {
        this.message = this.message.replace(`%{${key}}`, value);
      }
    }

    this.emitter.emit("runbook:log", `FAILED! ${this.taskName}`);
    this.emitter.emit("error", this.message);
  }
}
