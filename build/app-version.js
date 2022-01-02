const fs = require("fs");
const path = require("path");
const process = require("process");

/*
 * Read current build and repo information to be included in the application at
 * build time. It is written to the `version.json` file.
 */

const commit = require("child_process")
  .execSync("git rev-parse --short HEAD")
  .toString()
  .trim();

const fqFilename = path.join(
  process.cwd(),
  "apps/island-explorer/src/assets/version.json"
);

const content = {
  commit,
  version: process.env.npm_package_version
};

fs.writeFileSync(fqFilename, JSON.stringify(content, null, 2));
