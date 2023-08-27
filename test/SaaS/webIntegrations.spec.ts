import { describe, it, expect } from "vitest";
import { Automatiqal } from "../../src/index";
import { IRunBook } from "../../src/RunBook/RunBook.interfaces";

import { httpsAgentCert } from "./util";
import {
  IWebIntegrationUpdate,
  WebIntegration,
} from "qlik-saas-api/dist/modules/WebIntegration";
import { IWebIntegrationCreate } from "qlik-saas-api/dist/modules/WebIntegrations";

describe("Web integrations", function () {
  it("All operations - all positive", async function () {
    const runBookConfig: IRunBook = {
      name: "Web integrations operations",
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
          name: "Get all web integrations Init",
          operation: "webIntegration.getAll",
        },
        {
          name: "Create temp web integration",
          operation: "webIntegration.create",
          details: {
            name: "Temp web integration",
            validOrigins: [
              "http://localhost:3000",
              "http://localhost:3001",
              "http://localhost:5000",
              "http://localhost:3009",
            ],
          } as IWebIntegrationCreate,
        },
        {
          name: "Get all web web integrations Mid",
          operation: "webIntegration.getAll",
        },
        {
          name: "Get single web integration",
          operation: "webIntegration.get",
          source: "Create temp web integration",
        },
        {
          name: "Update temp web integration",
          operation: "webIntegration.update",
          filter: "id eq '$${Create temp web integration#id}'",
          details: [
            {
              path: "name",
              value: "Temp web integration (Updated)",
            },
          ] as IWebIntegrationUpdate[],
        },
        {
          name: "Remove temp web integration",
          operation: "webIntegration.remove",
          source: "Create temp web integration",
        },
        {
          name: "Get all web integrations Last",
          operation: "webIntegration.getAll",
        },
      ],
    };

    const automatiqal = new Automatiqal(runBookConfig, httpsAgentCert);

    const errors: string[] = [];

    automatiqal.emitter.on("error", function (a) {
      errors.push(a);
    });

    const result = await automatiqal.run();

    // at least one web integration exists
    expect(
      (result[2].data as unknown as WebIntegration[]).length
    ).to.be.greaterThan(0);

    // after and before web integration creation count should be 1 - we create only one web integration
    expect(
      (result[2].data as unknown as WebIntegration[]).length -
        (result[0].data as unknown as WebIntegration[]).length
    ).to.be.equal(1);

    // once the temp web integration is removed the total count of all web integrations
    // should be the same as the start count (before creation)
    expect(
      (result[0].data as unknown as WebIntegration[]).length -
        (result[6].data as unknown as WebIntegration[]).length
    ).to.be.equal(0);
  });
});
