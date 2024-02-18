interface ISaaSOperation {
  name: string;
  isNonSource: boolean;
  type?: string;
  isPlural?: boolean;
  sensitiveProperty?: string[];
  subTaskGroup?: string;
  realOperation?: string;
}

const apiKey: ISaaSOperation[] = [
  { name: "apiKey.get", isNonSource: false, type: "ApiKey" },
  { name: "apiKey.getAll", isNonSource: true, type: "ApiKey", isPlural: true },
  { name: "apiKey.create", isNonSource: true, type: "ApiKey", isPlural: true },
  { name: "apiKey.configs", isNonSource: true, type: "ApiKey", isPlural: true },
  {
    name: "apiKey.configsUpdate",
    isNonSource: true,
    type: "ApiKey",
    isPlural: true,
  },
  { name: "apiKey.remove", isNonSource: false, type: "ApiKey" },
  { name: "apiKey.update", isNonSource: false, type: "ApiKey" },
];

const app: ISaaSOperation[] = [
  { name: "app.get", isNonSource: false, type: "App" },
  { name: "app.getAll", isNonSource: true, type: "App", isPlural: true },
  { name: "app.remove", isNonSource: false, type: "App" },
  { name: "app.import", isNonSource: true, type: "App", isPlural: true },
  { name: "app.create", isNonSource: true, type: "App", isPlural: true },
  { name: "app.copy", isNonSource: false, type: "App" },
  { name: "app.export", isNonSource: false, type: "App" },
  { name: "app.publish", isNonSource: false, type: "App" },
  { name: "app.rePublish", isNonSource: false, type: "App" },
  { name: "app.addToSpace", isNonSource: false, type: "App" },
  { name: "app.removeFromSpace", isNonSource: false, type: "App" },
  { name: "app.update", isNonSource: false, type: "App" },
  { name: "app.scriptVersions", isNonSource: false, type: "App" },
  { name: "app.scriptVersion", isNonSource: false, type: "App" },
  {
    name: "app.getReloadTasks",
    isNonSource: false,
    type: "App",
    subTaskGroup: "_actions",
  },
  {
    name: "app.reload",
    isNonSource: false,
    type: "App",
    subTaskGroup: "_actions",
  },
  {
    name: "app.createReloadTask",
    isNonSource: false,
    type: "App",
    subTaskGroup: "_actions",
  },
  {
    name: "app.changeObjectOwner",
    isNonSource: false,
    type: "App",
    subTaskGroup: "_actions",
  },
];

//TODO: how to handle automation<id>.run.xxx methods
const automation: ISaaSOperation[] = [
  { name: "automation.get", isNonSource: false, type: "Automation" },
  {
    name: "automation.getAll",
    isNonSource: true,
    type: "Automation",
    isPlural: true,
  },
  { name: "automation.remove", isNonSource: false, type: "Automation" },
  {
    name: "automation.create",
    isNonSource: true,
    type: "Automation",
    isPlural: true,
  },
  {
    name: "automation.usage",
    isNonSource: true,
    type: "Automation",
    isPlural: true,
  },
  {
    name: "automation.getSettings",
    isNonSource: true,
    type: "Automation",
    isPlural: true,
  },
  {
    name: "automation.setSettings",
    isNonSource: true,
    type: "Automation",
    isPlural: true,
  },
  {
    name: "automation.copy",
    isNonSource: false,
    type: "Automation",
  },
  {
    name: "automation.enable",
    isNonSource: false,
    type: "Automation",
  },
  {
    name: "automation.disable",
    isNonSource: false,
    type: "Automation",
  },
  {
    name: "automation.move",
    isNonSource: false,
    type: "Automation",
  },
];

