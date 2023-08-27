import { ReadStream } from "fs";
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
  ITaskCreateTriggerSchema,
  IAppUploadAndReplace,
  IExternalTaskCreate,
  ICompositeEvent,
  IDataConnectionCreate,
  IDataConnectionUpdate,
  IExtensionImport,
} from "qlik-repo-api/dist/types/interfaces";

import { IDataConnectionsCreate } from "qlik-saas-api/dist/modules/DataConnections";
import { IDataConnectionsUpdate } from "qlik-saas-api/dist/modules/DataConnection";
import { IOriginCreate } from "qlik-saas-api/dist/modules/Origins";
import {
  IAppImport,
  IAppUpdate as IAppUpdate_SaaS,
  IAppPublish as IAppPublish_SaaS,
  IAppCopy,
  IAppRePublish,
} from "qlik-saas-api/dist/modules/Apps.interfaces";

import { IConfig } from "qlik-rest-api/dist/interfaces/interfaces";
import {
  IAssignmentCreate,
  ISpace,
  ISpaceUpdate,
} from "qlik-saas-api/dist/modules/Space";
import { ISpaceCreate } from "qlik-saas-api/dist/modules/Spaces";
import { IWebHookCreate } from "qlik-saas-api/dist/modules/WebHooks";
import {
  IWebHookPatch,
  IWebHookUpdate,
} from "qlik-saas-api/dist/modules/WebHook";
import { IWebIntegrationCreate } from "qlik-saas-api/dist/modules/WebIntegrations";
import { IWebIntegrationUpdate } from "qlik-saas-api/dist/modules/WebIntegration";

export type SaaSOperations =
  | "app.get"
  | "app.getAll"
  | "app.import"
  | "app.create"
  | "app.copy"
  | "app.export"
  | "app.publish"
  | "app.rePublish"
  | "app.addToSpace"
  | "app.removeFromSpace"
  | "app.remove"
  | "app.update"
  | "item.getAll"
  | "item.get"
  | "item.collections"
  | "item.publishedItems"
  | "origin.get"
  | "origin.getAll"
  | "origin.create"
  | "origin.remove"
  | "origin.update"
  | "origin.generateHeader"
  | "space.get"
  | "space.getAll"
  | "space.create"
  | "space.remove"
  | "space.update"
  | "space.assignments"
  | "space.assignmentsCreate"
  | "dataConnection.get"
  | "dataConnection.getAll"
  | "dataConnection.create"
  | "dataConnection.remove"
  | "dataConnection.update"
  | "user.get"
  | "user.getAll"
  | "user.create"
  | "user.remove"
  | "user.me"
  | "user.metadata"
  | "user.update"
  | "reload.start"
  | "webHook.get"
  | "webHook.getAll"
  | "webHook.remove"
  | "webHook.create"
  | "webHook.update"
  | "webHook.patch"
  | "webIntegration.get"
  | "webIntegration.getAll"
  | "webIntegration.remove"
  | "webIntegration.create"
  | "webIntegration.update";

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
  | "compositeTrigger.create"
  | "schemaTrigger.remove"
  | "schemaTrigger.update"
  | "schemaTrigger.create"
  | "customProperty.get"
  | "customProperty.getAll"
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
    tagOperation?: TAddRemoveSet;
    customPropertyOperation?: TAddRemoveSet;
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
  description?: string;
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
  file: Buffer | object | string | ReadStream;
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
  | IProxyUpdate
  | ISpace
  | ISpaceUpdate
  | ISpaceCreate
  | IAssignmentCreate
  | ITaskCreateTriggerSchema
  | { targetAppId: string }
  | {
      task: {
        id?: string;
        filter?: string;
      };
    }
  | { appFilter: string }
  | { appId: string; partial?: boolean }
  | IAppUploadAndReplace
  | IExternalTaskCreate
  | IDataConnectionCreate
  | IDataConnectionsCreate
  | IDataConnectionsUpdate
  | IDataConnectionUpdate
  | IExtensionImport
  | IAppImport
  | IAppUpdate_SaaS
  | IAppPublish_SaaS
  | IAppRePublish
  | IAppCopy
  | IOriginCreate
  | IWebHookCreate
  | IWebHookUpdate
  | IWebIntegrationCreate
  | IWebIntegrationUpdate
  | IWebHookPatch
  | IWebHookPatch[]
  | { location: string; skipData?: boolean }
  | { sourceFileNames: string[]; location: string }
  | { sourceFileName: string; location: string }
  | { spaceId: string };

export interface IAppPublish {
  name?: string;
  stream?: string;
}

export interface IAppUpdate {
  name?: string;
  tags?: string[];
  customProperties: string[];
}
