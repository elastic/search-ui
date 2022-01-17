import queryString from "qs";
import preserveTypesEncoder from "./preserveTypesEncoder";

export default {
  parse(string: string): Record<any, any> {
    return queryString.parse(string, {
      ignoreQueryPrefix: true,
      decoder: preserveTypesEncoder.decode,
      arrayLimit: 1000
    });
  },
  stringify(object: Record<any,any>): string {
    return queryString.stringify(object, {
      encoder: preserveTypesEncoder.encode
    });
  }
};
