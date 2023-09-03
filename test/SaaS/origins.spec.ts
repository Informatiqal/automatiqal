import { describe, it, expect } from "vitest";
import { Automatiqal } from "../../src/index";
import { IRunBook } from "../../src/RunBook/RunBook.interfaces";
import { IOriginCreate } from "qlik-saas-api/dist/modules/Origins";

import { httpsAgentCert } from "./util";
import { Origin } from "qlik-saas-api/dist/modules/Origin";

describe("CSP Origins", function () {
  it("All operations - all positive", async function () {
    const runBookConfig: IRunBook = {
      name: "CSP Origins operations",
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
          name: "Get all origins Init",
          operation: "origin.getAll",
        },
        {
          name: "Create origin",
          operation: "origin.create",
          details: {
            name: "Automatiqal Test",
            origin: "localhost:9999",
            childSrc: true,
            styleSrc: true,
            fontSrc: true,
          } as IOriginCreate,
        },
        {
          name: "Get all origins After",
          operation: "origin.getAll",
        },
        {
          name: "Update origin",
          operation: "origin.update",
          source: "Create origin",
          details: {
            name: "Automatiqal Test (Updated)",
            origin: "localhost:8888",
            workerSrc: true,
            fontSrc: false,
          } as IOriginCreate,
        },
        {
          name: "Get updated origin details",
          operation: "origin.get",
          filter: "id eq '$${Create origin}'",
        },
        {
          name: "Remove origin",
          operation: "origin.remove",
          source: "Create origin",
        },
        {
          name: "Get all origins End",
          operation: "origin.getAll",
        },
      ],
    };

    const automatiqal = new Automatiqal(runBookConfig, httpsAgentCert);

    const errors: string[] = [];

    automatiqal.emitter.on("error", function (a) {
      errors.push(a);
    });

    const result = await automatiqal.run();

    // no errors
    expect(errors.length).to.be.equal(0);
    // data for all tasks is returned
    expect(result.length).to.be.equal(runBookConfig.tasks.length);
    // the updated setup name is the same as the SaaS Origin
    expect((result[4].data as unknown as Origin[])[0].details.name).to.be.equal(
      (runBookConfig.tasks[3].details as IOriginCreate).name
    );
    // the start and end SaaS Origins count is the same
    expect((result[0].data as unknown as Origin[]).length).to.be.equal(
      (result[6].data as unknown as Origin[]).length
    );
    // SaaS Origins count is 1 more than the SaaS Origins count from the start
    expect((result[2].data as unknown as Origin[]).length).to.be.equal(
      (result[0].data as unknown as Origin[]).length + 1
    );
  });
});
