import {
  FieldConfiguration,
  QueryConfig,
  RequestState
} from "@elastic/search-ui";
import {
  GeoDistanceOptionsFacet,
  MultiMatchQuery,
  MultiQueryOptionsFacet,
  RefinementSelectFacet,
  SearchkitConfig
} from "@searchkit/sdk";

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

function isValidDateString(dateString: unknown): boolean {
  return typeof dateString === "string" && !isNaN(Date.parse(dateString));
}

function buildConfiguration(
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

  const facets = Object.keys(queryConfig.facets || {}).reduce(
    (sum, facetKey) => {
      const facetConfiguration = queryConfig.facets[facetKey];
      const isDisJunctive = queryConfig.disjunctiveFacets?.includes(facetKey);
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
      } else if (
        facetConfiguration.type === "range" &&
        !facetConfiguration.center
      ) {
        sum.push(
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
        sum.push(
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

      return sum;
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

export default buildConfiguration;
