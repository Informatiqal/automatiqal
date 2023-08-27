import { describe, it, expect } from "vitest";
import { Automatiqal } from "../../src/index";
import { IRunBook } from "../../src/RunBook/RunBook.interfaces";

import { httpsAgentCert } from "./util";
import { Space } from "qlik-saas-api/dist/modules/Space";

describe("Spaces", function () {
  it("All operations - all positive", async function () {
    const runBookConfig: IRunBook = {
      name: "Spaces operations",
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
          name: "Get all spaces Init",
          operation: "space.getAll",
        },
      ],
    };

    const automatiqal = new Automatiqal(runBookConfig, httpsAgentCert);

    const errors: string[] = [];

    automatiqal.emitter.on("error", function (a) {
      errors.push(a);
    });

    const result = await automatiqal.run();

    expect((result[0].data as unknown as Space[]).length).to.be.greaterThan(0);
  });
});
