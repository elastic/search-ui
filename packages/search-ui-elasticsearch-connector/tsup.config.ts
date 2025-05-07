import baseConfig from "../../tsup.config.ts";


export default {
  ...baseConfig,
  entry: ["src/index.ts", "src/api-proxy.ts"]
};
