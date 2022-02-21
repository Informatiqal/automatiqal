```
NOT AFFILIATED WITH QLIK
```

# Automatiqal

`Automatiqal` is a `NodeJS` package that helps automating the interactions with `Qlik Repository API`.

`Automatiqal` accepts formatted JSON objects as an input (more on it below) and process the described automation tasks.

---

## For detailed documentation please check out the [Wiki section](https://github.com/Informatiqal/automatiqal/wiki)

---

## How to use

First install from `npm`

> `npm install --save automatiqal`

The following code demonstrates what a simple runbook looks like (certificate authentication)

The runbook will perform the following actions:

- import qvf file
- create new tag (if the tag already exists the code will ignore the error)
- apply the new tag to the imported app

```javascript
import { Automatiqal } from "automatiqal";
import * as https from "https";
import * as fs from "fs";

// read the certificates
const cert = fs.readFileSync(`path/to/client.pem`);
const key = fs.readFileSync(`path/to/client_key.pem`);

// create https agent, include the certificates
// and ignore any cert errors (like self-signed certificates)
const httpsAgentCert = new https.Agent({
  rejectUnauthorized: false,
  cert: cert,
  key: key,
});

// read the qvf file
const qvf = fs.readFileSync(`path/to/some.qvf`);

// define the runbook
const runBookConfig: IRunBook = {
  name: "My Runbook",
  description: "Example Automatiqal runbook with multiple tasks",
  edition: "windows",
  environment: {
    port: 4242,
    host: `qlik-host.com`,
    authentication: {
      user_dir: `USER_DIR`,
      user_name: `userId`,
    },
  },
  tasks: [
    {
      name: "Import application",
      operation: "app.upload",
      details: {
        name: "Automatiqal",
        file: qvf,
      },
    },
    {
      name: "Create tag",
      operation: "tag.create",
      details: {
        name: "Automatiqal",
      },
      onError: {
        ignore: true,
      },
    },
    {
      name: "Tag application",
      operation: "app.update",
      filter: "name eq 'Automatiqal'",
      details: {
        tags: ["Automatiqal"],
      },
    },
  ],
};

const automatiqal = new Automatiqal(runBookConfig, httpsAgentCert);
const result = await automatiqal.run();
```

## Projects based on Automatiqal

`Automatiqal` can be used by itself and imported in any app/package via `npm`. But there are couple products, from `Automatiqal` "family" where this package is used:

- [Automatiqal CLI](https://github.com/Informatiqal/automatiqal-cli) - describe the automation tasks in json/yaml file and the CLI will run the process
- [Automatiqal Runner](https://github.com/Informatiqal/automatiqal-runner) (WIP) - long running process that is constantly monitoring specific folder and as soon as new (runbook) file appears there it will start processing it.
