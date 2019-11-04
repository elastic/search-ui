import queryString from "qs";
import preserveTypesEncoder from "./preserveTypesEncoder";

export default {
  parse(string) {
    return queryString.parse(string, {
      ignoreQueryPrefix: true,
      decoder: preserveTypesEncoder.decode,
      arrayLimit: 1000
    });
  },
  stringify(object) {
    return queryString.stringify(object, {
      encoder: preserveTypesEncoder.encode
    });
  }
};
