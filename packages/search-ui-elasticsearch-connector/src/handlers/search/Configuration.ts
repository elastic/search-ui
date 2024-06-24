import type {
  FieldConfiguration,
  Filter,
  FilterValue,
  FilterValueRange,
  QueryConfig,
  RequestState,
  SearchFieldConfiguration
} from "@elastic/search-ui";
import {
  BaseFilter,
  BaseFilters,
  Filter as SKFilter,
  GeoDistanceOptionsFacet,
  MultiMatchQuery,
  MultiQueryOptionsFacet,
  RefinementSelectFacet,
  SearchkitConfig
} from "@searchkit/sdk";
import type {
  CloudHost,
  PostProcessRequestBodyFn,
  SearchRequest
} from "../../types";
import { LIB_VERSION } from "../../version";

export function getResultFields(
  resultFields: Record<string, FieldConfiguration>
): {
  hitFields: string[];
  highlightFields: string[];
} {
  const hitFields = Object.keys(resultFields);

  const highlightFields = Object.keys(resultFields).reduce((acc, fieldKey) => {
    const fieldConfiguration = resultFields[fieldKey];
    if (fieldConfiguration.snippet) {
      acc.push(fieldKey);
    }
    return acc;
  }, []);

  return { hitFields, highlightFields };
}

export function getQueryFields(
  searchFields: Record<string, SearchFieldConfiguration> = {}
): string[] {
  return Object.keys(searchFields).map((fieldKey) => {
    const fieldConfiguration = searchFields[fieldKey];
    const weight = `^${fieldConfiguration.weight || 1}`;
    return fieldKey + weight;
  });
}

// A naive regex to match elastic date math expressions. Note is can match on invalid start dates like 2020-99-99T99:00:00||+1y/d
const elasticRelativeDateRegex =
  /^(?:now|\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)?\|\|)(?:[+-]\d[yMwdhHms])?(?:\/[yMwdhHms])?$/;

export function isDateMathString(dateString: string): boolean {
  if (dateString.match(elasticRelativeDateRegex)) {
    return true;
  }

  return false;
}

export function isValidDateString(dateString: unknown): boolean {
  return (
    typeof dateString === "string" &&
    (isDateMathString(dateString) || !isNaN(Date.parse(dateString)))
  );
  // return typeof dateString === "string" && !isNaN(Date.parse(dateString));
}

export function isRangeFilter(
  filterValue: FilterValue
): filterValue is FilterValueRange {
  return (
    typeof filterValue === "object" &&
    ("from" in filterValue || "to" in filterValue)
  );
}

export function buildBaseFilters(baseFilters: Filter[]): BaseFilters {
  const filters = (baseFilters || []).reduce((acc, filter) => {
    const boolType = {
      all: "filter",
      any: "should",
      none: "must_not"
    }[filter.type];
    return [
      ...acc,
      {
        bool: {
          [boolType]: filter.values.map((value: FilterValue) => {
            if (isRangeFilter(value)) {
              return {
                range: {
                  [filter.field]: {
                    ...("from" in value
                      ? {
                          from: isValidDateString(value.from)
                            ? value.from
                            : Number(value.from)
                        }
                      : {}),
                    ...("to" in value
                      ? {
                          to: isValidDateString(value.to)
                            ? value.to
                            : Number(value.to)
                        }
                      : {})
                  }
                }
              };
            }
            return {
              term: {
                [filter.field]: value
              }
            };
          })
        }
      }
    ];
  }, []);

  return filters;
}

interface BuildConfigurationOptions {
  state: RequestState;
  queryConfig: QueryConfig;
  cloud?: CloudHost;
  host?: string;
  index: string;
  apiKey?: string;
  headers?: Record<string, string>;
  postProcessRequestBodyFn?: PostProcessRequestBodyFn;
}

