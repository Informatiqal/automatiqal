import { ICertificateExportParameters } from "qlik-repo-api/dist/Certificate";
import {
  IVirtualProxyUpdate,
  IVirtualProxyCreate,
} from "qlik-repo-api/dist/Proxy.interface";
// import { winOperations } from "../RunBook/Task";
// const operations = [...winOperations.map((m) => m.name)] as const;
// export type WinOperations = typeof operations[number];

export type SaaSOperations = "";

export type WinOperations =
  | "about.apiDefaults"
  | "about.apiDescription"
  | "about.apiRelations"
  | "about.enums"
  | "about.openApi"
  | "about.get"
  | "app.upload"
  | "app.remove"
  | "app.update"
  | "app.copy"
  | "app.publish"
  | "app.switch"
  | "app.get"
  | "stream.get"
  | "certificate.export"
  | "stream.remove"
  | "stream.update"
  | "virtualProxy.create"
  | "virtualProxy.update"
  | "node.get"
  | "continue"
  | "tag.create"
  | "tag.update"
  | "tag.remove"
  | "debug";

export interface ITask {
  name: string;
  description?: string;
  operation?: WinOperations | SaaSOperations;
  filter?: string;
  source?: string;
  //   onError?: ITask[];
  details?: TaskDetails;
  onError?: {
    exit?: boolean;
    continue?: boolean;
    ignore?: boolean;
    tasks?: ITask[];
  };
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

export interface IAppUpload {
  name: string;
  file: Buffer;
  keepData?: boolean;
  excludeDataConnections?: boolean;
}

type TaskDetails =
  | IAppPublish
  | IAppUpdate
  | IVirtualProxyUpdate
  | IVirtualProxyCreate
  | IAppUpload
  | ICertificateExportParameters;

interface IAppPublish {
  name?: string;
  stream?: string;
}

interface IAppUpdate {
  name?: string;
  tags?: string[];
  customProperties: string[];
}
