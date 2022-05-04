import URLManager from "./URLManager";

import RequestSequencer from "./RequestSequencer";
import DebounceManager from "./DebounceManager";

import * as actions from "./actions";
import Events from "./Events";
import { mergeFilters } from "./helpers";
import {
  AutocompleteResponseState,
  AutocompleteSearchQuery,
  INVALID_CREDENTIALS,
  QueryConfig,
  ResponseState
} from ".";

import * as a11y from "./A11yNotifications";
import {
  AutocompleteQueryConfig,
  SearchState,
  SearchQuery,
  APIConnector,
  RequestState,
  SortDirection
} from "./types";

function filterSearchParameters({
  current,
  filters,
  resultsPerPage,
  searchTerm,
  sortDirection,
  sortField,
  sortList
}: RequestState) {
  return {
    current,
    filters,
    resultsPerPage,
    searchTerm,
    sortDirection,
    sortField,
    sortList
  };
}

export const DEFAULT_STATE: SearchState = {
  // Search Parameters -- This is state that represents the input state.
  current: 1,
  filters: [],
  resultsPerPage: 20,
  searchTerm: "",
  sortDirection: "" as SortDirection,
  sortField: "",
  sortList: [],
  // Result State -- This state represents state that is updated automatically
  // as the result of changing input state.
  autocompletedResults: [],
  autocompletedResultsRequestId: "",
  autocompletedSuggestions: {},
  autocompletedSuggestionsRequestId: "",
  error: "",
  isLoading: false,
  facets: {},
  requestId: "",
  results: [],
  resultSearchTerm: "",
  totalPages: 0,
  totalResults: 0,
  pagingStart: 0,
  pagingEnd: 0,
  wasSearched: false,
  rawResponse: {}
};

function removeConditionalFacets(
  facets = {},
  conditionalFacets = {},
  filters = []
) {
  return Object.entries(facets).reduce((acc, [facetKey, facet]) => {
    if (
      conditionalFacets[facetKey] &&
      typeof conditionalFacets[facetKey] === "function" &&
      !conditionalFacets[facetKey]({ filters })
    ) {
      return acc;
    }

    acc[facetKey] = facet;
    return acc;
  }, {});
}

export type onSearchHook = (
  query: RequestState,
  queryConfig: QueryConfig,
  next: (
    state: RequestState,
    queryConfig: QueryConfig
  ) => Promise<ResponseState>
) => Promise<ResponseState>;

export type onAutocompleteHook = (
  query: AutocompleteSearchQuery,
  queryConfig: QueryConfig,
  next: (
    state: RequestState,
    queryConfig: QueryConfig
  ) => Promise<AutocompleteResponseState>
) => Promise<AutocompleteResponseState>;

export type onResultClickHook = (resultParams: any) => void;
export type onAutocompleteResultClickHook = (resultParams: any) => void;

export type SearchDriverOptions = {
  apiConnector: APIConnector;
  autocompleteQuery?: AutocompleteQueryConfig;
  debug?: boolean;
  initialState?: Partial<RequestState>;
  onSearch?: onSearchHook;
  onAutocomplete?: onAutocompleteHook;
  onResultClick?: onResultClickHook;
  onAutocompleteResultClick?: onAutocompleteResultClickHook;
  searchQuery?: SearchQuery;
  trackUrlState?: boolean;
  urlPushDebounceLength?: number;
  hasA11yNotifications?: boolean;
  a11yNotificationMessages?: Record<string, unknown>;
  alwaysSearchOnInitialLoad?: boolean;
};

export type SubscriptionHandler = (state: SearchState) => void;

interface SearchDriver extends actions.SearchDriverActions {
  actions: actions.SearchDriverActions;
}

/*
 * The Driver is a framework agnostic search state manager that is capable
 * syncing state to the url.
 */
class SearchDriver {
  state: SearchState = DEFAULT_STATE;

