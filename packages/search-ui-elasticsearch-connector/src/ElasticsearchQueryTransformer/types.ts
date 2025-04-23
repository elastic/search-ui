import type {
  QueryDslQueryContainer,
  SearchRequest,
  SearchHighlight
} from "@elastic/elasticsearch/lib/api/types";

export type Filter = Pick<QueryDslQueryContainer, "bool">;
export type Sort = SearchRequest["sort"];

export type FilterValue = Pick<QueryDslQueryContainer, "term">;
export type FilterValueRange = Pick<QueryDslQueryContainer, "range">;

export type RequestBody = SearchRequest;

export type Query = Pick<QueryDslQueryContainer, "bool">;

export type HighlightFields = Pick<SearchHighlight, "fields">;
export type Aggregations = Record<string, any>;
