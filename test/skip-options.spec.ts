import * as https from "https";
import * as fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";

const dotEnvPath = path.resolve(".env");
import dotenv from "dotenv";
dotenv.config({ path: dotEnvPath });

import { Automatiqal } from "../src/index";
// import { Automatiqal } from "../dist/index";
import { IRunBook } from "../src/RunBook/RunBook.interfaces";

const cert = fs.readFileSync(`${process.env.TEST_CERT}/client.pem`);
const key = fs.readFileSync(`${process.env.TEST_CERT}/client_key.pem`);

const httpsAgentCert = new https.Agent({
  rejectUnauthorized: false,
  cert: cert,
  key: key,
});

describe("Various skip scenarios", function () {
  it("Preset skip and source", async function () {
    const runbook: IRunBook = {
      name: "Simple runbook",
      edition: "windows",
      environment: {
        host: `${process.env.TEST_HOST}`,
        port: 4242,
        authentication: {
          user_dir: `${process.env.TEST_USER_DIR}`,
          user_name: `${process.env.TEST_USER_ID}`,
          //@ts-ignore
          cert: "",
          key: "",
        },
      },
      tasks: [
        {
          name: "Get some apps",
          operation: "app.get",
          filter: "name sw '?'",
          skip: true,
        },
        {
          name: "Delete some apps",
          operation: "app.remove",
          source: "Get some apps",
        },
      ],
    };

    const automatiqal = new Automatiqal(runbook, {
      httpsAgent: httpsAgentCert,
    });

    let emitCounts = 0;
    automatiqal.emitter.on("task:result", function (a) {
      emitCounts++;
    });

    const result = await automatiqal.run();

    expect(emitCounts).to.be.equal(2);
    expect(result[0].status).to.be.equal("Skip");
    expect(result[0].skipReason).to.be.equal("Preset");
    expect(result[1].status).to.be.equal("Skip");
    expect(result[1].skipReason).to.be.equal("SourceSkipped");
  });

  it("'When' skip and source", async function () {
    const runbook: IRunBook = {
      name: "Simple runbook",
      edition: "windows",
      environment: {
        host: `${process.env.TEST_HOST}`,
        port: 4242,
        authentication: {
          user_dir: `${process.env.TEST_USER_DIR}`,
          user_name: `${process.env.TEST_USER_ID}`,
          //@ts-ignore
          cert: "",
          key: "",
        },
      },
      tasks: [
        {
          name: "Get some apps",
          operation: "app.get",
          filter: "name sw ''",
          when: "1 eq 0",
        },
        {
          name: "Delete some apps",
          operation: "app.remove",
          source: "Get some apps",
        },
      ],
    };

    const automatiqal = new Automatiqal(runbook, {
      httpsAgent: httpsAgentCert,
    });

    let emitCounts = 0;
    automatiqal.emitter.on("task:result", function (a) {
      emitCounts++;
    });

    const result = await automatiqal.run();

    expect(emitCounts).to.be.equal(2);
    expect(result[0].status).to.be.equal("Skip");
    expect(result[0].skipReason).to.be.equal("WhenCondition");
    expect(result[1].status).to.be.equal("Skip");
    expect(result[1].skipReason).to.be.equal("SourceSkipped");
  });
});
