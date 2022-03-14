/* eslint-disable @typescript-eslint/no-explicit-any */

import { SearchDriverActions } from "..";

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
  selected?: boolean;
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

export type SearchState = RequestState &
  ResponseState &
  AutocompleteResponseState & {
    // Result State -- This state represents state that is updated automatically
    // as the result of changing input state.
    error: string;
    isLoading: boolean;
  };

export type AutocompleteResponseState = {
  autocompletedResults: AutocompletedResult[];
  autocompletedResultsRequestId: string;
  autocompletedSuggestions: any;
  autocompletedSuggestionsRequestId: string;
};

export type ResponseState = {
  requestId: string;
  facets: Record<string, any>;
  resultSearchTerm: string;
  totalPages: number;
  totalResults: number;
  pagingStart: number;
  pagingEnd: number;
  wasSearched: boolean;
  results: SearchResult[];
  rawResponse: any;
};

export type FieldConfiguration = {
  snippet?: {
    size?: number;
    fallback?: boolean;
  };
  fields?: string[];
  raw?: any;
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
  ranges?: FilterValueRange[];
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

export type ResultEntry = {
  raw?: string | number | boolean;
  snippet?: string | number | boolean;
};

// "any" type escape hatch due to arbitrary values may not follow the ResultEntry shape
export type SearchResult = Record<string, ResultEntry | any>;

// used for configuration
export type AutocompleteResult = {
  titleField: string;
  urlField: string;
  linkTarget?: string;
  sectionTitle?: string;
  shouldTrackClickThrough?: boolean;
  clickThroughTags?: string[];
};

export type AutocompleteSuggestionFragment = {
  sectionTitle: string;
};

export type AutocompleteSuggestion =
  | Record<string, AutocompleteSuggestionFragment>
  | AutocompleteSuggestionFragment;

export type FieldResult = {
  raw?: string | number | boolean;
  snippet?: string;
};

export type AutocompletedResult = any | Record<string, FieldResult>;

export type AutocompletedSuggestion = Record<
  string,
  {
    highlight?: string;
    suggestion?: string;
    data?: any;
  }[]
>;

export type SearchContextState = SearchState & SearchDriverActions;
