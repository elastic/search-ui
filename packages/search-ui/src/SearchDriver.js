import URLManager from "./URLManager";

import RequestSequencer from "./RequestSequencer";
import DebounceManager from "./DebounceManager";

import * as actions from "./actions";
import Events from "./Events";

import * as a11y from "./A11yNotifications";

function filterSearchParameters({
  current,
  filters,
  resultsPerPage,
  searchTerm,
  sortDirection,
  sortField
}) {
  return {
    current,
    filters,
    resultsPerPage,
    searchTerm,
    sortDirection,
    sortField
  };
}

export const DEFAULT_STATE = {
  // Search Parameters -- This is state that represents the input state.
  current: 1,
  filters: [],
  resultsPerPage: 20,
  searchTerm: "",
  sortDirection: "",
  sortField: "",
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
  wasSearched: false
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

/*
 * The Driver is a framework agnostic search state manager that is capable
 * syncing state to the url.
 */
export default class SearchDriver {
  state = DEFAULT_STATE;

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
    a11yNotificationMessages = {}
  }) {
    this.actions = Object.entries(actions).reduce(
      (acc, [actionName, action]) => {
        return {
          ...acc,
          [actionName]: action.bind(this)
        };
      },
      {}
    );
    Object.assign(this, this.actions);

    this.events = new Events({
      apiConnector,
      onSearch,
      onAutocomplete,
      onResultClick,
      onAutocompleteResultClick
    });

    this.debug = debug;
    this.requestSequencer = new RequestSequencer();
    this.debounceManager = new DebounceManager();
    this.autocompleteQuery = autocompleteQuery;
    this.searchQuery = searchQuery;
    this.subscriptions = [];
    this.trackUrlState = trackUrlState;
    this.urlPushDebounceLength = urlPushDebounceLength;

    let urlState;
    if (trackUrlState) {
      this.URLManager = new URLManager();
      urlState = this.URLManager.getStateFromURL();
      this.URLManager.onURLStateChange(urlState => {
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
      ...searchParameters
    };

    // We'll trigger an initial search if initial parameters contain
    // a search term or filters, otherwise, we'll just save their selections
    // in state as initial values.
    if (searchParameters.searchTerm || searchParameters.filters.length > 0) {
      this._updateSearchResults(searchParameters);
    }
  }

  _updateAutocomplete = (
    searchTerm,
    { autocompleteResults, autocompleteSuggestions } = {}
  ) => {
    const requestId = this.requestSequencer.next();

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
      .then(autocompleted => {
        if (this.requestSequencer.isOldRequest(requestId)) return;
        this.requestSequencer.completed(requestId);

        this._setState(autocompleted);
      });
  };

  _updateSearchResults = (
    searchParameters,
    { skipPushToUrl = false, ignoreIsLoadingCheck = false } = {}
  ) => {
    const {
      current,
      filters,
      isLoading,
      resultsPerPage,
      searchTerm,
      sortDirection,
      sortField
    } = {
      ...this.state,
      ...searchParameters
    };

    if (isLoading && !ignoreIsLoadingCheck) return;

    this._setState({
      current,
      error: "",
      filters,
      isLoading: true,
      resultsPerPage,
      searchTerm,
      sortDirection,
      sortField
    });

    const requestId = this.requestSequencer.next();

    const queryConfig = {
      ...this.searchQuery,
      facets: removeConditionalFacets(
        this.searchQuery.facets,
        this.searchQuery.conditionalFacets,
        filters
      )
    };

    const requestState = filterSearchParameters(this.state);

    return this.events.search(requestState, queryConfig).then(
      resultState => {
        if (this.requestSequencer.isOldRequest(requestId)) return;
        this.requestSequencer.completed(requestId);

        // Results paging start & end
        const { totalResults } = resultState;
        const start =
          totalResults === 0 ? 0 : (current - 1) * resultsPerPage + 1;
        const end =
          totalResults <= start + resultsPerPage
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
            this.URLManager.pushStateToURL.bind(this.URLManager),
            {
              current,
              filters,
              resultsPerPage,
              searchTerm,
              sortDirection,
              sortField
            }
          );
        }
      },
      error => {
        this._setState({
          error: `An unexpected error occurred: ${error.message}`
        });
      }
    );
  };

  _setState(newState) {
    const state = { ...this.state, ...newState };
    // eslint-disable-next-line no-console
    if (this.debug) console.log("State Update", newState, state);
    this.state = state;
    this.subscriptions.forEach(subscription => subscription(state));
  }

  /**
   * Any time state is updated in this Driver, the provided callback
   * will be executed with the updated state.
   *
   * @param onStateChange Function
   */
  subscribeToStateChanges(onStateChange) {
    this.subscriptions.push(onStateChange);
  }

  /**
   * @param onStateChange Function
   */
  unsubscribeToStateChanges(onStateChange) {
    this.subscriptions = this.subscriptions.filter(
      sub => sub !== onStateChange
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
   * Retrieves all available acitons
   *
   * @returns Object All actions
   */
  getActions() {
    return this.actions;
  }

  /**
   * Retrieve current state. Typically used on app initialization. Subsequent
   * state updates should come through subscription.
   *
   * @returns Object Current state
   */
  getState() {
    // We return a copy of state here, because we want to ensure the state
    // inside of this object remains immutable.
    return { ...this.state };
  }
}
