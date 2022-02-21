import { ICertificateExportParameters } from "qlik-repo-api/dist/Certificate";
import { ITaskCreateTriggerComposite } from "qlik-repo-api/dist/Task.interface";
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
  | "user.get"
  | "user.getAll"
  | "user.create"
  | "user.remove"
  | "user.update"
  | "continue"
  | "debug";

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
  };
  location?: string;
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
    authentication: {
      user_dir?: string;
      user_name?: string;
      cert?: string;
      key?: string;
      token?: string;
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
  | ITaskCreateTriggerComposite;

interface IAppPublish {
  name?: string;
  stream?: string;
}

interface IAppUpdate {
  name?: string;
  tags?: string[];
  customProperties: string[];
}
