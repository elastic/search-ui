import {
  adaptFacetConfig,
  adaptFilterConfig,
  adaptResultFieldsConfig,
  adaptSearchFieldsConfig
} from "./requestAdapters";

export default function adaptRequest(request, queryConfig, documentType) {
  const updatedFacets = adaptFacetConfig(queryConfig.facets);
  const updatedFilters = adaptFilterConfig(request.filters);
  const page = request.current;
  const per_page = request.resultsPerPage;
  const sortDirection = request.sortDirection;
  const sortField = request.sortField;
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
