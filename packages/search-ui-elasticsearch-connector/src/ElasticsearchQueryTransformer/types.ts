import type {
  QueryDslQueryContainer,
  SearchRequest,
  SearchHighlight,
  SearchResponseBody,
  QueryDslRangeQuery,
  AggregationsMultiBucketAggregateBase,
  AggregationsTermsAggregateBase,
  AggregationsAggregationContainer
} from "@elastic/elasticsearch/lib/api/types";

export type Filter = Pick<QueryDslQueryContainer, "bool">;
export type Sort = SearchRequest["sort"];

export type FilterValue = Pick<QueryDslQueryContainer, "term">;
export type FilterValueRange = Pick<QueryDslQueryContainer, "range">;

export type RequestBody = SearchRequest;
export type ResponseBody = SearchResponseBody<
  Record<string, unknown>,
  Record<string, unknown>
>;

export type Query = Pick<QueryDslQueryContainer, "bool">;
export type QueryRangeValue = QueryDslRangeQuery;

export type HighlightFields = Pick<SearchHighlight, "fields">;
export type Aggregation =
  | AggregationsTermsAggregateBase<{ key: string; doc_count: number }>
  | AggregationsMultiBucketAggregateBase<{ doc_count: number }>;
export type Aggregations = Record<string, AggregationsAggregationContainer>;
