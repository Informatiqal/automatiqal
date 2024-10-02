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
  ITaskUpdateTriggerSchema,
  ITaskUpdateTriggerComposite,
  ICustomBannerCreate,
  IEngineHealthCreate,
  IEngineHealthUpdate,
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
import { IExtensionImportData } from "qlik-saas-api/dist/modules/Extensions";
import { ISpace, ISpaceUpdate } from "qlik-saas-api/dist/modules/Space";
import { IAssignmentCreate } from "qlik-saas-api/dist/modules/SpaceAssignments";
import { ISpaceCreate } from "qlik-saas-api/dist/modules/Spaces";
import { IWebHookCreate } from "qlik-saas-api/dist/modules/WebHooks";
import {
  IWebHookPatch,
  IWebHookUpdate,
} from "qlik-saas-api/dist/modules/WebHook";
import { IWebIntegrationCreate } from "qlik-saas-api/dist/modules/WebIntegrations";
import { IWebIntegrationUpdate } from "qlik-saas-api/dist/modules/WebIntegration";
import {
  IAPIKeyCreate,
  IAPIKeysConfigsUpdate,
} from "qlik-saas-api/dist/modules/APIKeys";
import { IncomingMessage } from "http";

export type SaaSOperations =
  | "apiKey.get"
  | "apiKey.getAll"
  | "apiKey.create"
  | "apiKey.configs"
  | "apiKey.configsUpdate"
  | "apiKey.remove"
  | "apiKey.update"
  | "app.get"
  | "app.getAll"
  | "app.import"
  | "app.create"
  | "app.copy"
  | "app.export"
  | "app.publish"
  | "app.rePublish"
  | "app.reload"
  | "app.addToSpace"
  | "app.removeFromSpace"
  | "app.remove"
  | "app.update"
  | "app.scriptVersions"
  | "app.scriptVersion"
  | "app.getReloadTasks"
  | "app.createReloadTasks"
  | "app.changeObjectOwner"
  | "automation.get"
  | "automation.getAll"
  | "automation.remove"
  | "automation.create"
  | "automation.usage"
  | "automation.getSettings"
  | "automation.setSettings"
  | "automation.copy"
  | "automation.enable"
  | "automation.disable"
  | "automation.move"
  | "brand.get"
  | "brand.getAll"
  | "brand.remove"
  | "brand.create"
  | "brand.addFile"
  | "brand.update"
  | "brand.activate"
  | "brand.deactivate"
  | "encryption.get"
  | "encryption.getAll"
  | "encryption.list"
  | "encryption.migrationDetails"
  | "encryption.create"
  | "encryption.resetToDefaultProvider"
  | "extension.get"
  | "extension.getAll"
  | "extension.import"
  | "extension.remove"
  | "extension.update"
  | "extension.download"
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
  | "space.assignmentsGetAll"
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
  | "user.update"
  | "reload.get"
  | "reload.getAll"
  | "reload.start"
  | "reload.cancel"
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
  | "app.uploadMany"
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
  | "compositeTrigger.create"
  | "compositeTrigger.get"
  | "compositeTrigger.getAll"
  | "compositeTrigger.remove"
  | "compositeTrigger.update"
  | "customBannerMessage.get"
  | "customBannerMessage.getAll"
  | "customBannerMessage.create"
  | "customBannerMessage.update"
  | "customBannerMessage.remove"
  | "engineHealth.get"
  | "engineHealth.getAll"
  | "engineHealth.create"
  | "engineHealth.update"
  | "engineHealth.remove"
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
  | "schemaTrigger.create"
  | "schemaTrigger.get"
  | "schemaTrigger.getAll"
  | "schemaTrigger.remove"
  | "schemaTrigger.update"
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

export type ILoop =
  | string
  | number
  | { [k: string]: string | number | boolean };

export interface ITask {
  /**
   * Unique name of the task
   */
  name: string;
  /**
   * Longer description of the task
   */
  description?: string;
  operation: WinOperations | SaaSOperations;
  /**
   * Get entities based on the specified filter
   */
  filter?: string;
  /**
   * Task will be ran on the entities returned from the defined task name
   */
  source?: string;
  /**
   * Skip or not the current tasks
   */
  skip?: boolean;
  /**
   * Determine if the task to be skipped or not based on
   * the condition provided here
   */
  when?: string;
  /**
   * Name of the environment on which the task should be ran
   */
  environment?: string;
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
    unmaskSecrets?: boolean;
    /**
     * applied if "loop" is used.
     * Loop through the values in parallel or in sequence
     * default is "false"
     */
    loopParallel?: boolean;
    /**
     * process entities in parallel or sequence
     * default is "true"
     */
    parallel?: boolean;
    /**
     * if parallel == true then this option
     * will make sure that the task entries are process N at the time.
     * rolling N
     */
    concurrency?: number;
    /**
     * if parallel == true then this option
     * process the task entities in batches. Each batch
     * will start once all entities are processed from the
     * previous batch.
     *
     * THE TASKS IN EACH BATCH ARE PROCESSED IN PARALLEL!
     */
    batch?: number;
  };
  location?: string;
  details?: TaskDetails;
  onError?: {
    exit?: boolean;
    // continue?: boolean;
    ignore?: boolean;
    tasks?: ITask[];
  };
  loop?: {
    values: ILoop[];
  };
}

export type TraceLevels = "error" | "debug";
export type QlikEditions = "saas" | "windows";

export interface IEnvironment {
  name: string;
  host: string;
  default?: boolean;
  port?: number;
  proxy?: string;
  authentication: IConfig["authentication"];
}

export interface IRunBook {
  name: string;
  description?: string;
  edition: QlikEditions;
  trace?: TraceLevels;
  environment: IEnvironment | IEnvironment[];
  // | {
  //     host: string;
  //     port?: number;
  //     proxy?: string;
  //     authentication: IConfig["authentication"];
  //   }[];
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
  | IAPIKeyCreate
  | IAppPublish
  | IAppUpdate
  | IVirtualProxyUpdate
  | IVirtualProxyCreate
  | IAppUpload
  | ISystemRuleCreate
  | ISystemRuleUpdate
  | ICustomBannerCreate
  | IEngineHealthCreate
  | IEngineHealthUpdate
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
  | ITaskUpdateTriggerSchema
  | ITaskCreateTriggerSchema
  | ITaskUpdateTriggerComposite
  | ITaskCreateTriggerComposite
  | IOriginCreate
  | IWebHookCreate
  | IWebHookUpdate
  | IWebIntegrationCreate
  | IWebIntegrationUpdate
  | IWebIntegrationUpdate[]
  | IWebHookPatch
  | IWebHookPatch[]
  | IAPIKeysConfigsUpdate[]
  | IExtensionImportData
  | { location: string; skipData?: boolean }
  | { location: string; noData?: boolean }
  | { sourceFileNames: string[]; location: string }
  | { sourceFileName: string; location: string }
  | { spaceId: string }
  | { description: string }
  | { tenantId: string }
  | {
      file: string | Buffer;
      data: IExtensionImportData;
    }
  | {
      file: string | Buffer;
      data: Partial<IExtensionImportData>;
    }
  | {
      file?: undefined;
      data: Partial<IExtensionImportData>;
    }
  | {
      file: string | Buffer;
      data?: undefined;
    }
  | {
      file: Buffer | ReadStream | IncomingMessage | WritableStream;
      name: string;
    }[]
  | {
      location: string;
    }
  | { names: string[] };
// };

export interface IAppPublish {
  name?: string;
  stream?: string;
}

export interface IAppUpdate {
  name?: string;
  tags?: string[];
  customProperties: string[];
}
