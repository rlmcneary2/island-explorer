module.exports = {
  displayName: "service-worker",
  preset: "../../jest.preset.js",
  globals: {
    "ts-jest": { tsconfig: "<rootDir>/tsconfig.spec.json" }
  },
  transform: {
    "^.+\\.[tj]sx?$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/libs/service-worker",
  testEnvironment: "node"
};
