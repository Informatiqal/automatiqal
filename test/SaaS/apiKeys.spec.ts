import { describe, it, expect } from "vitest";
import { Automatiqal } from "../../src/index";
import { IRunBook } from "../../src/RunBook/RunBook.interfaces";

import { httpsAgentCert } from "./util";
import { IAPIKeyCreate } from "qlik-saas-api/dist/modules/APIKeys";
import { APIKey } from "qlik-saas-api/dist/modules/APIKey";

describe("API Keys", function () {
  it("All operations - all positive", async function () {
    const runBookConfig: IRunBook = {
      name: "API Keys",
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
          name: "Get all api keys init",
          operation: "apiKey.getAll",
        },
        {
          name: "Create API key",
          operation: "apiKey.create",
          details: {
            description: "Temp API key",
          } as IAPIKeyCreate,
        },
        {
          name: "Get all api keys mid",
          operation: "apiKey.getAll",
        },
        {
          name: "Update temp API key",
          operation: "apiKey.update",
          source: "Create API key",
          details: {
            description: "Temp API key (Updated)",
          },
        },
        {
          name: "Remove API key",
          operation: "apiKey.remove",
          source: "Create API key",
        },
        {
          name: "Get all api keys last",
          operation: "apiKey.getAll",
        },
      ],
    };

    const automatiqal = new Automatiqal(runBookConfig, httpsAgentCert);

    const errors: string[] = [];

    automatiqal.emitter.on("error", function (a) {
      errors.push(a);
    });

    const result = await automatiqal.run();

    expect(true).to.be.true;
    // at least one api key exists
    expect((result[2].data as unknown as APIKey[]).length).to.be.greaterThan(0);

    // after and before api key creation count should be 1 - we create only one api key
    expect(
      (result[2].data as unknown as APIKey[]).length -
        (result[0].data as unknown as APIKey[]).length
    ).to.be.equal(1);

    // once the temp api key is removed the total count of all api keys
    // should be the same as the start count (before creation)
    expect(
      (result[0].data as unknown as APIKey[]).length -
        (result[5].data as unknown as APIKey[]).length
    ).to.be.equal(0);
  });
});
