interface IWinOperation {
  name: string;
  isNonSource: boolean;
  type?: string;
  isPlural?: boolean;
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
  { name: "app.upload", isNonSource: true, type: "App", isPlural: true },
  {
    name: "app.uploadAndReplace",
    isNonSource: true,
    type: "App",
    isPlural: true,
  },
];

const certificate: IWinOperation[] = [
  { name: "certificate.export", isNonSource: true, type: "Certificate" },
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
  },
  {
    name: "contentLibrary.importFileMany",
    isNonSource: false,
    type: "ContentLibrary",
    isPlural: false,
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
  },
  {
    name: "externalTask.addTriggerMany",
    isNonSource: false,
    type: "ExternalTask",
    isPlural: false,
  },
  {
    name: "externalTask.create",
    isNonSource: true,
    type: "ExternalTask",
    isPlural: true,
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
  },
  {
    name: "externalTask.startSynchronous",
    isNonSource: false,
    type: "ExternalTask",
    isPlural: false,
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
  },
  {
    name: "reloadTask.startSynchronous",
    isNonSource: false,
    type: "ReloadTask",
    isPlural: false,
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
  },
];

const stream: IWinOperation[] = [
  { name: "stream.create", isNonSource: true, type: "Stream", isPlural: true },
  { name: "stream.get", isNonSource: false, type: "Stream" },
  { name: "stream.getAll", isNonSource: true, type: "Stream", isPlural: true },
  { name: "stream.remove", isNonSource: false, type: "Stream" },
  { name: "stream.update", isNonSource: false, type: "Stream" },
];

const systemRule: IWinOperation[] = [
  {
    name: "systemRule.create",
    isNonSource: true,
    type: "SystemRule",
    isPlural: true,
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
  },
  {
    name: "systemRule.update",
    isNonSource: false,
    type: "SystemRule",
    isPlural: false,
  },
];

const tag: IWinOperation[] = [
  { name: "tag.create", isNonSource: true, type: "Tag", isPlural: true },
  { name: "tag.createMany", isNonSource: true, type: "Tag", isPlural: true },
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
  },
  {
    name: "task.startSynchronous",
    isNonSource: false,
    type: "Task",
    isPlural: false,
  },
  {
    name: "task.stop",
    isNonSource: false,
    type: "Task",
    isPlural: false,
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
  },
  {
    name: "virtualProxy.remove",
    isNonSource: false,
    type: "VirtualProxy",
    isPlural: false,
  },
  { name: "virtualProxy.update", isNonSource: false, type: "VirtualProxy" },
];

const user: IWinOperation[] = [
  { name: "user.get", isNonSource: false, type: "User", isPlural: true },
  { name: "user.getAll", isNonSource: true, type: "User", isPlural: true },
  { name: "user.create", isNonSource: true, type: "User", isPlural: true },
  { name: "user.remove", isNonSource: false, type: "User" },
  { name: "user.update", isNonSource: false, type: "User" },
];

const winOperations: IWinOperation[] = [
  ...about,
  ...app,
  ...certificate,
  ...contentLibrary,
  ...compositeTrigger,
  ...customProperty,
  ...dataConnection,
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
  }

  filter(name: string) {
    return winOperations.filter((o) => o.name == name)[0];
  }
}
