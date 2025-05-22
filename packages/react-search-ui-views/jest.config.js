module.exports = {
  testEnvironment: "jest-environment-jsdom",
  preset: "ts-jest/presets/js-with-ts-esm",
  testPathIgnorePatterns: ["./lib"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/__mocks__/styleMock.js"
  }
};
