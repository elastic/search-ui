module.exports = {
  preset: "ts-jest/presets/js-with-ts-esm",
  testPathIgnorePatterns: ["./lib"],
  testEnvironment: "jsdom"
};
