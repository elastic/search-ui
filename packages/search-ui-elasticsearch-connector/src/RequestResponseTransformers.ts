import {
  FieldConfiguration,
  QueryConfig,
  RequestState
} from "@elastic/search-ui";
import {
  MultiMatchQuery,
  RefinementSelectFacet,
  SearchkitConfig
} from "@searchkit/sdk";
import { MixedFilter } from "@searchkit/sdk/lib/cjs/core/QueryManager";

export function getResultFields(
  resultFields: Record<string, FieldConfiguration>
): {
  hitFields: string[];
  highlightFields: string[];
} {
  const hitFields = Object.keys(resultFields).reduce((sum, fieldKey) => {
    const fieldConfiguration = resultFields[fieldKey];
    if (fieldConfiguration.raw) {
      sum.push(fieldKey);
    }
    return sum;
  }, []);

  const highlightFields = Object.keys(resultFields).reduce((sum, fieldKey) => {
    const fieldConfiguration = resultFields[fieldKey];
    if (fieldConfiguration.snippet) {
      sum.push(fieldKey);
    }
    return sum;
  }, []);

  return { hitFields, highlightFields };
}

export function getSKFilters(state: RequestState): MixedFilter[] {
  return state.filters.reduce((acc, f) => {
    const subFilters = f.values.map((v) => ({
      identifier: f.field,
      value: v
    }));

    return [...acc, ...subFilters];
  }, []);
}

export function buildSKConfiguration(
  state: RequestState,
  queryConfig: QueryConfig,
  host: string,
  index: string,
  apiKey: string,
  queryFields: string[]
): SearchkitConfig {
  const { hitFields, highlightFields } = getResultFields(
    queryConfig.result_fields
  );

  const facets = Object.keys(queryConfig.facets).reduce((sum, facetKey) => {
    const facetConfiguration = queryConfig.facets[facetKey];
    const isDisJunctive = queryConfig.disjunctiveFacets.includes(facetKey);
    if (facetConfiguration.type === "value") {
      sum.push(
        new RefinementSelectFacet({
          identifier: facetKey,
          field: facetKey,
          label: facetKey,
          size: facetConfiguration.size || 20,
          multipleSelect: isDisJunctive
        })
      );
    }
    return sum;
  }, []);

  const sortOption =
    state.sortList.length > 0
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
  const configuration: SearchkitConfig = {
    host: host,
    index: index,
    connectionOptions: {
      apiKey: apiKey
    },
    hits: {
      fields: hitFields,
      highlightedFields: highlightFields
    },
    query: new MultiMatchQuery({
      fields: queryFields
    }),
    sortOptions: [sortOption],
    facets
  };

  return configuration;
}