  debug: boolean;
  events: Events;
  autocompleteRequestSequencer: RequestSequencer;
  searchRequestSequencer: RequestSequencer;
  debounceManager: DebounceManager;
  autocompleteQuery: AutocompleteQueryConfig;
  searchQuery: SearchQuery;
  subscriptions: SubscriptionHandler[];
  trackUrlState: boolean;
  urlPushDebounceLength: number;
  alwaysSearchOnInitialLoad: boolean;
  URLManager: URLManager;
  hasA11yNotifications: boolean;
  a11yNotificationMessages: Record<
    string,
    (expansions?: Record<string, unknown>) => string
  >;
  startingState: SearchState;
  apiConnector?: APIConnector;

  constructor({
    apiConnector,
    autocompleteQuery = {},
    debug,
    initialState,
    onSearch,
    onAutocomplete,
    onResultClick,
    onAutocompleteResultClick,
    searchQuery = {},
    trackUrlState = true,
    urlPushDebounceLength = 500,
    hasA11yNotifications = false,
    a11yNotificationMessages = {},
    alwaysSearchOnInitialLoad = false
  }: SearchDriverOptions) {
    this.actions = Object.entries(actions).reduce(
      (acc, [actionName, action]) => {
        return {
          ...acc,
          [actionName]: action.bind(this)
        };
      },
      {}
    ) as actions.SearchDriverActions;

    this.actions = {
      ...this.actions,
      ...(apiConnector?.actions && { ...apiConnector.actions })
    };

    Object.assign(this, this.actions);

    this.events = new Events({
      apiConnector,
      onSearch,
      onAutocomplete,
      onResultClick,
      onAutocompleteResultClick
    });

    this.debug = debug;
    if (this.debug) {
      console.warn(
        "Search UI Debugging is enabled. This should be turned off in production deployments."
      );
      if (typeof window !== "undefined") window["searchUI"] = this;
    }
    this.autocompleteRequestSequencer = new RequestSequencer();
    this.searchRequestSequencer = new RequestSequencer();
    this.debounceManager = new DebounceManager();
    this.autocompleteQuery = autocompleteQuery;
    this.searchQuery = searchQuery;
    this.subscriptions = [];
    this.trackUrlState = trackUrlState;
    this.urlPushDebounceLength = urlPushDebounceLength;
    this.alwaysSearchOnInitialLoad = alwaysSearchOnInitialLoad;
    this.apiConnector = apiConnector;

    let urlState;
    if (trackUrlState) {
      this.URLManager = new URLManager();
      urlState = this.URLManager.getStateFromURL();
      this.URLManager.onURLStateChange((urlState) => {
        this._updateSearchResults(
          { ...DEFAULT_STATE, ...urlState },
          { skipPushToUrl: true }
        );
      });
    } else {
      urlState = {};
    }

    // Manage screen reader accessible notifications
    this.hasA11yNotifications = hasA11yNotifications;
    if (this.hasA11yNotifications) a11y.getLiveRegion();

    this.a11yNotificationMessages = {
      ...a11y.defaultMessages,
      ...a11yNotificationMessages
    };

    // Remember the state this application is initialized into, so that we can
    // reset to it later.
    this.startingState = {
      ...this.state,
      ...initialState
    };

    // We filter these here to disallow anything other than valid search
    // parameters to be passed in initial state, or url state. `results`, etc,
    // should not be allowed to be passed in, that should be generated based on
    // the results of the query
    const searchParameters = filterSearchParameters({
      ...this.startingState,
      ...urlState
    });

    // Initialize the state without calling _setState, because we don't
    // want to trigger an update callback, we're just initializing the state
    // to the correct default values for the initial UI render
    this.state = {
      ...this.state,
      ...(apiConnector?.state && { ...apiConnector.state }),
      ...searchParameters
    };

    // We'll trigger an initial search if initial parameters contain
    // a search term or filters, or if alwaysSearchOnInitialLoad is set.
    // Otherwise, we'll just save their selections in state as initial values.
    if (
      searchParameters.searchTerm ||
      searchParameters.filters.length > 0 ||
      this.alwaysSearchOnInitialLoad
    ) {
      this._updateSearchResults(searchParameters, { replaceUrl: true });
    }
  }

