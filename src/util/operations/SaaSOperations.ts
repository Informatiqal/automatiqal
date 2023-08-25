interface ISaaSOperation {
  name: string;
  isNonSource: boolean;
  type?: string;
  isPlural?: boolean;
  sensitiveProperty?: string[];
}

const item: ISaaSOperation[] = [
  { name: "item.get", isNonSource: false, type: "Item" },
  { name: "item.getAll", isNonSource: true, type: "Item", isPlural: true },
  { name: "item.collections", isNonSource: false, type: "Item" },
  { name: "item.publishedItems", isNonSource: false, type: "Item" },
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
  },
  { name: "dataConnection.remove", isNonSource: false, type: "DataConnection" },
  { name: "dataConnection.update", isNonSource: false, type: "DataConnection" },
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
];

const reload: ISaaSOperation[] = [
  { name: "reload.start", isNonSource: true, type: "Reload", isPlural: true },
];

const saasOperations: ISaaSOperation[] = [
  ...app,
  ...dataConnection,
  ...item,
  ...space,
  ...user,
  ...reload,
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