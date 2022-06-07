import type { estypes } from "@elastic/elasticsearch";

export type SearchRequest = estypes.SearchRequest;
export type PostProcessRequestBodyFn = (
  requestBody: SearchRequest
) => SearchRequest;
