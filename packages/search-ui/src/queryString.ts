import queryString from "qs";
import preserveTypesEncoder from "./preserveTypesEncoder";

export default {
  parse(string: string | Record<string, string>): Record<string, unknown> {
    return queryString.parse(string, {
      ignoreQueryPrefix: true,
      decoder: preserveTypesEncoder.decode,
      arrayLimit: 1000
    });
  },
  stringify(object: Record<string, unknown>): string {
    return queryString.stringify(object, {
      encoder: preserveTypesEncoder.encode
    });
  }
};
