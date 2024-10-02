interface IWinOperation {
  name: string;
  isNonSource: boolean;
  type?: string;
  isPlural?: boolean;
  sensitiveProperty?: string[];
  subTaskGroup?: string;
  realOperation?: string;
  dryRun?: "ignore";
}

const about: IWinOperation[] = [
  { name: "about.apiDefaults", isNonSource: true, type: "About" },
  { name: "about.apiDescription", isNonSource: true, type: "About" },
  { name: "about.apiRelations", isNonSource: true, type: "About" },
  { name: "about.enums", isNonSource: true, type: "About" },
  { name: "about.openApi", isNonSource: true, type: "About" },
  { name: "about.get", isNonSource: true, type: "About" },
];

const app: IWinOperation[] = [
  { name: "app.copy", isNonSource: false, type: "App" },
  { name: "app.get", isNonSource: false, type: "App" },
  { name: "app.getAll", isNonSource: true, type: "App", isPlural: true },
  { name: "app.export", isNonSource: false, type: "App" },
  { name: "app.exportMany", isNonSource: true, type: "App", isPlural: true },
  { name: "app.publish", isNonSource: false, type: "App" },
  { name: "app.remove", isNonSource: false, type: "App" },
  { name: "app.switch", isNonSource: false, type: "App" },
  { name: "app.update", isNonSource: false, type: "App" },
  {
    name: "app.upload",
    isNonSource: true,
    type: "App",
    isPlural: true,
    dryRun: "ignore",
  },
  {
    name: "app.uploadMany",
    isNonSource: true,
    type: "App",
    isPlural: true,
    dryRun: "ignore",
  },
  {
    name: "app.uploadAndReplace",
    isNonSource: true,
    type: "App",
    isPlural: true,
    dryRun: "ignore",
  },
];

const certificate: IWinOperation[] = [
  {
    name: "certificate.export",
    isNonSource: true,
    type: "Certificate",
    sensitiveProperty: ["certificatePassword"],
  },
  {
    name: "certificate.distributionPathGet",
    isNonSource: true,
    type: "Certificate",
  },
];

const customProperty: IWinOperation[] = [
  {
    name: "customProperty.create",
    isNonSource: true,
    type: "CustomProperty",
    isPlural: true,
    dryRun: "ignore",
  },
  {
    name: "customProperty.update",
    isNonSource: false,
    type: "CustomProperty",
  },
  {
    name: "customProperty.remove",
    isNonSource: false,
    type: "CustomProperty",
  },
];

const compositeTrigger: IWinOperation[] = [
  {
    name: "compositeTrigger.remove",
    isNonSource: false,
    type: "CompositeTrigger",
    isPlural: false,
  },
  {
    name: "compositeTrigger.update",
    isNonSource: false,
    type: "CompositeTrigger",
    isPlural: false,
  },
  {
    name: "compositeTrigger.create",
    isNonSource: true,
    type: "CompositeTrigger",
    isPlural: true,
    dryRun: "ignore",
  },
  {
    name: "compositeTrigger.get",
    isNonSource: false,
    type: "CompositeTrigger",
    isPlural: true,
  },
  {
    name: "compositeTrigger.getAll",
    isNonSource: true,
    type: "CompositeTrigger",
    isPlural: true,
  },
];

const schemaTrigger: IWinOperation[] = [
  {
    name: "schemaTrigger.remove",
    isNonSource: false,
    type: "SchemaTrigger",
    isPlural: false,
  },
  {
    name: "schemaTrigger.update",
    isNonSource: false,
    type: "SchemaTrigger",
    isPlural: false,
  },
  {
    name: "schemaTrigger.create",
    isNonSource: true,
    type: "SchemaTrigger",
    isPlural: true,
    dryRun: "ignore",
  },
  {
    name: "schemaTrigger.get",
    isNonSource: false,
    type: "SchemaTrigger",
    isPlural: true,
  },
  {
    name: "schemaTrigger.getAll",
    isNonSource: true,
    type: "SchemaTrigger",
    isPlural: true,
  },
];

