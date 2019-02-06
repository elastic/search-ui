import URLManager from "./URLManager";
import debounceFn from "debounce-fn";

import RequestSequencer from "./RequestSequencer";

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

function removeSingleFilterValue(filters, name, value) {
  return filters.reduce((acc, filter) => {
    if (filter[name]) {
      const currentFilterValues = filter[name];
      const updatedFilterValues = currentFilterValues.filter(
        filterValue => !matchFilter(filterValue, value)
      );
      if (updatedFilterValues.length > 0) {
        return acc.concat({
          [name]: updatedFilterValues
        });
      } else {
        return acc;
      }
    }
    return acc.concat(filter);
  }, []);
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
  error: "",
  isLoading: false,
  facets: {},
  requestId: "",
  results: [],
  resultSearchTerm: "",
  totalPages: 0,
  totalResults: 0,
  wasSearched: false
};

/*
 * This fixes an issue with filtering.
 * Our data structure for filters are the "OR" format for the App Search
 * API:
 *
 *  ```
 *  filters: {
 *   all: [
 *    {author: ["Clinton", "Shay"]}
 *   ]
 *  }
 *  ```
 *
 * However, the intent is for them to be AND filters. So we need
 * to do a quick change in formatting before applying them.
 *
 *  ```
 *   filters: {
 *    all: [
 *     {author: "Clinton"},
 *     {author: "Shay"}
 *    ]
 *   }
 *  ```
 */
function formatORFiltersAsAND(filters = []) {
  return filters.reduce((acc, filter) => {
    const name = Object.keys(filter)[0];
    const values = Object.values(filter)[0];
    return acc.concat(values.map(v => ({ [name]: v })));
  }, []);
}

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

function matchFilter(filter1, filter2) {
  return (
    filter1 === filter2 ||
    (filter1.from &&
      filter1.from === filter2.from &&
      filter1.to &&
      filter1.to === filter2.to)
  );
}

/*
 * The Driver is a framework agnostic search state manager that is capable
 * syncing state to the url.
 */
export default class SearchDriver {
  state = DEFAULT_STATE;
  setSearchTermDebounceCache = {};

