module.exports = {
  displayName: "browser",
  testPathIgnorePatterns: ["./lib"],
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};
