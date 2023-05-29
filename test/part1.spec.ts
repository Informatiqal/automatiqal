import * as https from "https";
import * as fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";

const dotEnvPath = path.resolve(".env");
import dotenv from "dotenv";
dotenv.config({ path: dotEnvPath });

import { Automatiqal } from "../src/index";
import { IRunBook } from "../src/RunBook/RunBook.interfaces";
import {
  ICustomProperty,
  ICustomPropertyCondensed,
  IStream,
} from "qlik-repo-api/dist/types/interfaces";
import { IRunBookResult } from "../src/RunBook/Runner";

const cert = fs.readFileSync(`${process.env.TEST_CERT}/client.pem`);
const key = fs.readFileSync(`${process.env.TEST_CERT}/client_key.pem`);

const httpsAgentCert = new https.Agent({
  rejectUnauthorized: false,
  cert: cert,
  key: key,
});

describe("General", function () {
  it("Get About", async function () {
    const runbook: IRunBook = {
      name: "Simple runbook",
      environment: {
        host: `${process.env.TEST_HOST}`,
        port: 4242,
        authentication: {
          user_dir: `${process.env.TEST_USER_DIR}`,
          user_name: `${process.env.TEST_USER_ID}`,
        },
      },
      tasks: [
        {
          name: "Get about",
          operation: "about.get",
        },
      ],
    };

    const automatiqal = new Automatiqal(runbook, httpsAgentCert);
    const result = await automatiqal.run();

    expect(result.length).to.be.equal(1);
    expect(result[0].data).to.haveOwnProperty("buildVersion");
  });

  it("No tasks defined or tasks prop missing", async function () {
    const runbook: IRunBook = {
      name: "Simple runbook",
      environment: {
        host: `${process.env.TEST_HOST}`,
        port: 4242,
        authentication: {
          user_dir: `${process.env.TEST_USER_DIR}`,
          user_name: `${process.env.TEST_USER_ID}`,
        },
      },
      tasks: [],
    };

    let isNothingToProcessError = false;

    try {
      const automatiqal = new Automatiqal(runbook, httpsAgentCert);
    } catch (e) {
      if (e.message.indexOf("Nothing to process") > -1)
        isNothingToProcessError = true;
    }

    expect(isNothingToProcessError).to.be.true;
  });
});

describe("OnError", function () {
  it("Ignore and continue", async function () {
    const runbook: IRunBook = {
      name: "Simple runbook",
      environment: {
        host: `${process.env.TEST_HOST}`,
        port: 4242,
        authentication: {
          user_dir: `${process.env.TEST_USER_DIR}`,
          user_name: `${process.env.TEST_USER_ID}`,
        },
      },
      tasks: [
        {
          name: "Remove non existing app",
          operation: "app.remove",
          filter: "name -eq '123456'",
          onError: {
            ignore: true,
          },
        },
        {
          name: "Get About",
          operation: "about.get",
        },
      ],
    };

    const automatiqal = new Automatiqal(runbook, httpsAgentCert);

    const result = await automatiqal.run();

    expect(result[0].status).to.be.equal("Error");
    expect(result.length).to.be.equal(2);
    expect(result[1].data).to.haveOwnProperty("buildVersion");
  });

  it("Force exit", async function () {
    const runbook: IRunBook = {
      name: "Simple runbook",
      environment: {
        host: `${process.env.TEST_HOST}`,
        port: 4242,
        authentication: {
          user_dir: `${process.env.TEST_USER_DIR}`,
          user_name: `${process.env.TEST_USER_ID}`,
        },
      },
      tasks: [
        {
          name: "Remove non existing app",
          operation: "app.remove",
          filter: "name -eq '123456'",
          onError: {
            exit: true,
          },
        },
        {
          name: "Get About",
          operation: "about.get",
        },
      ],
    };

    let catchError = "";

    try {
      const automatiqal = new Automatiqal(runbook, httpsAgentCert);

      const result = await automatiqal.run();
    } catch (e) {
      catchError = e.message;
    }

    expect(catchError.indexOf("User defined exit")).to.be.greaterThan(-1);
  });

  it("Run tasks", async function () {
    const runbook: IRunBook = {
      name: "Simple runbook",
      environment: {
        host: `${process.env.TEST_HOST}`,
        port: 4242,
        authentication: {
          user_dir: `${process.env.TEST_USER_DIR}`,
          user_name: `${process.env.TEST_USER_ID}`,
        },
      },
      tasks: [
        {
          name: "Remove non existing app",
          operation: "app.remove",
          filter: "name -eq '123456'",
          onError: {
            tasks: [
              {
                name: "Get About",
                operation: "about.get",
              },
            ],
          },
        },
      ],
    };

    const automatiqal = new Automatiqal(runbook, httpsAgentCert);

    const result = await automatiqal.run();

    expect(result[0].status).to.be.equal("Error");
    expect(result[1].data).to.haveOwnProperty("buildVersion");
  });
});

