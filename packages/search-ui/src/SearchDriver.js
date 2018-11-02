import URLManager from "./URLManager";
import { format } from "date-fns";

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

/*
 * Facet values for dates come back as Integer from the API. However, the API
 * expects them as a formatted date String when applying that same value
 * as a filter.
 */
function convertRangeFiltersToDateString(filters = []) {
  const val = filters.map(filter => {
    return Object.entries(filter).reduce((acc, [filterName, filterValues]) => {
      return {
        ...acc,
        [filterName]: filterValues.map(filterValue => {
          if (!filterValue.from && !filterValue.to) {
            return filterValue;
          }

          return {
            ...(filterValue.from && {
              from: format(new Date(filterValue.from))
            }),
            ...(filterValue.to && { to: format(new Date(filterValue.to)) })
          };
        })
      };
    }, {});
  });

  return val;
}

function removeConditionalFacets(facets = {}, filters = []) {
  return Object.entries(facets).reduce((acc, [facetKey, facet]) => {
    if (
      facet.conditional &&
      typeof facet.conditional === "function" &&
      !facet.conditional({ filters })
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
 * The Driver is a framework agnostic state manager for App Search apps. Meaning,
 * it is the source of truth for state in this React App, but it has no
 * dependencies on React itself.
 *
 * The public interface of the Driver can be thought about as "state" and
 * "actions."
 *
 * Ways to GET state:
 * - getState - Get the initial app state
 * - subscribeToStateChanges - Get updated state whenever it changes.
 *
 * Ways to SET state, using actions. All actions can be found in 'getActions'.
 *
 * const {addFilter} = getActions().
 *
 * addFilter, and most actions, will typically update the state and trigger
 * new queries to be run against the search API.
 *
 * Configuration:
 *
 * - apiConnector: APIConnector
 *   Instance of an API Connector. For instance, AppSearchAPIConnector
 *
 * - facetConfig: Facet
 *   Configuration for Facet filters to be used within this application. The
 *   syntax for Facet configuration follows the API syntax:
 *   https://swiftype.com/documentation/app-search/api/search/facets. In
 *   addition to the options provided by the API, the following per Facet
 *   configuration is also available:
 *     - conditional[function]
 *       This facet will only be applied if the condition specified returns
 *       true, based on the current applied filters.
 *     - disjunctive[boolean]
 *       When returning counts for disjunctive facets, the counts will be
 *       returned as if no filter is applied on this field, even if one is
 *       applied. A common use case for this is tabbed filters.
 *
 *   ex.
 *   facetConfig: {
 *     author: {
 *       type: "value",
 *       size: 40,
 *       disjunctive: true,
 *       conditional: ({ filters }) =>
 *         ["blog", "videos"].includes(filters.filter(f => f["website_area"]))
 *     }
 *   }
 *
 * - initialState: Object
 *   Set initial input state, or search parameters. For example, initializing
 *   the search page with certain parameters already set:
 *`
 *   initialState: {
 *     searchTerm: "test",
 *     resultsPerPage: 40
 *   }
 *
 *   Valid search parameters are:
 *     current: Integer
 *     filters: Array[Object]
 *     resultsPerPage: Integer
 *     searchTerm: String
 *     sortDirection: String ["asc"|"desc"]
 *     sortField: String
 *
 * - searchOptions: Object
 *   This is low level configuration which lets you configure
 *   the options used on the Search API endpoint, ex: `result_fields`.
 *   https://swiftype.com/documentation/app-search/api/search
 *
 * - trackURLState: Boolean
 *   URL State management can be disabled completely
 */
export default class SearchDriver {
  state = DEFAULT_STATE;

  constructor({
    apiConnector,
    facetConfig,
    initialState,
    searchOptions,
    trackUrlState = true
  }) {
    if (!apiConnector) {
      throw Error("apiConnector required");
    }
    this.apiConnector = apiConnector;
    this.facetConfig = facetConfig;
    this.subscriptions = [];
    this.searchOptions = searchOptions || {};
    this.trackUrlState = trackUrlState;

    let urlState;
    if (trackUrlState) {
      this.URLManager = new URLManager();
      urlState = this.URLManager.getStateFromURL();
      this.URLManager.onURLStateChange(urlState => {
        this._updateSearchResults({ ...DEFAULT_STATE, ...urlState }, true);
      });
    } else {
      urlState = {};
    }

    // We filter these here to disallow anything other than valid search
    // parameters to be passed in initial state, or url state. `results`, etc,
    // should not be allowed to be passed in, that should be generated based on
    // the results of the query
    const searchParameters = filterSearchParameters({
      ...this.state,
      ...initialState,
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

  _updateSearchResults(searchParameters, skipPushToUrl = false) {
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

    if (isLoading) return;

    const searchOptions = {
      ...this.searchOptions,
      page: {
        current,
        size: resultsPerPage
      },
      facets: removeConditionalFacets(this.facetConfig, filters),
      filters: {
        all: formatORFiltersAsAND(convertRangeFiltersToDateString(filters))
      }
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

    return this.apiConnector.search(searchTerm, searchOptions).then(
      resultList => {
        this._setState({
          facets: resultList.info.facets || {},
          isLoading: false,
          requestId: resultList.info.meta.request_id,
          results: resultList.results,
          resultSearchTerm: searchTerm,
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

  /**
   * Set the current search term
   *
   * Will trigger new search
   *
   * @param searchTerm String
   */
  setSearchTerm = searchTerm => {
    this._updateSearchResults({
      current: 1,
      filters: [],
      searchTerm
    });
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
   * Report a click through event. A click through event is when a user
   * clicks on a result link. Click events can be reviewed in the App Search
   * Analytics Dashboard.
   *
   * @param documentId String The document ID associated with result that was
   * clicked
   * @param tag Array[String] Optional Tags which can be used to categorize
   * this click event in App Search Analytics dashboard
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
}
