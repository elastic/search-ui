import baseConfig from "../../tsup.config.ts";

export default {
  ...baseConfig,
  external: ["react", "react-dom"]
};