  constructor({
    apiConnector,
    conditionalFacets,
    disjunctiveFacets,
    disjunctiveFacetsAnalyticsTags,
    facets,
    initialState,
    result_fields,
    search_fields,
    trackUrlState = true
  }) {
    if (!apiConnector) {
      throw Error("apiConnector required");
    }
    this.requestSequencer = new RequestSequencer();
    this.apiConnector = apiConnector;
    this.conditionalFacets = conditionalFacets;
    this.disjunctiveFacets = disjunctiveFacets;
    this.disjunctiveFacetsAnalyticsTags = disjunctiveFacetsAnalyticsTags;
    this.facets = facets;
    this.result_fields = result_fields;
    this.search_fields = search_fields;
    this.subscriptions = [];
    this.trackUrlState = trackUrlState;

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

  _updateSearchResults(
    searchParameters,
    { skipPushToUrl = false, ignoreIsLoadingCheck = false } = {}
  ) {
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

    const searchOptions = {
      disjunctiveFacets: this.disjunctiveFacets,
      disjunctiveFacetsAnalyticsTags: this.disjunctiveFacetsAnalyticsTags,
      facets: removeConditionalFacets(
        this.facets,
        this.conditionalFacets,
        filters
      ),
      filters: {
        all: formatORFiltersAsAND(filters)
      },
      page: {
        current,
        size: resultsPerPage
      },
      result_fields: this.result_fields,
      search_fields: this.search_fields
    };

    if (sortField && sortDirection) {
      searchOptions.sort = {
        [sortField]: sortDirection
      };
    }

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

    return this.apiConnector.search(searchTerm, searchOptions).then(
      resultList => {
        if (this.requestSequencer.isOldRequest(requestId)) return;
        this.requestSequencer.completed(requestId);

        this._setState({
          facets: resultList.info.facets || {},
          isLoading: false,
          requestId: resultList.info.meta.request_id,
          results: resultList.results,
          resultSearchTerm: searchTerm,
          totalPages: resultList.info.meta.page.total_pages,
          totalResults: resultList.info.meta.page.total_results,
          wasSearched: true
        });

        if (!skipPushToUrl && this.trackUrlState) {
          this.URLManager.pushStateToURL({
            current,
            filters,
            resultsPerPage,
            searchTerm,
            sortDirection,
            sortField
          });
        }
      },
      error => {
        console.error(error);
        this._setState({
          error: `An unexpected error occurred: ${error.message}`
        });
      }
    );
  }

  _setState(newState) {
    const state = { ...this.state, ...newState };
    this.subscriptions.forEach(subscription => subscription(state));
    this.state = state;
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
   * Retrieves all available acitons
   *
   * @returns Object All actions
   */
  getActions() {
    return {
      addFilter: this.addFilter,
      clearFilters: this.clearFilters,
      removeFilter: this.removeFilter,
      reset: this.reset,
      setFilter: this.setFilter,
      setResultsPerPage: this.setResultsPerPage,
      setSearchTerm: this.setSearchTerm,
      setSort: this.setSort,
      setCurrent: this.setCurrent,
      trackClickThrough: this.trackClickThrough
    };
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

  /**
   * Filter results - Adds to current filter value
   *
   * Will trigger new search
   *
   * @param name String field name to filter on
   * @param value String field value to filter on
   */
  addFilter = (name, value) => {
    const { filters } = this.state;

    const existingFilterValues = (filters.find(f => f[name]) || {})[name] || [];

    const newFilterValues = existingFilterValues.find(existing =>
      matchFilter(existing, value)
    )
      ? existingFilterValues
      : existingFilterValues.concat(value);

    const filtersWithoutTargetFilter = filters.filter(f => !f[name]);

    this._updateSearchResults({
      current: 1,
      filters: [...filtersWithoutTargetFilter, { [name]: newFilterValues }]
    });
  };

  /**
   * Filter results - Replaces current filter value
   *
   * Will trigger new search
   *
   * @param name String field name to filter on
   * @param value String field value to filter on
   */
  setFilter = (name, value) => {
    let { filters } = this.state;
    filters = filters.filter(filter => Object.keys(filter)[0] !== name);

    this._updateSearchResults({
      current: 1,
      filters: [...filters, { [name]: [value] }]
    });
  };

  /**
   * Reset search experience to initial state
   *
   */
  reset = () => {
    this._setState(this.startingState);
  };

  /**
   * Remove filter from results
   *
   * Will trigger new search
   *
   * @param name String field name for filter to remove
   * @param value String (Optional) field value for filter to remove
   */
  removeFilter = (name, value) => {
    const { filters } = this.state;

    const updatedFilters = value
      ? removeSingleFilterValue(filters, name, value)
      : filters.filter(filter => !filter[name]);

    this._updateSearchResults({
      current: 1,
      filters: updatedFilters
    });
  };

  /**
   * Remove all filters
   *
   * Will trigger new search
   *
   * @param except Array[String] field name of any filters that should remain
   */
  clearFilters = (except = []) => {
    const { filters } = this.state;

    const updatedFilters = filters.filter(filter => {
      const filterField = Object.keys(filter)[0];
      return except.includes(filterField);
    });

    this._updateSearchResults({
      current: 1,
      filters: updatedFilters
    });
  };

  /**
   * Set the number of results to show
   *
   * Will trigger new search
   *
   * @param resultsPerPage Integer
   */
  setResultsPerPage = resultsPerPage => {
    this._updateSearchResults({
      current: 1,
      resultsPerPage
    });
  };

  maybeDebounceUpdateSearchResults = (options, debounceWait) => {
    if (!debounceWait) {
      this._updateSearchResults(options);
      return;
    }

    let debounced = this.setSearchTermDebounceCache[debounceWait];
    if (!debounced) {
      // We use a cache here so that we can let users pass a debounce length. This
      // requires that they pass the SAME debounce length on each request, since we
      // create a separate debounced function for each length passed.
      this.setSearchTermDebounceCache[debounceWait] = debounceFn(
        () => {
          this._updateSearchResults(options, { ignoreIsLoadingCheck: true });
        },
        { wait: debounceWait }
      );
      debounced = this.setSearchTermDebounceCache[debounceWait];
    }

    debounced(options);
  };

  /**
   * Set the current search term
   *
   * Will trigger new search
   *
   * @param searchTerm String
   * @param options Object Additional objects
   * @param options.refresh Boolean Refresh search results?
   * @param options.wait Boolean Refresh search results?
   */
  setSearchTerm = (searchTerm, { refresh = true, debounce = 0 } = {}) => {
    this._setState({ searchTerm });

    if (refresh) {
      this.maybeDebounceUpdateSearchResults(
        {
          current: 1,
          filters: []
        },
        debounce
      );
    }
  };

  /**
   * Set the current sort
   *
   * Will trigger new search
   *
   * @param sortField String
   * @param sortDirection String ["asc"|"desc"]
   */
  setSort = (sortField, sortDirection) => {
    this._updateSearchResults({
      current: 1,
      sortDirection,
      sortField
    });
  };

  /**
   * Set the current page
   *
   * Will trigger new search
   *
   * @param current Integer
   */
  setCurrent = current => {
    this._updateSearchResults({
      current
    });
  };

  /**
   * Report a click through event. A click through event is when a user
   * clicks on a result link. Click events can be reviewed in the App Search
   * Analytics Dashboard.
   *
   * @param documentId String The document ID associated with result that was
   * clicked
   * @param tag Array[String] Optional Tags which can be used to categorize
   * this click event
   */
  trackClickThrough = (documentId, tags = []) => {
    const { requestId, searchTerm } = this.state;

    this.apiConnector.click({
      query: searchTerm,
      documentId,
      requestId,
      tags
    });
  };
}
