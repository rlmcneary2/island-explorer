const { getJestProjects } = require("@nrwl/jest");

module.exports = {
  projects: [...getJestProjects(), "<rootDir>/apps/service-worker-app"]
};
