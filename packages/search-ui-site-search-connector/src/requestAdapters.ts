import type { FieldConfiguration } from "@elastic/search-ui";
import { helpers } from "@elastic/search-ui";
import type { Filter, FacetConfiguration } from "@elastic/search-ui";

function adaptFilterType(type: string) {
  if (type === "any") return {};
  if (type === "all") return { type: "and" };
  return { type: "and" };
}

export function adaptFacetConfig(facets: Record<string, FacetConfiguration>) {
  if (!facets) return;

  const convertInvalidFacetsToUndefined = ([fieldName, config]: [
    string,
    FacetConfiguration
  ]): [string, FacetConfiguration] | undefined => {
    if (config.type != "value") {
      console.warn(
        `search-ui-site-search-connector: Dropping ${fieldName} facet, only value facets are supported in Site Search`
      );
      return undefined;
    }
    if ((config as any).sort) {
      console.warn(
        "search-ui-site-search-connector: Site Search does not support 'sort' on facets"
      );
    }
    if (config.size) {
      console.warn(
        "search-ui-site-search-connector: Site Search does not support 'size' on facets"
      );
    }
    return [fieldName, config];
  };

  const config = Object.entries(facets)
    .map(convertInvalidFacetsToUndefined)
    .filter((v) => v) // filter out undefined
    .map(([key]) => key); // get keys

  if (!config.length) return;
  return config;
}

export function adaptFilterConfig(filters: Filter[]) {
  if (!filters || Object.keys(filters).length === 0) return;

  return filters.reduce((acc, filter) => {
    const fieldName = filter.field;
    const fieldValue = filter.values;

    if (acc[fieldName]) {
      console.warn(
        "search-ui-site-search-connector: More than one filter found for a single field"
      );
      return acc;
    }

    if (filter.type && filter.type !== "all" && filter.type !== "any") {
      console.warn(
        `search-ui-site-search-connector: Unsupported filter type "${filter.type}" found, only "all" and "any" are currently supported`
      );
      return acc;
    }

    if (fieldValue.find((v) => typeof v === "object") !== undefined) {
      if (fieldValue.length > 1) {
        console.warn(
          "search-ui-site-search-connector: Cannot apply more than 1 none-value filters to a single field"
        );
        return acc;
      }

      const firstValue = fieldValue[0];
      if (helpers.isFilterValueRange(firstValue)) {
        // eslint-disable-next-line
        const { name, ...rest } = firstValue;
        acc[fieldName] = {
          type: "range",
          ...rest
        };
        return acc;
      } else {
        return acc;
      }
    }

    acc[fieldName] = {
      ...adaptFilterType(filter.type),
      values: fieldValue
    };

    return acc;
  }, {});
}

export function adaptResultFieldsConfig(
  resultFieldsConfig: Record<string, FieldConfiguration>
): [string[]?, Record<string, { size?: number; fallback?: boolean }>?] {
  if (!resultFieldsConfig) return [];

  const fetchFields = Object.keys(resultFieldsConfig);

  const highlightFields = Object.entries(resultFieldsConfig).reduce(
    (acc, [fieldName, fieldConfig]) => {
      if (!fieldConfig.snippet) return acc;
      return {
        ...acc,
        [fieldName]: fieldConfig.snippet
      };
    },
    {}
  );

  return [fetchFields, highlightFields];
}

export function adaptSearchFieldsConfig(
  searchFieldsConfig: Record<string, string[]>
) {
  if (!searchFieldsConfig) return [];

  return Object.keys(searchFieldsConfig);
}
