/* eslint-disable @typescript-eslint/no-explicit-any */

export type SortOption = {
  field: string;
  direction: SortDirection;
};

export type SortDirection = "asc" | "desc" | "";

export type FilterType = "any" | "all" | "none";

export type FieldValue =
  | string
  | number
  | boolean
  | Array<string | number | boolean>;

export type FilterValueValue = FieldValue;

export type FilterValueRange = {
  from?: FieldValue;
  name: string;
  to?: FieldValue;
};

export type FilterValue = FilterValueValue | FilterValueRange;

export type FacetValue = {
  count: number;
  value: FilterValue;
  selected: boolean;
};

export type FacetType = "range" | "value";

export type Facet = {
  data: FacetValue[];
  field: string;
  type: FacetType;
};

export type Filter = {
  field: string;
  type: FilterType;
  values: FilterValue[];
};

export type RequestState = {
  current?: number;
  filters?: Filter[];
  resultsPerPage?: number;
  searchTerm?: string;
  sortDirection?: SortDirection;
  sortField?: string;
  sortList?: SortOption[];
};

export type SearchState = RequestState & {
  // Result State -- This state represents state that is updated automatically
  // as the result of changing input state.
  autocompletedResults: AutocompleteResult[];
  autocompletedResultsRequestId: string;
  autocompletedSuggestions: any;
  autocompletedSuggestionsRequestId: string;
  error: string;
  isLoading: boolean;
  facets: Record<string, any>;
  requestId: string;
  results: SearchResult[];
  resultSearchTerm: string;
  totalPages: number;
  totalResults: number;
  pagingStart: number;
  pagingEnd: number;
  wasSearched: false;
  rawResponse: any;
};

export type AutocompleteQuery = {
  results?;
  suggestions?;
};

// todo: types
export type SearchQuery = {
  filters?: any;
  conditionalFacets?: any;
  facets?: any;
  disjunctiveFacets?: any;
  disjunctiveFacetsAnalyticsTags?: any;
  result_fields?: any;
  search_fields?: any;
};

export type APIConnector = any;
export type QueryConfig = any;
export type SearchResult = any;
export type AutocompleteResult = any;
