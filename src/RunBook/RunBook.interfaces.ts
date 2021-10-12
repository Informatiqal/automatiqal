export type SaaSOperations = "";

export type WinOperations =
  | "app.upload"
  | "app.remove"
  | "app.update"
  | "app.copy"
  | "app.publish"
  | "app.switch"
  | "app.get"
  | "stream.get"
  | "stream.remove"
  | "stream.update"
  | "continue"
  | "debug";

export interface ITask {
  name: string;
  description?: string;
  operation: WinOperations | SaaSOperations;
  filter?: string;
  source?: string;
  //   onError?: ITask[];
  details?: TaskDetails;
  onError?: ITask[];
  // | ITaskDetailsStream
  // | ITaskDetailsApp
  // | ITaskDetailsCustomProp
  // | ITaskDetailsSecurityRule
  // | ITaskDetailsContentLibrary
  // | ITaskDetailsReloadTask
  // | ITaskDetailsVirtualProxy
  // | ITaskDetailsUser;
  config?: {
    multiple?: boolean;
    allowZero?: boolean;
    // createStream?: boolean;
    // skipData?: boolean;
  };
}

export type TraceLevels = "error" | "debug";
export type QlikEditions = "saas" | "windows";

export interface IRunBook {
  name: string;
  description: string;
  edition: QlikEditions;
  trace?: TraceLevels;
  environment: {
    host: string;
    port?: number;
    proxy?: string;
    authentication: {
      user_dir: string;
      user_name: string;
    };
  };
  tasks: ITask[];
}

type TaskDetails = IAppPublish | IAppUpdate;

interface IAppPublish {
  name?: string;
  stream?: string;
}

interface IAppUpdate {
  name?: string;
  tags?: string[];
  customProperties: string[];
}