describe("Multiple objects", function () {
  it("Non-explicitly not allowed", async function () {
    const runbook: IRunBook = {
      name: "Simple runbook",
      environment: {
        host: `${process.env.TEST_HOST}`,
        port: 4242,
        authentication: {
          user_dir: `${process.env.TEST_USER_DIR}`,
          user_name: `${process.env.TEST_USER_ID}`,
        },
      },
      tasks: [
        {
          name: "Multiple streams",
          operation: "stream.remove",
          filter: "name ew '_test'",
        },
      ],
    };

    let multiplesError = "";

    try {
      const automatiqal = new Automatiqal(runbook, httpsAgentCert);

      await automatiqal.run();
    } catch (e) {
      multiplesError = e.message;
    }

    expect(
      multiplesError.indexOf("will be performed on multiple objects")
    ).to.be.greaterThan(-1);
  });

  it("Explicitly not allowed", async function () {
    const runbook: IRunBook = {
      name: "Simple runbook",
      environment: {
        host: `${process.env.TEST_HOST}`,
        port: 4242,
        authentication: {
          user_dir: `${process.env.TEST_USER_DIR}`,
          user_name: `${process.env.TEST_USER_ID}`,
        },
      },
      tasks: [
        {
          name: "Multiple streams",
          operation: "stream.remove",
          filter: "name ew '_test'",
          options: {
            multiple: false,
          },
        },
      ],
    };

    let multiplesError = "";

    try {
      const automatiqal = new Automatiqal(runbook, httpsAgentCert);

      await automatiqal.run();
    } catch (e) {
      multiplesError = e.message;
    }

    expect(
      multiplesError.indexOf("will be performed on multiple objects")
    ).to.be.greaterThan(-1);
  });
});

