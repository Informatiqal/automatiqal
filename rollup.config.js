import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import del from "rollup-plugin-delete";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json"));

export default {
  input: "src/index.ts",
  output: [
    {
      sourcemap: true,
      file: pkg.main,
      format: "es",
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    del({
      targets: "dist/*",
    }),
    json(),
    typescript(),
  ],
};
