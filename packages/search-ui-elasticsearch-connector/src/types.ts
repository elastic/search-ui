import type { estypes } from "@elastic/elasticsearch";
import { QueryConfig, RequestState } from "@elastic/search-ui";

export type SearchRequest = estypes.SearchRequest;
export type ResponseBody = estypes.SearchResponseBody<
  Record<string, unknown>,
  Record<string, unknown>
>;
export type SearchSourceFilter = estypes.SearchSourceFilter;
export type SearchHit = estypes.SearchHit<Record<string, unknown>>;
export type Filter = Pick<estypes.QueryDslQueryContainer, "bool">;
export type FilterValue = Pick<estypes.QueryDslQueryContainer, "term">;
export type FilterValueRange = Pick<estypes.QueryDslQueryContainer, "range">;
export type QueryRangeValue = estypes.QueryDslRangeQuery;
export type Aggregation =
  | estypes.AggregationsTermsAggregateBase<{ key: string; doc_count: number }>
  | estypes.AggregationsMultiBucketAggregateBase<{ doc_count: number }>;

export type PostProcessRequestBodyFn = (
  requestBody: SearchRequest,
  requestState: RequestState,
  queryConfig: QueryConfig
) => SearchRequest;

export interface CloudHost {
  id: string;
}

export type ConnectionOptions = {
  host?: string;
  cloud?: CloudHost;
  index: string;
  apiKey?: string;
  connectionOptions?: {
    headers?: Record<string, string>;
  };
};