const contentLibrary: IWinOperation[] = [
  { name: "contentLibrary.get", isNonSource: false, type: "ContentLibrary" },
  {
    name: "contentLibrary.getAll",
    isNonSource: true,
    type: "ContentLibrary",
    isPlural: true,
  },
  {
    name: "contentLibrary.importFile",
    isNonSource: false,
    type: "ContentLibrary",
    isPlural: false,
    dryRun: "ignore",
  },
  {
    name: "contentLibrary.importFileMany",
    isNonSource: false,
    type: "ContentLibrary",
    isPlural: false,
    dryRun: "ignore",
  },
  {
    name: "contentLibrary.removeFile",
    isNonSource: false,
    type: "ContentLibrary",
    isPlural: false,
  },
  {
    name: "contentLibrary.removeFileMany",
    isNonSource: false,
    type: "ContentLibrary",
    isPlural: false,
  },
  {
    name: "contentLibrary.importForApp",
    isNonSource: false,
    type: "ContentLibrary",
    dryRun: "ignore",
  },
  { name: "contentLibrary.export", isNonSource: false, type: "ContentLibrary" },
  {
    name: "contentLibrary.exportMany",
    isNonSource: false,
    type: "ContentLibrary",
  },
  {
    name: "contentLibrary.create",
    isNonSource: true,
    type: "ContentLibrary",
    isPlural: true,
    dryRun: "ignore",
  },
  { name: "contentLibrary.update", isNonSource: false, type: "ContentLibrary" },
  {
    name: "contentLibrary.remove",
    isNonSource: false,
    type: "ContentLibrary",
    isPlural: true,
  },
];

const dataConnection: IWinOperation[] = [
  {
    name: "dataConnection.get",
    isNonSource: false,
    type: "DataConnection",
    isPlural: true,
  },
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
    sensitiveProperty: ["password"],
    dryRun: "ignore",
  },
  {
    name: "dataConnection.remove",
    isNonSource: false,
    type: "DataConnection",
    isPlural: false,
  },
  {
    name: "dataConnection.update",
    isNonSource: false,
    type: "DataConnection",
    isPlural: false,
    sensitiveProperty: ["password"],
  },
];

const extension: IWinOperation[] = [
  {
    name: "extension.get",
    isNonSource: false,
    type: "Extension",
    isPlural: true,
  },
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
    sensitiveProperty: ["password"],
    dryRun: "ignore",
  },
  {
    name: "extension.remove",
    isNonSource: false,
    type: "Extension",
    isPlural: false,
  },
  {
    name: "extension.update",
    isNonSource: false,
    type: "Extension",
    isPlural: false,
  },
];

const proxy = [
  {
    name: "proxy.update",
    isNonSource: false,
    type: "ProxyService",
    isPlural: false,
  },
];

const externalTask: IWinOperation[] = [
  {
    name: "externalTask.addTriggerSchema",
    isNonSource: false,
    type: "ExternalTask",
    isPlural: false,
    dryRun: "ignore",
  },
  {
    name: "externalTask.addTriggerMany",
    isNonSource: false,
    type: "ExternalTask",
    isPlural: false,
    dryRun: "ignore",
  },
  {
    name: "externalTask.create",
    isNonSource: true,
    type: "ExternalTask",
    isPlural: true,
    dryRun: "ignore",
  },
  {
    name: "externalTask.get",
    isNonSource: false,
    type: "ExternalTask",
    isPlural: true,
  },
  {
    name: "externalTask.getAll",
    isNonSource: true,
    type: "ExternalTask",
    isPlural: true,
  },
  {
    name: "externalTask.start",
    isNonSource: false,
    type: "ExternalTask",
    isPlural: false,
    dryRun: "ignore",
  },
  {
    name: "externalTask.startSynchronous",
    isNonSource: false,
    type: "ExternalTask",
    isPlural: false,
    dryRun: "ignore",
  },
  {
    name: "externalTask.update",
    isNonSource: false,
    type: "ExternalTask",
    isPlural: false,
  },
  {
    name: "externalTask.waitExecution",
    isNonSource: false,
    type: "ExternalTask",
    isPlural: false,
    dryRun: "ignore",
  },
  {
    name: "externalTask.remove",
    isNonSource: false,
    type: "ExternalTask",
    isPlural: false,
  },
];

