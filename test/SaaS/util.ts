import * as https from "https";
import * as fs from "fs";
import path from "path";
import dotenv from "dotenv";

const dotEnvPath = path.resolve(".env");
dotenv.config({ path: dotEnvPath });

const cert = fs.readFileSync(`${process.env.TEST_CERT}/client.pem`);
const key = fs.readFileSync(`${process.env.TEST_CERT}/client_key.pem`);

export const httpsAgentCert = new https.Agent({
  rejectUnauthorized: false,
  cert: cert,
  key: key,
});
