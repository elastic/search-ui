import type { ResponseState } from "@elastic/search-ui";
import { ResponseBody } from "../../ElasticsearchQueryTransformer/types";
import { QueryManager } from "../../ElasticsearchQueryTransformer/QueryManager";
import { transformAggsToFacets } from "../../ElasticsearchQueryTransformer/FilterTransform";

export const transformResponse = (
  response: ResponseBody,
  queryManager: QueryManager
): ResponseState => {
  const size = queryManager.getSize();
  const from = queryManager.getFrom();
  const pageNumber = Math.floor(from / size);
  const pageEnd = (pageNumber + 1) * size;
  const totalHits =
    typeof response.hits.total === "number"
      ? response.hits.total
      : response.hits.total?.value;
  const totalPages = Math.ceil(totalHits / size);
  const facets = Object.entries(response.aggregations)
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

  return {
    resultSearchTerm: queryManager.getSearchTerm(),
    totalPages,
    pagingStart: totalHits && pageNumber * size + 1,
    pagingEnd: pageEnd > totalHits ? totalHits : pageEnd,
    wasSearched: false,
    totalResults: totalHits,
    facets,
    results: response.hits.hits.map(({ _id, _source, highlight = {} }) => {
      const keys = new Set([
        ...Object.keys(_source),
        ...Object.keys(highlight)
      ]);

      const result = {
        id: { raw: _id },
        _meta: {
          id: _id,
          rawHit: { _id, _source, highlight }
        }
      };

      for (const key of keys) {
        result[key] = {
          ...(key in _source && { raw: _source[key] }),
          ...(key in highlight && { snippet: highlight[key] })
        };
      }

      return result;
    }),
    requestId: null,
    rawResponse: null
  };
};