describe("Variables usage", function () {
  it("Special variables", async function () {
    const runbook: IRunBook = {
      name: "Simple runbook",
      environment: {
        host: `${process.env.TEST_HOST}`,
        port: 4242,
        authentication: {
          user_dir: `${process.env.TEST_USER_DIR}`,
          user_name: `${process.env.TEST_USER_ID}`,
        },
      },
      tasks: [
        {
          name: "Create temp custom property",
          operation: "customProperty.create",
          details: {
            name: "Something",
            choiceValues: [
              "${NOW}",
              "${TODAY}",
              "${GUID}",
              "${INCREMENT}",
              "${INCREMENT}",
            ],
          },
        },
        {
          name: "Remove custom property",
          operation: "customProperty.remove",
          source: "Create temp custom property",
        },
      ],
    };

    const automatiqal = new Automatiqal(runbook, httpsAgentCert);
    const result = await automatiqal.run();

    expect(result.length).to.be.equal(2);
    expect(result[1].data).to.be.equal(204);
    expect(
      ((result[0].data as IRunBookResult).details as ICustomPropertyCondensed)
        .choiceValues.length
    ).to.be.equal(5);
    expect(
      ((result[0].data as IRunBookResult).details as ICustomPropertyCondensed)
        .choiceValues[0].length
    ).to.be.equal(14);
    expect(
      ((result[0].data as IRunBookResult).details as ICustomPropertyCondensed)
        .choiceValues[1].length
    ).to.be.equal(8);
    expect(
      ((result[0].data as IRunBookResult).details as ICustomPropertyCondensed)
        .choiceValues[2].length
    ).to.be.equal(32);
    expect(
      ((result[0].data as IRunBookResult).details as ICustomPropertyCondensed)
        .choiceValues[3]
    ).to.be.equal("1");
    expect(
      ((result[0].data as IRunBookResult).details as ICustomPropertyCondensed)
        .choiceValues[4]
    ).to.be.equal("2");
  });

  it("Inline variable in filter", async function () {
    const runbook: IRunBook = {
      name: "Simple runbook",
      environment: {
        host: `${process.env.TEST_HOST}`,
        port: 4242,
        authentication: {
          user_dir: `${process.env.TEST_USER_DIR}`,
          user_name: `${process.env.TEST_USER_ID}`,
        },
      },
      tasks: [
        {
          name: "Create temp custom property",
          operation: "customProperty.create",
          details: {
            name: "Something",
            choiceValues: ["${RANDOM}"],
          },
        },
        {
          name: "Remove custom property",
          operation: "customProperty.remove",
          filter: "name eq '$${Create temp custom property#name}'",
        },
      ],
    };

    const automatiqal = new Automatiqal(runbook, httpsAgentCert);
    const result = await automatiqal.run();

    expect(result.length).to.be.equal(2);
    expect(
      ((result[0].data as IRunBookResult).details as ICustomProperty)
        .choiceValues.length
    ).to.be.equal(1);
    expect((result[1].data as []).length).to.be.equal(1);
    expect(result[1].data[0]).to.be.equal(204);
  });

  it("Inline variable in details", async function () {
    const runbook: IRunBook = {
      name: "Simple runbook",
      environment: {
        host: `${process.env.TEST_HOST}`,
        port: 4242,
        authentication: {
          user_dir: `${process.env.TEST_USER_DIR}`,
          user_name: `${process.env.TEST_USER_ID}`,
        },
      },
      tasks: [
        {
          name: "Create temp stream",
          operation: "stream.create",
          details: {
            name: "${RANDOM}",
          },
        },
        {
          name: "Create temp custom property",
          operation: "customProperty.create",
          details: {
            name: "$${Create temp stream#name}",
            choiceValues: ["value1"],
            objectTypes: ["App"],
          },
        },
        {
          name: "Remove temp stream",
          operation: "stream.remove",
          source: "Create temp stream",
        },
        {
          name: "Remove temp custom property",
          operation: "customProperty.remove",
          filter: "name eq '$${Create temp custom property#name}'",
        },
      ],
    };

    const automatiqal = new Automatiqal(runbook, httpsAgentCert);
    const result = await automatiqal.run();

    const streamName = ((result[0].data as IRunBookResult).details as IStream)
      .name;
    const customPropertyName = (
      (result[0].data as IRunBookResult).details as ICustomProperty
    ).name;

    expect(result.length).to.be.equal(4);
    expect(customPropertyName).to.be.equal(streamName);
    expect(result[2].data).to.be.equal(204);
    expect(result[3].data[0]).to.be.equal(204);
  });
});

