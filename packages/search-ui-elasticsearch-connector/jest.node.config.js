module.exports = {
  displayName: "node",
  testEnvironment: "node",
  preset: "ts-jest/presets/js-with-ts-esm",
  testMatch: ["**/__tests__/**/*.test.node.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};
