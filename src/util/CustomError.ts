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
    1001: `Invalid edition value. Valid editions are "windows" or "saas". Provided value "%{arg1}"`,
    1002: `Duplicate task name(s). Duplicated names: %{arg1}`,
    1003: `No "source" or "filter" is provided for task "%{arg1}"`,
    1004: `Task "%{arg1}" will not run. 0 objects will be affected`,
    1005: `Task "%{arg1}" will be performed on multiple objects. Specify "config.multiple = true" to override`,
    1006: `Task "%{arg1}" will be performed on multiple objects. "config.multiple" is set to "false"`,
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

    this.emitter.emit("error", this.message);
  }
}
