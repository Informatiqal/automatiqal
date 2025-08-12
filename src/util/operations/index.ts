import { CustomError } from "../CustomError";
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

export function replaceInlineConstants(details, taskName, constants) {
  const regex = new RegExp(/(?<=\${)(.*?)(?=})/gm);

  let detailsString = JSON.stringify(details);

  const inlineVariablesMatch = [...detailsString.matchAll(regex)];
  const inlineVariables = [...new Set(inlineVariablesMatch.map((m) => m[1]))];
  if (inlineVariables.length == 0) return details;

  inlineVariables.map((v) => {
    // this check is still needed?
    // it should be handled in the beginning of the run?
    if (!constants || !constants[v])
      throw new CustomError(1030, taskName, { arg1: v });

    const inlineVariableDefinition = "".concat("${", v, "}");

    let value = constants[v];

    // if the constant is an object then pick a random weighted values
    if (value.constructor.name == "Object") {
      value = weightedRandom(value as { [k: string]: number });
    }

    if (Array.isArray(value) && value.length > 1)
      throw new CustomError(1024, "", {
        arg1: taskName,
        arg2: v,
      });

    detailsString = detailsString
      .split(inlineVariableDefinition)
      .join(Array.isArray(value) ? value[0] : value);
  });

  const detailsObject = JSON.parse(detailsString);
  return detailsObject;
}

function weightedRandom(constant: { [k: string]: number }) {
  const values = Object.keys(constant);
  const weights = Object.entries(constant).map(([a, b]) => b);

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  return values.find((_, i) => (random -= weights[i]) <= 0);
}
