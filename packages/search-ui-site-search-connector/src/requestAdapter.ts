import {
  adaptFacetConfig,
  adaptFilterConfig,
  adaptResultFieldsConfig,
  adaptSearchFieldsConfig
} from "./requestAdapters";

import type { RequestState } from "@elastic/search-ui";
import type { SiteSearchQueryConfig } from "./types";

export default function adaptRequest(
  requestState: RequestState,
  queryConfig: SiteSearchQueryConfig,
  documentType: string
) {
  const { disjunctiveFacets, disjunctiveFacetsAnalyticsTags } = queryConfig;

  if (disjunctiveFacets) {
    console.warn(
      "search-ui-site-search-connector: disjunctiveFacets is not supported by Site Search"
    );
  }

  if (disjunctiveFacetsAnalyticsTags) {
    console.warn(
      "search-ui-site-search-connector: disjunctiveFacetsAnalyticsTags is not supported by Site Search"
    );
  }

  const updatedFacets = adaptFacetConfig(queryConfig.facets);
  const updatedFilters = adaptFilterConfig(
    queryConfig.filters !== undefined
      ? queryConfig.filters
      : requestState.filters
  );
  const page =
    queryConfig.current !== undefined
      ? queryConfig.current
      : requestState.current;
  const per_page =
    queryConfig.resultsPerPage !== undefined
      ? queryConfig.resultsPerPage
      : requestState.resultsPerPage;
  const sortDirection =
    queryConfig.sortDirection !== undefined
      ? queryConfig.sortDirection
      : requestState.sortDirection;
  const sortField =
    queryConfig.sortField !== undefined
      ? queryConfig.sortField
      : requestState.sortField;
  const sortList =
    queryConfig.sortList !== undefined
      ? queryConfig.sortList
      : requestState.sortList;
  const [fetchFields, highlightFields] = adaptResultFieldsConfig(
    queryConfig.result_fields
  );
  const updatedSearchFields = adaptSearchFieldsConfig(
    queryConfig.search_fields
  );
  const searchTerm = requestState.searchTerm;

  return {
    ...(per_page && { per_page }),
    ...(page && { page }),
    ...(sortDirection && {
      sort_direction: {
        [documentType]: sortDirection
      }
    }),
    ...(sortField && {
      sort_field: {
        [documentType]: sortField
      }
    }),
    ...(sortList && {
      sort_list: {
        [documentType]: sortList
      }
    }),
    ...(updatedFilters && {
      filters: {
        [documentType]: updatedFilters
      }
    }),
    ...(updatedFacets && {
      facets: {
        [documentType]: updatedFacets
      }
    }),
    ...(fetchFields && {
      fetch_fields: {
        [documentType]: fetchFields
      }
    }),
    ...(highlightFields && {
      highlight_fields: {
        [documentType]: highlightFields
      }
    }),
    ...(updatedSearchFields &&
      !!updatedSearchFields.length && {
        search_fields: {
          [documentType]: updatedSearchFields
        }
      }),
    q: searchTerm
  };
}