const node: IWinOperation[] = [
  { name: "node.get", isNonSource: false, type: "Node", isPlural: true },
  { name: "node.getAll", isNonSource: true, type: "Node", isPlural: true },
];

const reloadTask: IWinOperation[] = [
  {
    name: "reloadTask.create",
    isNonSource: true,
    type: "ReloadTask",
    isPlural: true,
    dryRun: "ignore",
  },
  {
    name: "reloadTask.remove",
    isNonSource: false,
    type: "ReloadTask",
    isPlural: false,
  },
  {
    name: "reloadTask.get",
    isNonSource: false,
    type: "ReloadTask",
    isPlural: true,
  },
  {
    name: "reloadTask.getAll",
    isNonSource: true,
    type: "ReloadTask",
    isPlural: true,
  },
  {
    name: "reloadTask.start",
    isNonSource: false,
    type: "ReloadTask",
    isPlural: false,
    dryRun: "ignore",
  },
  {
    name: "reloadTask.startSynchronous",
    isNonSource: false,
    type: "ReloadTask",
    isPlural: false,
    dryRun: "ignore",
  },
  {
    name: "reloadTask.update",
    isNonSource: false,
    type: "ReloadTask",
    isPlural: false,
  },
  {
    name: "reloadTask.waitExecution",
    isNonSource: false,
    type: "ReloadTask",
    isPlural: false,
    dryRun: "ignore",
  },
];

const stream: IWinOperation[] = [
  {
    name: "stream.create",
    isNonSource: true,
    type: "Stream",
    isPlural: true,
    dryRun: "ignore",
  },
  { name: "stream.get", isNonSource: false, type: "Stream" },
  { name: "stream.getAll", isNonSource: true, type: "Stream", isPlural: true },
  { name: "stream.remove", isNonSource: false, type: "Stream" },
  { name: "stream.update", isNonSource: false, type: "Stream" },
];

const customBanner: IWinOperation[] = [
  {
    name: "customBannerMessage.create",
    isNonSource: true,
    type: "CustomBanner",
    isPlural: true,
    dryRun: "ignore",
  },
  { name: "customBannerMessage.get", isNonSource: false, type: "CustomBanner" },
  {
    name: "customBannerMessage.getAll",
    isNonSource: true,
    type: "CustomBanner",
    isPlural: true,
  },
  {
    name: "customBannerMessage.remove",
    isNonSource: false,
    type: "CustomBanner",
  },
  {
    name: "customBannerMessage.update",
    isNonSource: false,
    type: "CustomBanner",
  },
];

const engineHealth: IWinOperation[] = [
  {
    name: "engineHealth.create",
    isNonSource: true,
    type: "EngineHealth",
    isPlural: true,
    dryRun: "ignore",
  },
  { name: "engineHealth.get", isNonSource: false, type: "EngineHealth" },
  {
    name: "engineHealth.getAll",
    isNonSource: true,
    type: "EngineHealth",
    isPlural: true,
  },
  { name: "engineHealth.remove", isNonSource: false, type: "EngineHealth" },
  { name: "engineHealth.update", isNonSource: false, type: "EngineHealth" },
];

const systemRule: IWinOperation[] = [
  {
    name: "systemRule.create",
    isNonSource: true,
    type: "SystemRule",
    isPlural: true,
    dryRun: "ignore",
  },
  {
    name: "systemRule.get",
    isNonSource: false,
    type: "SystemRule",
    isPlural: true,
  },
  {
    name: "systemRule.getAll",
    isNonSource: true,
    type: "SystemRule",
    isPlural: true,
  },
  {
    name: "systemRule.remove",
    isNonSource: false,
    type: "SystemRule",
    isPlural: false,
  },
  {
    name: "systemRule.licenseCreate",
    isNonSource: true,
    type: "SystemRule",
    isPlural: true,
    dryRun: "ignore",
  },
  {
    name: "systemRule.update",
    isNonSource: false,
    type: "SystemRule",
    isPlural: false,
  },
];

