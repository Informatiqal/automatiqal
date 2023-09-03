import { describe, it, expect } from "vitest";
import { Automatiqal } from "../../src/index";
import { IRunBook } from "../../src/RunBook/RunBook.interfaces";

import { httpsAgentCert } from "./util";
import {
  IWebHookPatch,
  IWebHookUpdate,
  WebHook,
} from "qlik-saas-api/dist/modules/WebHook";
import { IWebHookCreate } from "qlik-saas-api/dist/modules/WebHooks";

describe("Web hooks", function () {
  it("All operations - all positive", async function () {
    const runBookConfig: IRunBook = {
      name: "Webhooks operations",
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
          name: "Get all web hooks Init",
          operation: "webHook.getAll",
        },
        {
          name: "Create temp web hook",
          operation: "webHook.create",
          details: {
            name: "Temp web hook",
            url: "https://something-something.com",
          } as IWebHookCreate,
        },
        {
          name: "Get all web hooks Mid",
          operation: "webHook.getAll",
        },
        {
          name: "Get single web hook",
          operation: "webHook.get",
          // source: "Create temp web hook",
          filter: "id eq '$${Create temp web hook}'"
        },
        {
          name: "Update temp web hook",
          operation: "webHook.update",
          filter: "id eq '$${Create temp web hook#id}'",
          details: {
            enabled: true,
            name: "$${Create temp web hook#name} (Updated)",
          } as IWebHookUpdate,
        },
        {
          name: "Patch temp web hook",
          operation: "webHook.patch",
          filter: "id eq '$${Create temp web hook#id}'",
          details: [
            {
              op: "replace",
              path: "description",
              value: "some description",
            },
            {
              op: "replace",
              path: "name",
              value: "Patched name",
            },
          ] as IWebHookPatch[],
        },
        {
          name: "Remove temp web hook",
          operation: "webHook.remove",
          source: "Create temp web hook",
        },
        {
          name: "Get all web hooks Last",
          operation: "webHook.getAll",
        },
      ],
    };

    const automatiqal = new Automatiqal(runBookConfig, httpsAgentCert);

    const errors: string[] = [];

    automatiqal.emitter.on("error", function (a) {
      errors.push(a);
    });

    const result = await automatiqal.run();

    // at least one web hook exists
    expect((result[2].data as unknown as WebHook[]).length).to.be.greaterThan(
      0
    );

    // after and before webhook creation count should be 1 - we create only one webhook
    expect(
      (result[2].data as unknown as WebHook[]).length -
        (result[0].data as unknown as WebHook[]).length
    ).to.be.equal(1);

    // once the temp webhook is removed the total count of all web hooks
    // should be the same as the start count (before creation)
    expect(
      (result[0].data as unknown as WebHook[]).length -
        (result[7].data as unknown as WebHook[]).length
    ).to.be.equal(0);

    // the final name of the webhook should be the same as the patch task
    // expect((result[5].data as unknown as WebHook).details.name).to.be.equal(
    //   (runBookConfig.tasks[5].details as IWebHook).name
    // );
  });
});
