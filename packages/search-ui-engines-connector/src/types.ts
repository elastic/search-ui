import type { estypes } from "@elastic/elasticsearch";

export type SearchRequest = estypes.SearchRequest;
export type SearchResponse = estypes.SearchResponse<Record<string, unknown>>;
