import type {
  FieldResult,
  ResponseState,
  AutocompletedResult,
  Facet,
  QueryConfig,
  FacetConfiguration
} from "@elastic/search-ui";
import { BaseQueryBuilder } from "../queryBuilders/BaseQueryBuilder";
import type { Aggregation, SearchHit, ResponseBody } from "../types";

export const transformSearchResponse = (
  response: ResponseBody,
  queryBuilder: BaseQueryBuilder,
  queryConfig: QueryConfig
): ResponseState => {
  const { totalResults, totalPages, pagingStart, pagingEnd } = getPagination(
    response,
    queryBuilder
  );
  const facets = transformToFacets(response, queryConfig);

  return {
    resultSearchTerm: queryBuilder.getSearchTerm(),
    totalPages,
    pagingStart,
    pagingEnd,
    wasSearched: false,
    totalResults,
    facets,
    results: response.hits.hits.map(transformHitToFieldResult),
    requestId: "",
    rawResponse: null
  };
};

export const transformHitToFieldResult = (
  hit: SearchHit
): Record<string, FieldResult> => {
  const { _id, _source = {}, highlight = {} } = hit;
  const keys = new Set([...Object.keys(_source), ...Object.keys(highlight)]);

  const result: AutocompletedResult = {
    id: { raw: _id },
    _meta: {
      id: _id,
      rawHit: hit
    }
  };

  for (const key of keys) {
    result[key] = {
      ...(key in _source && { raw: _source[key] }),
      ...(key in highlight && { snippet: highlight[key] })
    };
  }

  return result;
};

const getPagination = (
  response: ResponseBody,
  queryBuilder: BaseQueryBuilder
): Pick<
  ResponseState,
  "totalResults" | "totalPages" | "pagingStart" | "pagingEnd"
> => {
  const size = queryBuilder.getSize();
  const from = queryBuilder.getFrom();
  const pageNumber = Math.floor(from / size);
  const pageEnd = (pageNumber + 1) * size;
  const totalResults =
    typeof response.hits.total === "object"
      ? response.hits.total.value
      : response.hits.total || 0;
  const totalPages = Math.ceil(totalResults / size);
  const pagingStart = totalResults && pageNumber * size + 1;
  const pagingEnd = pageEnd > totalResults ? totalResults : pageEnd;

  return { totalResults, totalPages, pagingStart, pagingEnd };
};

const transformToFacets = (
  response: ResponseBody,
  queryConfig: QueryConfig
): ResponseState["facets"] => {
  return Object.entries(response.aggregations || {})
    .filter(([aggKey]) => aggKey.startsWith("facet_bucket_"))
    .flatMap(([, facetBucket]) =>
      Object.entries(facetBucket || {}).filter(
        ([key]) => key !== "meta" && key !== "doc_count"
      )
    )
    .reduce((acc, [aggKey, aggValue]) => {
      if (!queryConfig.facets?.[aggKey]) {
        return acc;
      }

      return {
        ...acc,
        [aggKey]: [
          transformAggToFacet(aggValue, aggKey, queryConfig.facets?.[aggKey])
        ]
      };
    }, {});
};

const transformAggToFacet = (
  agg: Aggregation,
  field: string,
  facet: FacetConfiguration
): Facet => {
  const buildRangeValue = (name: string) => ({
    name,
    ...(facet.ranges?.find((range) => range.name === name) || {})
  });

  const data = Array.isArray(agg.buckets)
    ? agg.buckets.map((entry) => ({
        value:
          facet.type === "range"
            ? buildRangeValue((entry as { key: string }).key)
            : (entry as { key: string }).key,
        count: entry.doc_count || 0
      }))
    : Object.entries(agg.buckets).map(([name, bucket]) => ({
        value: facet.type === "range" ? buildRangeValue(name) : name,
        count: bucket.doc_count || 0
      }));

  return {
    field,
    data,
    type: "value"
  };
};