  /**
   * This method is used to update state and trigger a new autocomplete search.
   *
   * @param {string} searchTerm
   * @param {Object=} Object
   * @param {boolean|Object} options.autocompleteResults - Should autocomplete results
   * @param {boolean|Object} options.autocompleteSuggestions - Should autocomplete suggestions
   */
  private _updateAutocomplete = (
    searchTerm: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { autocompleteResults, autocompleteSuggestions }: any = {}
  ) => {
    const requestId = this.autocompleteRequestSequencer.next();

    const queryConfig = {
      ...(autocompleteResults && {
        results: this.autocompleteQuery.results || {}
      }),
      ...(autocompleteSuggestions && {
        suggestions: this.autocompleteQuery.suggestions || {}
      })
    };

    return this.events
      .autocomplete({ searchTerm }, queryConfig)
      .then((autocompleted) => {
        if (this.autocompleteRequestSequencer.isOldRequest(requestId)) return;
        this.autocompleteRequestSequencer.completed(requestId);

        this._setState(autocompleted);
      });
  };

  /**
   * This method is used to update state and trigger a new search.
   *
   * @typedef {Object} RequestState
   * @property {number} current
   * @property {number} resultsPerPage
   * @property {string} searchTerm
   * @property {string} sortDirection
   * @property {string} sortField
   * @property {Array} sortList
   *
   * @param {RequestState} searchParameters - RequestState
   * @param {Object=} Object
   * @param {boolean} options.skipPushToUrl - Skip pushing the updated to the URL
   * @param {boolean} options.replaceUrl - When pushing state to the URL, use history 'replace'
   * rather than 'push' to avoid adding a new history entry
   */
  _updateSearchResults = (
    searchParameters: RequestState,
    { skipPushToUrl = false, replaceUrl = false } = {}
  ) => {
    const {
      current,
      filters,
      resultsPerPage,
      searchTerm,
      sortDirection,
      sortField,
      sortList
    } = {
      ...this.state,
      ...searchParameters
    };

    // State updates should always be applied in the order that they are made. This function, _updateSearchResults,
    // makes state updates.
    // In the case where a call to "_updateSearchResults" was made and delayed for X amount of time using
    // `debounceManager.runWithDebounce`, and a subsequent call is made _updateSearchResults before that delay ends, we
    // want to make sure that outstanding call to "_updateSearchResults" is cancelled, as it would apply state updates
    // out of order.
    this.debounceManager.cancelByName("_updateSearchResults");

    this._setState({
      current,
      error: "",
      filters,
      resultsPerPage,
      searchTerm,
      sortDirection,
      sortField,
      sortList
    });

    this._makeSearchRequest({
      skipPushToUrl,
      replaceUrl
    });
  };

