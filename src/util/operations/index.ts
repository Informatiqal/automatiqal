import { SaaSOperations } from "./SaaSOperations";
import { WinOperations } from "./WinOperations";

export class Operations {
  static instance: Operations;
  ops: SaaSOperations | WinOperations;

  constructor(runbookEdition: "saas" | "windows") {
    if (runbookEdition == "saas") this.ops = new SaaSOperations();
    if (runbookEdition == "windows") this.ops = new WinOperations();
  }

  public static getInstance(runbookEdition?: "saas" | "windows"): Operations {
    if (!Operations.instance) {
      Operations.instance = new Operations(runbookEdition);
    }
    return Operations.instance;
  }
}
