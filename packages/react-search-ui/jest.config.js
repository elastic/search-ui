module.exports = {
  preset: "ts-jest/presets/js-with-ts-esm",
  testPathIgnorePatterns: ["./lib"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/__mocks__/styleMock.js"
  },
  snapshotSerializers: ["enzyme-to-json/serializer"]
};