// TODO: add brand.file(s).download/remove/update operations ... somehow
const brand: ISaaSOperation[] = [
  { name: "brand.get", isNonSource: false, type: "Brand" },
  { name: "brand.getAll", isNonSource: true, type: "Brand", isPlural: true },
  { name: "brand.remove", isNonSource: false, type: "Brand" },
  { name: "brand.create", isNonSource: true, type: "Brand", isPlural: true },
  { name: "brand.addFile", isNonSource: false, type: "Brand" },
  { name: "brand.update", isNonSource: false, type: "Brand" },
  {
    name: "brand.activate",
    isNonSource: false,
    type: "Brand",
    subTaskGroup: "_actions",
  },
  {
    name: "brand.deactivate",
    isNonSource: false,
    type: "Brand",
    subTaskGroup: "_actions",
  },
];

const dataConnection: ISaaSOperation[] = [
  { name: "dataConnection.get", isNonSource: false, type: "DataConnection" },
  {
    name: "dataConnection.getAll",
    isNonSource: true,
    type: "DataConnection",
    isPlural: true,
  },
  {
    name: "dataConnection.create",
    isNonSource: true,
    type: "DataConnection",
    isPlural: true,
    sensitiveProperty: ["qConnectionSecret", "qPassword"],
  },
  { name: "dataConnection.remove", isNonSource: false, type: "DataConnection" },
  {
    name: "dataConnection.update",
    isNonSource: false,
    type: "DataConnection",
    sensitiveProperty: ["qConnectionSecret", "qPassword"],
  },
];

const encryption: ISaaSOperation[] = [
  { name: "encryption.get", isNonSource: false, type: "Encryption" },
  {
    name: "encryption.getAll",
    isNonSource: true,
    type: "Encryption",
  },
  {
    name: "encryption.list",
    isNonSource: true,
    type: "Encryption",
    isPlural: true,
  },
  {
    name: "encryption.migrationDetails",
    isNonSource: true,
    type: "Encryption",
    isPlural: true,
  },
  {
    name: "encryption.create",
    isNonSource: true,
    type: "Encryption",
    isPlural: true,
  },
  {
    name: "encryption.resetToDefaultProvider",
    isNonSource: true,
    type: "Encryption",
    isPlural: true,
  },
];

const extensions: ISaaSOperation[] = [
  { name: "extension.get", isNonSource: false, type: "Extension" },
  {
    name: "extension.getAll",
    isNonSource: true,
    type: "Extension",
    isPlural: true,
  },
  {
    name: "extension.import",
    isNonSource: true,
    type: "Extension",
    isPlural: true,
  },
  { name: "extension.remove", isNonSource: false, type: "Extension" },
  { name: "extension.update", isNonSource: false, type: "Extension" },
  { name: "extension.download", isNonSource: false, type: "Extension" },
];

const item: ISaaSOperation[] = [
  { name: "item.get", isNonSource: false, type: "Item" },
  { name: "item.getAll", isNonSource: true, type: "Item", isPlural: true },
  { name: "item.collections", isNonSource: false, type: "Item" },
  { name: "item.publishedItems", isNonSource: false, type: "Item" },
];

const origins: ISaaSOperation[] = [
  { name: "origin.get", isNonSource: false, type: "Origin" },
  { name: "origin.getAll", isNonSource: true, type: "Origin", isPlural: true },
  { name: "origin.create", isNonSource: true, type: "Origin", isPlural: true },
  { name: "origin.remove", isNonSource: false, type: "Origin" },
  { name: "origin.update", isNonSource: false, type: "Origin" },
  {
    name: "origin.generateHeader",
    isNonSource: true,
    type: "Origin",
    isPlural: true,
  },
];

const reloads: ISaaSOperation[] = [
  { name: "reload.get", isNonSource: false, type: "Reload" },
  { name: "reload.getAll", isNonSource: true, type: "Reload", isPlural: true },
  { name: "reload.start", isNonSource: true, type: "Reload", isPlural: true },
  { name: "reload.cancel", isNonSource: false, type: "Reload" },
];

