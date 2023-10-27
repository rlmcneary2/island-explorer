/* eslint-disable */
export default {
  preset: "../../jest.preset.js",
  transform: {
    "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "@nrwl/react/plugins/jest",
    "^.+\\.[tj]sx?$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "html"],
  coverageDirectory: "../../coverage/apps/island-explorer",
  globals: { "ts-jest": { tsconfig: "<rootDir>/tsconfig.spec.json" } },
  displayName: "island-explorer"
};
