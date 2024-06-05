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
  autocompletedSuggestions: AutocompletedSuggestions;
  autocompletedSuggestionsRequestId: string;
};

export type AutocompletedSuggestions = Record<
  string,
  AutocompletedSuggestion[] | AutocompletedResultSuggestion[]
>;

export interface AutocompletedSuggestion {
  highlight?: string;
  suggestion?: string;
  data?: any;
  queryType?: "suggestion";
  index?: number;
}

export interface AutocompletedResultSuggestion {
  result: Record<string, FieldResult>;
  queryType: "results";
}

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
  raw?: any;
};

export type SuggestionConfiguration = {
  fields: string[];
  queryType?: "suggestions";
};

export type ResultSuggestionConfiguration = {
  result_fields?: Record<string, FieldConfiguration>;
  search_fields?: Record<string, SearchFieldConfiguration>;
  index?: string;
  queryType: "results";
};

export type SearchFieldConfiguration = {
  weight?: number;
};

// https://github.com/elastic/search-ui/blob/main/ADVANCED.md#configuring-autocomplete-queries
export type AutocompleteQueryConfig = {
  results?: QueryConfig;
  suggestions?: SuggestionsQueryConfig;
};

export type SuggestionsQueryConfig = {
  types?: Record<
    string,
    SuggestionConfiguration | ResultSuggestionConfiguration
  >;
  size?: number;
};

export type FacetConfiguration = {
  type: string;
  size?: number;
  ranges?: FilterValueRange[];
  center?: string;
  unit?: string;
  sort?: "count" | "value";
};

export type ConditionalRule = (state: { filters: Filter[] }) => boolean;

// todo: types
export type SearchQuery = {
  conditionalFacets?: Record<string, ConditionalRule>;
  filters?: Filter[];
  facets?: Record<string, FacetConfiguration>;
  disjunctiveFacets?: string[];
  disjunctiveFacetsAnalyticsTags?: string[];
  result_fields?: Record<string, FieldConfiguration>;
  search_fields?: Record<string, SearchFieldConfiguration>;
} & RequestState;

export type AutocompleteSearchQuery = {
  searchTerm: string;
};

export interface APIConnector {
  onSearch: (
    state: RequestState,
    queryConfig: QueryConfig
  ) => Promise<ResponseState>;
  onAutocomplete(
    state: RequestState,
    queryConfig: AutocompleteQueryConfig
  ): Promise<AutocompleteResponseState>;
  onResultClick(params): void;
  onAutocompleteResultClick(params): void;
  state?: any;
  actions?: any;
}

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
  sectionTitle?: string;
  queryType?: "suggestion";
};

export type AutocompleteResultSuggestionFragment = {
  sectionTitle?: string;
  queryType: "results";
  displayField: string;
};

export type AutocompleteSuggestion =
  | Record<
      string,
      AutocompleteSuggestionFragment | AutocompleteResultSuggestionFragment
    >
  | AutocompleteSuggestionFragment
  | AutocompleteResultSuggestionFragment;

export type FieldResult = {
  raw?: string | number | boolean;
  snippet?: string;
};

export type AutocompletedResult = any | Record<string, FieldResult>;

export type SearchContextState = SearchState & SearchDriverActions;

export interface BaseEvent {
  type: string;
  tags?: string[];
}

export interface SearchQueryEvent extends BaseEvent {
  type: "SearchQuery";
  filters: Filter[];
  query: string;
  totalResults: number;
  sort?: SortOption[];
  currentPage?: number;
  resultsPerPage?: number;
}

interface AutocompleteSuggestionSelectedEvent extends BaseEvent {
  type: "AutocompleteSuggestionSelected";
  query: string;
  suggestion: string;
  position: number;
}

export interface ResultSelectedEvent extends Omit<SearchQueryEvent, "type"> {
  type: "ResultSelected";
  documentId: string;
  position: number;
  origin: "autocomplete" | "results";
}

interface FacetFilterSelectedEvent extends BaseEvent {
  type: "FacetFilterSelected";
  query: string;
  field: string;
  value: string;
}

interface FacetFilterRemovedEvent extends BaseEvent {
  type: "FacetFilterRemoved";
  query: string;
  field: string;
  value: string;
}

export type Plugin = {
  subscribe: (event: Event) => void;
};

export type Event =
  | SearchQueryEvent
  | AutocompleteSuggestionSelectedEvent
  | ResultSelectedEvent
  | FacetFilterSelectedEvent
  | FacetFilterRemovedEvent;