const tag: IWinOperation[] = [
  {
    name: "tag.create",
    isNonSource: true,
    type: "Tag",
    isPlural: true,
    dryRun: "ignore",
  },
  {
    name: "tag.createMany",
    isNonSource: true,
    type: "Tag",
    isPlural: true,
    dryRun: "ignore",
  },
  { name: "tag.remove", isNonSource: false, type: "Tag" },
  { name: "tag.update", isNonSource: false, type: "Tag" },
];

const task: IWinOperation[] = [
  {
    name: "task.get",
    isNonSource: false,
    type: "Task",
    isPlural: true,
  },
  {
    name: "task.getAll",
    isNonSource: true,
    type: "Task",
    isPlural: true,
  },
  {
    name: "task.start",
    isNonSource: false,
    type: "Task",
    isPlural: false,
    dryRun: "ignore",
  },
  {
    name: "task.startSynchronous",
    isNonSource: false,
    type: "Task",
    isPlural: false,
    dryRun: "ignore",
  },
  {
    name: "task.stop",
    isNonSource: false,
    type: "Task",
    isPlural: false,
    dryRun: "ignore",
  },
];

const virtualProxy: IWinOperation[] = [
  {
    name: "virtualProxy.get",
    isNonSource: false,
    type: "VirtualProxy",
    isPlural: true,
  },
  {
    name: "virtualProxy.getAll",
    isNonSource: true,
    type: "VirtualProxy",
    isPlural: true,
  },
  {
    name: "virtualProxy.create",
    isNonSource: true,
    type: "VirtualProxy",
    isPlural: true,
    sensitiveProperty: ["jwtPublicKeyCertificate", "oidcClientSecret"],
    dryRun: "ignore",
  },
  {
    name: "virtualProxy.remove",
    isNonSource: false,
    type: "VirtualProxy",
    isPlural: false,
  },
  {
    name: "virtualProxy.update",
    isNonSource: false,
    type: "VirtualProxy",
    sensitiveProperty: ["jwtPublicKeyCertificate"],
  },
];

const user: IWinOperation[] = [
  { name: "user.get", isNonSource: false, type: "User", isPlural: true },
  { name: "user.getAll", isNonSource: true, type: "User", isPlural: true },
  {
    name: "user.create",
    isNonSource: true,
    type: "User",
    isPlural: true,
    dryRun: "ignore",
  },
  { name: "user.remove", isNonSource: false, type: "User" },
  { name: "user.update", isNonSource: false, type: "User" },
];

const winOperations: IWinOperation[] = [
  ...about,
  ...app,
  ...certificate,
  ...contentLibrary,
  ...compositeTrigger,
  ...customBanner,
  ...customProperty,
  ...dataConnection,
  ...engineHealth,
  ...extension,
  ...externalTask,
  ...node,
  ...reloadTask,
  ...schemaTrigger,
  ...stream,
  ...systemRule,
  ...tag,
  ...task,
  ...virtualProxy,
  ...user,
  ...proxy,
];

export class WinOperations {
  nonSourceOperations: string[];
  nonSourceOperationsPlural: string[];
  sensitiveDataOperations: string[];
  dryRunIgnoreOperations: string[];
  names: string[];
  allOperations: IWinOperation[];
  opTypes: { [key: string]: string };
  constructor() {
    this.allOperations = winOperations;

    let b: { [key: string]: string } = {};
    for (let o of winOperations) {
      b[o.name] = o.type;
    }

    this.opTypes = b;

    // TODO: add all required tasks
    this.nonSourceOperations = winOperations
      .filter((o) => o.isNonSource == true)
      .map((o) => o.name);

    this.nonSourceOperationsPlural = winOperations
      .filter((o) => o.isPlural == true)
      .map((o) => o.name);

    this.names = winOperations.map((o) => o.name);

    this.sensitiveDataOperations = winOperations
      .filter((o) => o.hasOwnProperty("sensitiveProperty"))
      .map((t) => t.name);

    this.dryRunIgnoreOperations = this.allOperations
      .filter((f) => f.dryRun && f.dryRun == "ignore")
      .map((f) => f.name);
  }

  filter(name: string) {
    return winOperations.filter((o) => o.name == name)[0];
  }
}