function buildConfiguration({
  state,
  queryConfig,
  cloud,
  host,
  index,
  apiKey,
  headers,
  postProcessRequestBodyFn
}: BuildConfigurationOptions): SearchkitConfig {
  const { hitFields, highlightFields } = getResultFields(
    queryConfig.result_fields
  );

  const queryFields = getQueryFields(queryConfig.search_fields);

  const filtersConfig: BaseFilter[] = Object.values(
    (state.filters || [])
      .filter((f) => !queryConfig.facets[f.field]) //exclude all filters that are defined as facets
      .reduce((acc, f) => {
        return {
          ...acc,
          [f.field]: new SKFilter({
            field: f.field,
            identifier: f.field,
            label: f.field
          })
        };
      }, {})
  );

  const facets = Object.keys(queryConfig.facets || {}).reduce(
    (acc, facetKey) => {
      const facetConfiguration = queryConfig.facets[facetKey];
      const isDisJunctive = queryConfig.disjunctiveFacets?.includes(facetKey);
      if (facetConfiguration.type === "value") {
        acc.push(
          new RefinementSelectFacet({
            identifier: facetKey,
            field: facetKey,
            label: facetKey,
            size: facetConfiguration.size || 20,
            multipleSelect: isDisJunctive,
            order: facetConfiguration.sort || "count"
          })
        );
      } else if (
        facetConfiguration.type === "range" &&
        !facetConfiguration.center
      ) {
        acc.push(
          new MultiQueryOptionsFacet({
            identifier: facetKey,
            field: facetKey,
            label: facetKey,
            multipleSelect: isDisJunctive,
            options: facetConfiguration.ranges.map((range) => {
              return {
                label: range.name,
                ...(typeof range.from === "number" ? { min: range.from } : {}),
                ...(typeof range.to === "number" ? { max: range.to } : {}),
                ...(isValidDateString(range.from)
                  ? { dateMin: range.from.toString() }
                  : {}),
                ...(isValidDateString(range.to)
                  ? { dateMax: range.to.toString() }
                  : {})
              };
            })
          })
        );
      } else if (
        facetConfiguration.type === "range" &&
        facetConfiguration.center
      ) {
        acc.push(
          new GeoDistanceOptionsFacet({
            identifier: facetKey,
            field: facetKey,
            label: facetKey,
            multipleSelect: isDisJunctive,
            origin: facetConfiguration.center,
            unit: facetConfiguration.unit,
            ranges: facetConfiguration.ranges.map((range) => {
              return {
                label: range.name,
                ...(range.from ? { from: Number(range.from) } : {}),
                ...(range.to ? { to: Number(range.to) } : {})
              };
            })
          })
        );
      }

      return acc;
    },
    []
  );

  const sortOption =
    state.sortList?.length > 0
      ? {
          id: "selectedOption",
          label: "selectedOption",
          field: state.sortList.reduce((acc, s) => {
            acc.push({
              [s.field]: s.direction
            });
            return acc;
          }, [])
        }
      : { id: "selectedOption", label: "selectedOption", field: "_score" };

  const jsVersion = typeof window !== "undefined" ? "browser" : process.version;
  const metaHeader = `ent=${LIB_VERSION}-es-connector,js=${jsVersion},t=${LIB_VERSION}-es-connector,ft=universal`;

  const wrappedPostProcessRequestFn = postProcessRequestBodyFn
    ? (body: SearchRequest) => {
        return postProcessRequestBodyFn(body, state, queryConfig);
      }
    : null;

  const additionalHeaders = headers || {};
  const configuration: SearchkitConfig = {
    host: host,
    cloud: cloud,
    index: index,
    connectionOptions: {
      apiKey: apiKey,
      headers: {
        ...additionalHeaders,
        "x-elastic-client-meta": metaHeader
      }
    },
    hits: {
      fields: hitFields,
      highlightedFields: highlightFields
    },
    query: new MultiMatchQuery({
      fields: queryFields
    }),
    sortOptions: [sortOption],
    facets,
    filters: filtersConfig,
    postProcessRequest: wrappedPostProcessRequestFn
  };

  return configuration;
}

export default buildConfiguration;
