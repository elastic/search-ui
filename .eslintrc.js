module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
    "prettier/react"
  ],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["react", "jest"],
  settings: {
    react: {
      version: "6.0"
    }
  },
  rules: {
    "no-console": ["error", { allow: ["warn", "error"] }]
  }
};
