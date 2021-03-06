import { EventsBus } from "./EventBus";
import { TraceLevels } from "../RunBook/RunBook.interfaces";

// TODO: this needs to be singleton
export class Debugger {
  private static instance: Debugger;
  private emitter: EventsBus;
  trace: TraceLevels;
  constructor(trace?: TraceLevels, emitter?: EventsBus) {
    this.trace = trace;
    this.emitter = emitter;

    if (Debugger.instance) {
      return Debugger.instance;
    }

    Debugger.instance = this;
  }

  print(taskName: string, message: string): void {
    if (this.trace == "debug") {
      const time = this.getDateTime();
      this.emitter.emit("debug", `DEBUG ${time}, ${message}`);
    }
  }

  createMessage(trace: TraceLevels, taskName: string, message: string): string {
    const time = this.getDateTime();

    return `${trace.toUpperCase()} ${time}, ${taskName} - ${message}`;
  }

  private getDateTime() {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    const dateLocal = new Date(now.getTime() - offsetMs);
    return dateLocal
      .toISOString()
      .slice(0, 19)
      .replace(/-/g, "/")
      .replace("T", " ");
  }
}
