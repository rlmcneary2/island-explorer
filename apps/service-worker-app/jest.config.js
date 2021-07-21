module.exports = {
  displayName: "service-worker-app",
  preset: "../../jest.preset.js",
  setupFilesAfterEnv: [],
  globals: {
    "ts-jest": { tsconfig: "<rootDir>/tsconfig.spec.json" }
  },
  transform: {
    "^.+\\.[tj]s$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/apps/service-worker-app"
};
