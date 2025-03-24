import * as SearchkitSDK from "@searchkit/sdk";

export default typeof SearchkitSDK.default === "object"
  ? (SearchkitSDK.default as unknown as typeof SearchkitSDK)
  : (SearchkitSDK as typeof SearchkitSDK);
