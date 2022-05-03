module.exports = {
  preset: "ts-jest/presets/js-with-ts-esm",
  testPathIgnorePatterns: ["./lib"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setupTests.js"]
};
