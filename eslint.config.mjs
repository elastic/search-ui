import js from "@eslint/js";
import { includeIgnoreFile } from "@eslint/compat";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";
import jest from "eslint-plugin-jest";
import prettier from "eslint-config-prettier";
import globals from "globals";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default [
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // files: ["packages/*/**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      // sourceType: "commonjs",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.commonjs
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    plugins: {
      jest
    },
    settings: {
      jest: {
        version: 29
      }
    },
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-unused-expressions": "off",
      "prefer-rest-params": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.commonjs
      }
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  },
  {
    files: [
      "**/*.test.{js,ts,jsx,tsx}",
      "**/__tests__/**/*.{js,ts,jsx,tsx}",
      "**/test/**/*.{js,ts,jsx,tsx}"
    ],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      ...jest.configs.recommended.rules
    }
  },
  prettier
];
