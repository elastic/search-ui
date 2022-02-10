module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["@typescript-eslint", "jest"],
  parser: "@typescript-eslint/parser",
  settings: {
    react: {
      version: "detect"
    },
    jest: {
      version: "27"
    }
  },
  rules: {
    "no-console": ["error", { allow: ["warn", "error"] }],
    "prefer-rest-params": "off"
  }
};
