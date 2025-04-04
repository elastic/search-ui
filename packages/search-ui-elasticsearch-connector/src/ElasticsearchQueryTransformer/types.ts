import type {
  QueryDslQueryContainer,
  SearchRequest
} from "@elastic/elasticsearch/lib/api/types";

export type BaseFilter = Pick<QueryDslQueryContainer, "bool">;
export type Sort = SearchRequest["sort"];

export type BaseFilterValue = Pick<QueryDslQueryContainer, "term">;
export type BaseFilterValueRange = Pick<QueryDslQueryContainer, "range">;
