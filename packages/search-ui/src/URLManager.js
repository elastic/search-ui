import { createBrowserHistory as createHistory } from "history";
import queryString from "./queryString";

function isNumericString(num) {
  return !isNaN(num);
}

function toSingleValue(val) {
  return Array.isArray(val) ? val[val.length - 1] : val;
}

function toSingleValueInteger(num) {
  return toInteger(toSingleValue(num));
}

function toInteger(num) {
  if (!isNumericString(num)) return;
  return parseInt(num, 10);
}

function parseFiltersFromQueryParams(queryParams) {
  return queryParams.filters;
}

function parseCurrentFromQueryParams(queryParams) {
  return toSingleValueInteger(queryParams.current);
}

function parseSearchTermFromQueryParams(queryParams) {
  return toSingleValue(queryParams.q);
}

function parseSortFromQueryParams(queryParams) {
  const sortField = toSingleValue(queryParams["sort-field"]);
  const sortDirection = toSingleValue(queryParams["sort-direction"]);

  if (sortField) return [sortField, sortDirection];
  return [];
}

function parseSizeFromQueryParams(queryParams) {
  return toSingleValueInteger(queryParams.size);
}

function paramsToState(queryParams) {
  const state = {
    current: parseCurrentFromQueryParams(queryParams),
    filters: parseFiltersFromQueryParams(queryParams),
    searchTerm: parseSearchTermFromQueryParams(queryParams),
    resultsPerPage: parseSizeFromQueryParams(queryParams),
    sortField: parseSortFromQueryParams(queryParams)[0],
    sortDirection: parseSortFromQueryParams(queryParams)[1]
  };

  return Object.keys(state).reduce((acc, key) => {
    const value = state[key];
    if (value) acc[key] = value;
    return acc;
  }, {});
}

function stateToParams({
  searchTerm,
  current,
  filters,
  resultsPerPage,
  sortDirection,
  sortField
}) {
  const params = {};

  if (current > 1) params.current = current;
  if (searchTerm) params.q = searchTerm;
  if (resultsPerPage) params.size = resultsPerPage;
  if (filters && filters.length > 0) {
    params["filters"] = filters;
  }
  if (sortField) {
    params["sort-field"] = sortField;
    params["sort-direction"] = sortDirection;
  }

  return params;
}

function stateToQueryString(state) {
  return queryString.stringify(stateToParams(state));
}

/**
 * The URL Manager is responsible for synchronizing state between
 * SearchDriver and the URL. There are 3 main cases we handle when
 * synchronizing:
 *
 * 1. When the app loads, SearchDriver will need to
 * read the current state from the URL, in order to perform the search
 * expressed by the query string. `getStateFromURL` is used for this case.
 *
 * 2. When the URL changes as a result of `pushState` or `replaceState`,
 * SearchDriver will need to be notified and given the updated state, so that
 * it can re-run the current search. `onURLStateChange` is used for this case.
 *
 * 3. When state changes internally in the SearchDriver, as a result of an
 * Action, it will need to notify the URLManager of the change. `pushStateToURL`
 * is used for this case.
 */

export default class URLManager {
  constructor() {
    this.history = createHistory();
    this.lastPushSearchString = "";
  }

  /**
   * Parse the current URL into application state
   *
   * @return {Object} - The parsed state object
   */
  getStateFromURL() {
    return paramsToState(queryString.parse(this.history.location.search));
  }

  /**
   * Push the current state of the application to the URL
   *
   * @param {Object} state - The entire current state from the SearchDriver
   * @param {boolean} options
   * @param {boolean} options.replaceUrl - When pushing state to the URL, use history 'replace'
   * rather than 'push' to avoid adding a new history entry
   */
  pushStateToURL(state, { replaceUrl = false } = {}) {
    const searchString = stateToQueryString(state);
    this.lastPushSearchString = searchString;
    const navigationFunction = replaceUrl
      ? this.history.replace
      : this.history.push;
    navigationFunction({
      search: `?${searchString}`
    });
  }

  /**
   * Add an event handler to be executed whenever state is pushed to the URL
   *
   * @callback requestCallback
   * @param {Object} state - Updated application state parsed from the new URL
   *
   * @param {requestCallback} callback
   */
  onURLStateChange(callback) {
    this.unlisten = this.history.listen(location => {
      // If this URL is updated as a result of a pushState request, we don't
      // want to notify that the URL changed.
      if (`?${this.lastPushSearchString}` === location.search) return;

      // Once we've decided to return based on lastPushSearchString, reset
      // it so that we don't break back / forward button.
      this.lastPushSearchString = "";

      callback(paramsToState(queryString.parse(location.search)));
    });
  }

  tearDown() {
    this.unlisten();
  }
}
