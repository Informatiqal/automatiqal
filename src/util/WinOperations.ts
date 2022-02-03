const winOperations: {
  name: string;
  isNonSource: boolean;
  type?: string;
  isPlural?: boolean;
}[] = [
  { name: "about.apiDefaults", isNonSource: true },
  { name: "about.apiDescription", isNonSource: true },
  { name: "about.apiRelations", isNonSource: true },
  { name: "about.enums", isNonSource: true },
  { name: "about.openApi", isNonSource: true },
  { name: "about.get", isNonSource: true },
  { name: "app.copy", isNonSource: false, type: "App" },
  { name: "app.get", isNonSource: false, type: "App" },
  { name: "app.export", isNonSource: false, type: "App" },
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
  { name: "certificate.export", isNonSource: true },
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
  { name: "node.get", isNonSource: false, type: "Node" },
  { name: "stream.create", isNonSource: true, type: "Stream", isPlural: true },
  { name: "stream.get", isNonSource: false, type: "Stream" },
  { name: "stream.getAll", isNonSource: true, type: "Stream", isPlural: true },
  { name: "stream.remove", isNonSource: false, type: "Stream" },
  { name: "stream.update", isNonSource: false, type: "Stream" },
  { name: "tag.create", isNonSource: true, type: "Tag", isPlural: true },
  { name: "tag.remove", isNonSource: false, type: "Tag" },
  { name: "tag.update", isNonSource: false, type: "Tag" },
  { name: "virtualProxy.create", isNonSource: true, type: "VirtualProxy" },
  { name: "virtualProxy.update", isNonSource: false, type: "VirtualProxy" },
];

export class WinOperations {
  nonSourceOperations: string[];
  nonSourceOperationsPlural: string[];
  names: string[];
  constructor() {
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
