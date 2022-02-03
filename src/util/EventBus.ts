import { EventEmitter } from "events";

export declare interface EventsBus {
  on(event: "task:result", listener: (name: string) => void): this;
  on(event: "runbook:result", listener: (name: string) => void): this;
  on(event: "runbook:log", listener: (name: string) => void): this;
  on(event: "error", listener: (name: string) => void): this;
  emit(event: string | symbol, ...args: any[]): boolean;
}

export class EventsBus extends EventEmitter {
  private static instance: EventsBus;
  constructor() {
    super();
    if (EventsBus.instance) {
      return EventsBus.instance;
    }
    EventsBus.instance = this;
  }
}
