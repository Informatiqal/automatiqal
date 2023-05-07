import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonJS from "@rollup/plugin-commonjs";
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
  external: ["events"],
  plugins: [
    del({
      targets: "dist/*",
    }),
    commonJS(),
    resolve(),
    json(),
    typescript(),
  ],
};
