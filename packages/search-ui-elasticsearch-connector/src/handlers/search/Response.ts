import type { ResponseState } from "@elastic/search-ui";
import { ResponseBody } from "../../ElasticsearchQueryTransformer/types";
import { BaseQueryBuilder } from "../../queryBuilders/BaseQueryBuilder";
import { transformAggsToFacets } from "../../ElasticsearchQueryTransformer/FilterTransform";
import { transformHitToFieldResult } from "../../ElasticsearchQueryTransformer/utils";

export const transformResponse = (
  response: ResponseBody,
  queryBuilder: BaseQueryBuilder
): ResponseState => {
  const { totalHits, totalPages, pagingStart, pagingEnd } = getPagination(
    response,
    queryBuilder
  );
  const facets = transformFacets(response);

  return {
    resultSearchTerm: queryBuilder.getSearchTerm(),
    totalPages,
    pagingStart,
    pagingEnd,
    wasSearched: false,
    totalResults: totalHits,
    facets,
    results: response.hits.hits.map(transformHitToFieldResult),
    requestId: null,
    rawResponse: null
  };
};

const getPagination = (
  response: ResponseBody,
  queryBuilder: BaseQueryBuilder
) => {
  const size = queryBuilder.getSize();
  const from = queryBuilder.getFrom();
  const pageNumber = Math.floor(from / size);
  const pageEnd = (pageNumber + 1) * size;
  const totalHits =
    typeof response.hits.total === "number"
      ? response.hits.total
      : response.hits.total?.value;
  const totalPages = Math.ceil(totalHits / size);
  const pagingStart = totalHits && pageNumber * size + 1;
  const pagingEnd = pageEnd > totalHits ? totalHits : pageEnd;

  return { totalHits, totalPages, pagingStart, pagingEnd };
};

const transformFacets = (response: ResponseBody) => {
  return Object.entries(response.aggregations)
    .filter(([aggKey]) => aggKey.startsWith("facet_bucket_"))
    .flatMap(([, facetBucket]) =>
      Object.entries(facetBucket).filter(
        ([key]) => key !== "meta" && key !== "doc_count"
      )
    )
    .reduce((acc, [aggKey, aggValue]) => {
      return {
        ...acc,
        [aggKey]: [transformAggsToFacets(aggValue, aggKey)]
      };
    }, {});
};
