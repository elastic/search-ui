module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: ["plugin:react/recommended", "prettier", "prettier/react"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["react"],
  settings: {
    react: {
      version: "6.0"
    }
  }
};
