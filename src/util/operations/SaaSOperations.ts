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

const saasOperations: ISaaSOperation[] = [...item];

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
