import type { estypes } from "@elastic/elasticsearch";

export type RequestBody = estypes.SearchRequest;
export type PostProcessRequestBodyFn = (
  requestBody: RequestBody
) => RequestBody;
