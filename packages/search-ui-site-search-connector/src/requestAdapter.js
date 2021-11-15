import {
  adaptFacetConfig,
  adaptFilterConfig,
  adaptResultFieldsConfig,
  adaptSearchFieldsConfig
} from "./requestAdapters";

export default function adaptRequest(request, queryConfig, documentType) {
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
    queryConfig.filters !== undefined ? queryConfig.filters : request.filters
  );
  const page =
    queryConfig.current !== undefined ? queryConfig.current : request.current;
  const per_page =
    queryConfig.resultsPerPage !== undefined
      ? queryConfig.resultsPerPage
      : request.resultsPerPage;
  const sortDirection =
    queryConfig.sortDirection !== undefined
      ? queryConfig.sortDirection
      : request.sortDirection;
  const sortField =
    queryConfig.sortField !== undefined
      ? queryConfig.sortField
      : request.sortField;
  const sortList =
    queryConfig.sortList !== undefined
      ? queryConfig.sortList
      : request.sortList;
  const [fetchFields, highlightFields] = adaptResultFieldsConfig(
    queryConfig.result_fields
  );
  const updatedSearchFields = adaptSearchFieldsConfig(
    queryConfig.search_fields
  );
  const searchTerm = request.searchTerm;

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
