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
  sortDirection?: SortDirection; // Deprecated
  sortField?: string; // Deprecated
  sortList?: SortOption[]; // Maybe deprecated? Not in docs
  sort?: SortOption[];
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

export type FieldConfiguration = {
  snippet?: {
    size?: number;
    fallback?: boolean;
  };
  raw?: any;
  fields?: string[];
};

// https://github.com/elastic/search-ui/blob/master/ADVANCED.md#configuring-autocomplete-queries
export type AutocompleteQuery = {
  results?: QueryConfig;
  suggestions?: SuggestionsQueryConfig;
};

export type SuggestionsQueryConfig = {
  types?: Record<string, FieldConfiguration>;
  size?: number;
};

export type FacetConfiguration = {
  type: string;
  size?: number;
  ranges?: FilterValueRange | FilterValueRange[];
  center?: string;
  unit?: string;
};

// todo: types
export type SearchQuery = {
  conditionalFacets?: any;
  filters?: Filter[];
  facets?: Record<string, FacetConfiguration>;
  disjunctiveFacets?: string[];
  disjunctiveFacetsAnalyticsTags?: string[];
  result_fields?: Record<string, FieldConfiguration>;
  search_fields?: Record<string, FieldConfiguration>;
};

export type APIConnector = any;

// From https://github.com/elastic/search-ui/blob/9db35e1a49d95f854b77172f7ccfe540b22a793d/ADVANCED.md#query-config
export type QueryConfig = RequestState & SearchQuery;

export type SearchResult = Record<
  string,
  {
    raw: string | number | boolean;
    snippet: string | number | boolean;
  }
>;
export type AutocompleteResult = any;