const space: ISaaSOperation[] = [
  { name: "space.get", isNonSource: false, type: "Space" },
  { name: "space.getAll", isNonSource: true, type: "Space", isPlural: true },
  { name: "space.create", isNonSource: true, type: "Space", isPlural: true },
  { name: "space.remove", isNonSource: false, type: "Space" },
  { name: "space.update", isNonSource: false, type: "Space" },
  {
    name: "space.assignments",
    isNonSource: false,
    type: "Space",
  },
  {
    name: "space.assignmentsCreate",
    isNonSource: false,
    type: "Space",
  },
  {
    name: "space.assignmentsGetAll",
    isNonSource: false,
    type: "Space",
    realOperation: "space.assignments.getAll",
  },
];

const user: ISaaSOperation[] = [
  { name: "user.get", isNonSource: false, type: "User" },
  { name: "user.getAll", isNonSource: true, type: "User", isPlural: true },
  { name: "user.create", isNonSource: true, type: "User", isPlural: true },
  { name: "user.remove", isNonSource: false, type: "User" },
  { name: "user.update", isNonSource: false, type: "User" },
  { name: "user.me", isNonSource: true, type: "User" },
  { name: "user.metadata", isNonSource: true, type: "User" },
];

const webHooks: ISaaSOperation[] = [
  {
    name: "webHook.get",
    isNonSource: false,
    type: "WebHook",

    sensitiveProperty: ["secret"],
  },
  {
    name: "webHook.getAll",
    isNonSource: true,
    type: "WebHook",
    isPlural: true,
    sensitiveProperty: ["secret"],
  },
  { name: "webHook.remove", isNonSource: false, type: "WebHook" },
  {
    name: "webHook.create",
    isNonSource: true,
    type: "WebHook",
    isPlural: true,
    sensitiveProperty: ["secret"],
  },
  {
    name: "webHook.update",
    isNonSource: false,
    type: "WebHook",
    sensitiveProperty: ["secret"],
  },
  { name: "webHook.patch", isNonSource: false, type: "WebHook" },
];

const webIntegrations: ISaaSOperation[] = [
  { name: "webIntegration.get", isNonSource: false, type: "WebIntegration" },
  {
    name: "webIntegration.getAll",
    isNonSource: true,
    type: "WebIntegration",
    isPlural: true,
  },
  { name: "webIntegration.remove", isNonSource: false, type: "WebIntegration" },
  {
    name: "webIntegration.create",
    isNonSource: true,
    type: "WebIntegration",
    isPlural: true,
  },
  { name: "webIntegration.update", isNonSource: false, type: "WebIntegration" },
];

const saasOperations: ISaaSOperation[] = [
  ...apiKey,
  ...app,
  ...automation,
  ...brand,
  ...dataConnection,
  ...encryption,
  ...extensions,
  ...item,
  ...origins,
  ...reloads,
  ...space,
  ...user,
  ...webHooks,
  ...webIntegrations,
];

export class SaaSOperations {
  nonSourceOperations: string[];
  nonSourceOperationsPlural: string[];
  sensitiveDataOperations: string[];
  names: string[];
  allOperations: ISaaSOperation[];
  opTypes: { [key: string]: string };
  constructor() {
    this.allOperations = saasOperations;

    let b: { [key: string]: string } = {};
    for (let o of saasOperations) {
      b[o.name] = o.type;
    }

    this.opTypes = b;

    // TODO: add all required tasks
    this.nonSourceOperations = saasOperations
      .filter((o) => o.isNonSource == true)
      .map((o) => o.name);

    this.nonSourceOperationsPlural = saasOperations
      .filter((o) => o.isPlural == true)
      .map((o) => o.name);

    this.names = saasOperations.map((o) => o.name);

    this.sensitiveDataOperations = saasOperations
      .filter((o) => o.hasOwnProperty("sensitiveProperty"))
      .map((t) => t.name);
  }

  filter(name: string) {
    return saasOperations.filter((o) => o.name == name)[0];
  }
}