describe("Custom properties and tags", function () {
  it("Append/add custom properties", async function () {
    const runbook: IRunBook = {
      name: "Simple runbook",
      environment: {
        host: `${process.env.TEST_HOST}`,
        port: 4242,
        authentication: {
          user_dir: `${process.env.TEST_USER_DIR}`,
          user_name: `${process.env.TEST_USER_ID}`,
        },
      },
      tasks: [
        {
          name: "Stream before update",
          operation: "stream.get",
          filter: `id eq ${process.env.TEST_STREAM_ID}`,
        },
        {
          name: "Update stream 1",
          description: "Append custom properties",
          operation: "stream.update",
          filter: `id eq ${process.env.TEST_STREAM_ID}`,
          details: {
            customProperties: [
              "TestCustomProperty=value 2",
              "TestCustomProperty=value 3",
              "StreamAccess=ADGroup1",
            ],
          },
          options: {
            customPropertyOperation: "add",
          },
        },
        {
          name: "Update stream 2",
          description: "Remove custom properties",
          operation: "stream.update",
          filter: `id eq ${process.env.TEST_STREAM_ID}`,
          details: {
            customProperties: [
              "TestCustomProperty=value 2",
              "TestCustomProperty=value 3",
              "StreamAccess=ADGroup1",
            ],
          },
          options: {
            customPropertyOperation: "remove",
          },
        },
      ],
    };

    const automatiqal = new Automatiqal(runbook, httpsAgentCert);
    const result = await automatiqal.run();

    const customPropsCountBase = (result[0].data[0].details as IStream)
      .customProperties.length;

    const customPropsCountAdd = (result[1].data[0] as IStream).customProperties
      .length;

    const customPropsCountRemove = (result[2].data[0] as IStream)
      .customProperties.length;

    expect(customPropsCountBase + 3).to.be.equal(customPropsCountAdd);
    expect(customPropsCountBase).to.be.equal(customPropsCountRemove);
  });

  it("Set/overwrite custom properties", async function () {
    const runbook: IRunBook = {
      name: "Simple runbook",
      environment: {
        host: `${process.env.TEST_HOST}`,
        port: 4242,
        authentication: {
          user_dir: `${process.env.TEST_USER_DIR}`,
          user_name: `${process.env.TEST_USER_ID}`,
        },
      },
      tasks: [
        {
          name: "Update stream 1",
          description: "Append custom properties",
          operation: "stream.update",
          filter: `id eq ${process.env.TEST_STREAM_ID}`,
          details: {
            customProperties: [
              "TestCustomProperty=value 2",
              "StreamAccess=ADGroup1",
            ],
          },
          options: {
            customPropertyOperation: "set",
          },
        },
      ],
    };

    const automatiqal = new Automatiqal(runbook, httpsAgentCert);
    const result = await automatiqal.run();

    const customPropsCountSet = (result[0].data[0] as IStream).customProperties
      .length;

    expect(customPropsCountSet).to.be.equal(2);
  });

  it("Update with missing custom property", async function () {
    let expectedError =
      'customProperty.get: Custom property with name "RandomCustomProperty" do not exists';
    let error = "";

    try {
      const runbook: IRunBook = {
        name: "Simple runbook",
        environment: {
          host: `${process.env.TEST_HOST}`,
          port: 4242,
          authentication: {
            user_dir: `${process.env.TEST_USER_DIR}`,
            user_name: `${process.env.TEST_USER_ID}`,
          },
        },
        tasks: [
          {
            name: "Update stream 1",
            description: "Append custom properties",
            operation: "stream.update",
            filter: `id eq ${process.env.TEST_STREAM_ID}`,
            details: {
              customProperties: ["RandomCustomProperty=value 2"],
            },
            options: {
              customPropertyOperation: "add",
            },
          },
        ],
      };

      const automatiqal = new Automatiqal(runbook, httpsAgentCert);
      const result = await automatiqal.run();
    } catch (e) {
      error = e.message;
    }

    expect(error).to.be.equal(expectedError);
  });

  it("Update with wrong custom property value", async function () {
    let expectedError =
      'customProperty.get: Choice value "random value" do not exists for custom property "TestCustomProperty"';
    let error = "";

    try {
      const runbook: IRunBook = {
        name: "Simple runbook",
        environment: {
          host: `${process.env.TEST_HOST}`,
          port: 4242,
          authentication: {
            user_dir: `${process.env.TEST_USER_DIR}`,
            user_name: `${process.env.TEST_USER_ID}`,
          },
        },
        tasks: [
          {
            name: "Update stream 1",
            description: "Append custom properties",
            operation: "stream.update",
            filter: `id eq ${process.env.TEST_STREAM_ID}`,
            details: {
              customProperties: ["TestCustomProperty=random value"],
            },
            options: {
              customPropertyOperation: "add",
            },
          },
        ],
      };

      const automatiqal = new Automatiqal(runbook, httpsAgentCert);
      const result = await automatiqal.run();
    } catch (e) {
      error = e.message;
    }

    expect(error).to.be.equal(expectedError);
  });
});
