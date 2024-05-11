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

const content = JSON.stringify(
  {
    commit,
    version: process.env.npm_package_version
  },
  null,
  2
);

const fqAppFilename = path.join(
  process.cwd(),
  "apps/island-explorer/src/data/version.json"
);

fs.writeFileSync(fqAppFilename, content);

const fqSwFilename = path.join(
  process.cwd(),
  "libs/service-worker/src/version.json"
);

fs.writeFileSync(fqSwFilename, content);