  /**
   * This method is separated out from _updateSearchResults so that it
   * can be debounced.
   *
   * By debouncing our API calls, we can effectively allow action chaining.
   *
   * For Ex:
   *
   * If a user needs to make multiple filter updates at once, they could
   * do so by calling an action 3 times in a row:
   *
   *   addFilter("states", "California");
   *   addFilter("states", "Nebraska");
   *   addFilter("states", "Pennsylvania");
   *
   * We don't want to make 3 separate API calls like that in quick succession,
   * so we debounce the API calls.
   *
   * Application state updates are performed in _updateSearchResults, but we
   * wait to make the actual API calls until all actions have been called.
   *
   * @param {Object} options
   * @param {boolean} options.skipPushToUrl - Skip pushing the updated to the URL
   * @param {boolean} options.replaceUrl - When pushing state to the URL, use history 'replace'
   * rather than 'push' to avoid adding a new history entry
   */
  private _makeSearchRequest = DebounceManager.debounce(
    0,
    ({ skipPushToUrl, replaceUrl }) => {
      const {
        current,
        filters,
        resultsPerPage,
        searchTerm,
        sortDirection,
        sortField,
        sortList
      } = this.state;

      this._setState({
        isLoading: true
      });

      const requestId = this.searchRequestSequencer.next();

      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        filters: searchQueryFilters,
        conditionalFacets: conditionalFacets,
        ...restOfSearchQuery
      } = this.searchQuery;

      const queryConfig = {
        ...restOfSearchQuery,
        facets: removeConditionalFacets(
          this.searchQuery.facets,
          conditionalFacets,
          filters
        )
      };
      const requestState: RequestState = {
        ...filterSearchParameters(this.state),
        filters: mergeFilters(filters, this.searchQuery.filters)
      };

      return this.events.search(requestState, queryConfig).then(
        (resultState) => {
          if (this.searchRequestSequencer.isOldRequest(requestId)) return;
          this.searchRequestSequencer.completed(requestId);

          // Results paging start & end
          const { totalResults } = resultState;
          const start =
            totalResults === 0 ? 0 : (current - 1) * resultsPerPage + 1;
          const end =
            totalResults < start + resultsPerPage
              ? totalResults
              : start + resultsPerPage - 1;

          this._setState({
            isLoading: false,
            resultSearchTerm: searchTerm,
            pagingStart: start,
            pagingEnd: end,
            ...resultState,
            wasSearched: true
          });

          if (this.hasA11yNotifications) {
            const messageArgs = { start, end, totalResults, searchTerm };
            this.actions.a11yNotify("searchResults", messageArgs);
          }

          if (!skipPushToUrl && this.trackUrlState) {
            // We debounce here so that we don't get a lot of intermediary
            // URL state if someone is updating a UI really fast, like typing
            // in a live search box for instance.
            this.debounceManager.runWithDebounce(
              this.urlPushDebounceLength,
              "pushStateToURL",
              this.URLManager.pushStateToURL.bind(this.URLManager),
              {
                current,
                filters,
                resultsPerPage,
                searchTerm,
                sortDirection,
                sortField,
                sortList
              },
              { replaceUrl }
            );
          }
        },
        (error) => {
          if (error.message === INVALID_CREDENTIALS) {
            // The connector should have invalidated the credentials in its state by now
            // Getting the latest state from the connector
            this._setState({
              ...(this.apiConnector?.state && { ...this.apiConnector.state })
            });
            // Stop execution of request
            // and let the consuming application handle the missing credentials
            return;
          }

          this._setState({
            error: `An unexpected error occurred: ${error.message}`
          });
        }
      );
    }
  );

  private _setState(newState: Partial<SearchState>) {
    const state = { ...this.state, ...newState } as SearchState;
    // eslint-disable-next-line no-console
    if (this.debug) console.log("Search UI: State Update", newState, state);
    this.state = state;
    this.subscriptions.forEach((subscription) => subscription(state));
  }

  /**
   * Dynamically update the searchQuery configuration in this driver.
   * This will issue a new query after being updated.
   *
   * @param Object searchQuery
   */
  setSearchQuery(searchQuery: SearchQuery): void {
    this.searchQuery = searchQuery;
    this._updateSearchResults({});
  }

  /**
   * @param Object autocompleteQuery
   */
  setAutocompleteQuery(autocompleteQuery: AutocompleteQueryConfig): void {
    this.autocompleteQuery = autocompleteQuery;
  }

  /**
   * Any time state is updated in this Driver, the provided callback
   * will be executed with the updated state.
   *
   * @param onStateChange Function
   */
  subscribeToStateChanges(onStateChange: SubscriptionHandler): void {
    this.subscriptions.push(onStateChange);
  }

  /**
   * @param onStateChange Function
   */
  unsubscribeToStateChanges(onStateChange: SubscriptionHandler): void {
    this.subscriptions = this.subscriptions.filter(
      (sub) => sub !== onStateChange
    );
  }

  /**
   * Remove all listeners
   */
  tearDown() {
    this.subscriptions = [];
    this.URLManager && this.URLManager.tearDown();
  }

  /**
   * Retrieves all available actions
   *
   * @returns Object All actions
   */
  getActions(): actions.SearchDriverActions {
    return this.actions;
  }

  /**
   * Retrieve current state. Typically used on app initialization. Subsequent
   * state updates should come through subscription.
   *
   * @returns Object Current state
   */
  getState(): SearchState {
    // We return a copy of state here, because we want to ensure the state
    // inside of this object remains immutable.
    return { ...this.state };
  }
}

export default SearchDriver;
