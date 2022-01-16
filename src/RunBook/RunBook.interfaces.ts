import { ICertificateExportParameters } from "qlik-repo-api/dist/Certificate";
import {
  ICustomPropertyCreate,
  ICustomPropertyUpdate,
} from "qlik-repo-api/dist/CustomProperties";
import {
  IVirtualProxyUpdate,
  IVirtualProxyCreate,
} from "qlik-repo-api/dist/Proxy.interface";
import {
  ISystemRuleCreate,
  ISystemRuleUpdate,
} from "qlik-repo-api/dist/SystemRule.interface";
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
  | "stream.get"
  | "stream.create"
  | "stream.remove"
  | "stream.update"
  | "tag.get"
  | "tag.create"
  | "tag.remove"
  | "tag.update"
  | "customProperty.get"
  | "customProperty.create"
  | "customProperty.remove"
  | "customProperty.update"
  | "systemRule.get"
  | "systemRule.create"
  | "systemRule.remove"
  | "systemRule.update"
  | "app.copy"
  | "app.export"
  | "app.get"
  | "app.publish"
  | "app.remove"
  | "app.switch"
  | "app.update"
  | "app.upload"
  | "app.uploadAndReplace"
  | "certificate.export"
  | "virtualProxy.create"
  | "virtualProxy.update"
  | "node.get"
  | "continue"
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
  | ISystemRuleCreate
  | ISystemRuleUpdate
  | ICustomPropertyCreate
  | ICustomPropertyUpdate
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
