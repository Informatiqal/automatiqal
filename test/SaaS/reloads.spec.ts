import { describe, it, expect } from "vitest";
import { Automatiqal } from "../../src/index";
import { IRunBook } from "../../src/RunBook/RunBook.interfaces";

import { httpsAgentCert } from "./util";
import { Reload } from "qlik-saas-api/dist/modules/Reload";

describe("Reloads", function () {
  it("All operations - all positive", async function () {
    const runBookConfig: IRunBook = {
      name: "Reloads",
      edition: "saas",
      environment: {
        host: `${process.env.SAAS_URL}`,
        port: 443,
        authentication: {
          token: `${process.env.SAAS_TOKEN}`,
        },
      },
      tasks: [
      {
        name: "Get all Init",
        operation: "reload.getAll",
      },
      {
        name: "Start reload",
        operation: "reload.start",
        details: {
          appId: `${process.env.RELOAD_APP_ID}`
        }
      },
      {
        name: "Get all Mid",
        operation: "reload.getAll",
      },
      {
        name: "Stop reload",
        operation: "reload.cancel",
        source: "Start reload"
      },
      {
        name: "Get all Last",
        operation: "reload.getAll",
        },
    ],
    };

    const automatiqal = new Automatiqal(runBookConfig, httpsAgentCert);

    const errors: string[] = [];

    automatiqal.emitter.on("error", function (a) {
      errors.push(a);
    });

    const result = await automatiqal.run();

    // at least one entity exists
    expect((result[2].data as unknown as Reload[]).length).to.be.greaterThan(0);

    // after and before entity creation count should be 1 - we create only one entity
    expect(
      (result[2].data as unknown as Reload[]).length -
        (result[0].data as unknown as Reload[]).length
    ).to.be.equal(1);

    // cancel reload should return 202/204 - "Reload is being cancelled"
    expect(result[3].data as unknown as number).to.be.oneOf([202, 204]);

    // once the temp api key is removed the total count of all api keys
    // should be the same as the start count (before creation)
    expect((result[1].data as unknown as Reload).details.status).to.be.oneOf(["CANCELING", "CANCELED", "QUEUED"]);
  });
});
