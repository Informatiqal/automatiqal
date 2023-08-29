import fs from "fs"
import { describe, it, expect } from "vitest";
import { Automatiqal } from "../../src/index";
import { IRunBook } from "../../src/RunBook/RunBook.interfaces";

import { httpsAgentCert } from "./util";
import { Extension } from "qlik-saas-api/dist/modules/Extension";
import { IExtensionImportData } from "qlik-saas-api/dist/modules/Extensions";

describe("Extensions", function () {
  it("All operations - all positive", async function () {
    const extensionZip = fs.readFileSync(`${process.env.IMPORT_EXTENSION_FILE}`)

    const runBookConfig: IRunBook = {
      name: "Extensions operations",
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
          name: "Get all extensions Init",
          operation: "extension.getAll",
        },
        {
          name: "Import extension",
          operation: "extension.import",
          details: {
            file: extensionZip,
            data: {
              name: "Automatiqal Test",
              type: "visualization"
            }
          } as {
            file: string | Buffer;
            data: IExtensionImportData;
        },
        },
        {
          name: "Get all extensions After",
          operation: "extension.getAll",
        },
        {
          name: "Update extension",
          operation: "extension.update",
          source: "Import extension",
          details: {
            data: {
              tags: ["temp tag", "another tag"]
            }
          } as  Partial<IExtensionImportData>
        },
        {
          name: "Remove extension",
          operation: "extension.remove",
          source: "Import extension",
        },
        {
          name: "Get all extensions End",
          operation: "extension.getAll",
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
    // the updated setup tags count is the same as the SaaS tags count
    expect((result[1].data as unknown as Extension).details.tags.length).to.be.equal(
      (runBookConfig.tasks[3].details as {data:Partial<IExtensionImportData>}).data.tags?.length
    );
    // the start and end SaaS entity count is the same
    expect((result[0].data as unknown as Extension[]).length).to.be.equal(
      (result[5].data as unknown as Extension[]).length
    );
    // SaaS entity count is 1 more than the SaaS entity count from the start
    expect((result[2].data as unknown as Extension[]).length).to.be.equal(
      (result[0].data as unknown as Extension[]).length + 1
    );
  });
});
