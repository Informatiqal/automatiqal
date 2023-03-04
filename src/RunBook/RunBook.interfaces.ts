import {
  ICustomPropertyCreate,
  ICustomPropertyUpdate,
  ICertificateExportParameters,
  ITaskCreateTriggerComposite,
  IVirtualProxyUpdate,
  IVirtualProxyCreate,
  ISystemRuleCreate,
  ISystemRuleUpdate,
  IProxyUpdate,
} from "qlik-repo-api/dist/types/interfaces";

import { IConfig } from "qlik-rest-api/dist/interfaces/interfaces";
// import {  } from "qlik-saas-api/dist/types/Common";

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
  | "app.copy"
  | "app.get"
  | "app.getAll"
  | "app.export"
  | "app.exportMany"
  | "app.publish"
  | "app.remove"
  | "app.switch"
  | "app.update"
  | "app.upload"
  | "app.uploadAndReplace"
  | "certificate.export"
  | "certificate.distributionPathGet"
  | "contentLibrary.get"
  | "contentLibrary.getAll"
  | "contentLibrary.importFile"
  | "contentLibrary.importFileMany"
  | "contentLibrary.removeFile"
  | "contentLibrary.removeFileMany"
  | "contentLibrary.importForApp"
  | "contentLibrary.export"
  | "contentLibrary.exportMany"
  | "contentLibrary.create"
  | "contentLibrary.update"
  | "contentLibrary.remove"
  | "compositeTrigger.remove"
  | "compositeTrigger.update"
  | "customProperty.create"
  | "customProperty.update"
  | "customProperty.remove"
  | "dataConnection.get"
  | "dataConnection.getAll"
  | "dataConnection.create"
  | "dataConnection.remove"
  | "dataConnection.update"
  | "extension.get"
  | "extension.getAll"
  | "extension.import"
  | "extension.remove"
  | "extension.update"
  | "externalTask.addTriggerSchema"
  | "externalTask.addTriggerMany"
  | "externalTask.create"
  | "externalTask.get"
  | "externalTask.getAll"
  | "externalTask.start"
  | "externalTask.startSynchronous"
  | "externalTask.update"
  | "externalTask.waitExecution"
  | "externalTask.remove"
  | "node.get"
  | "node.getAll"
  | "reloadTask.addTriggerSchema"
  | "reloadTask.addTriggerComposite"
  | "reloadTask.addTriggerMany"
  | "reloadTask.create"
  | "reloadTask.get"
  | "reloadTask.getAll"
  | "reloadTask.start"
  | "reloadTask.startSynchronous"
  | "reloadTask.update"
  | "reloadTask.waitExecution"
  | "reloadTask.remove"
  | "stream.create"
  | "stream.get"
  | "stream.getAll"
  | "stream.remove"
  | "stream.update"
  | "systemRule.create"
  | "systemRule.get"
  | "systemRule.getAll"
  | "systemRule.remove"
  | "systemRule.licenseCreate"
  | "systemRule.update"
  | "tag.create"
  | "tag.createMany"
  | "tag.remove"
  | "tag.update"
  | "task.get"
  | "task.getAll"
  | "task.start"
  | "task.startSynchronous"
  | "task.stop"
  | "virtualProxy.get"
  | "virtualProxy.getAll"
  | "virtualProxy.create"
  | "virtualProxy.remove"
  | "virtualProxy.update"
  | "proxy.update"
  | "user.get"
  | "user.getAll"
  | "user.create"
  | "user.remove"
  | "user.update"
  | "continue"
  | "debug";

export type TAddRemoveSet = "add" | "remove" | "set";

export interface ITask {
  name: string;
  description?: string;
  operation: WinOperations | SaaSOperations;
  filter?: string;
  source?: string;
  skip?: boolean;
  //   onError?: ITask[];
  options?: {
    appendCustomProperties?: boolean;
    appendTags?: boolean;
    multiple?: boolean;
    allowZero?: boolean;
    whitelistOperation?: TAddRemoveSet;
    virtualProxiesOperation?: TAddRemoveSet;
    tagOperations?: TAddRemoveSet;
    customPropertyOperations?: TAddRemoveSet;
  };
  location?: string;
  details?: TaskDetails;
  onError?: {
    exit?: boolean;
    // continue?: boolean;
    ignore?: boolean;
    tasks?: ITask[];
  };
}

export type TraceLevels = "error" | "debug";
export type QlikEditions = "saas" | "windows";

export interface IRunBook {
  name: string;
  description: string;
  edition?: QlikEditions;
  trace?: TraceLevels;
  environment: {
    host: string;
    port?: number;
    proxy?: string;
    authentication: IConfig["authentication"];
    // | IHeaderConfig
    // | IJWTConfig
    // | ISessionConfig
    // | ITicketConfig
    // | ICertUser
    // | ISaaSToken;
  };
  tasks: ITask[];
}

export interface IAppUpload {
  name: string;
  file: number[];
  keepData?: boolean;
  excludeDataConnections?: boolean;
}

// TODO: add all the missing types
export type TaskDetails =
  | IAppPublish
  | IAppUpdate
  | IVirtualProxyUpdate
  | IVirtualProxyCreate
  | IAppUpload
  | ISystemRuleCreate
  | ISystemRuleUpdate
  | ICustomPropertyCreate
  | ICustomPropertyUpdate
  | ICertificateExportParameters
  | ITaskCreateTriggerComposite
  | IProxyUpdate;

export interface IAppPublish {
  name?: string;
  stream?: string;
}

export interface IAppUpdate {
  name?: string;
  tags?: string[];
  customProperties: string[];
}
