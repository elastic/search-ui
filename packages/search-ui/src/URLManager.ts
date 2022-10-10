import {
  createBrowserHistory as createHistory,
  createMemoryHistory,
  History
} from "history";
import queryString from "./queryString";
import { Filter, RequestState, SortOption } from "./types";

type QueryParams = {
  filters?: Filter[];
  current?: number;
  q?: string;
  size?: number;
  "sort-field"?: string;
  "sort-direction"?: string;
  sort?: SortOption[];
};

function isNumericString(num): boolean {
  return !isNaN(num);
}

function toSingleValue(val): string {
  return Array.isArray(val) ? val[val.length - 1] : val;
}

function toSingleValueInteger(num): number {
  return toInteger(toSingleValue(num));
}

function toInteger(num): number {
  if (!isNumericString(num)) return;
  return parseInt(num, 10);
}

function parseFiltersFromQueryParams(queryParams: QueryParams): Filter[] {
  return queryParams.filters;
}

function parseCurrentFromQueryParams(queryParams: QueryParams): number {
  return toSingleValueInteger(queryParams.current);
}

function parseSearchTermFromQueryParams(queryParams: QueryParams): string {
  return toSingleValue(queryParams.q);
}

function parseOldSortFromQueryParams(
  queryParams: QueryParams
): [string, string] | [] {
  const sortField = toSingleValue(queryParams["sort-field"]);
  const sortDirection = toSingleValue(queryParams["sort-direction"]);

  if (sortField) return [sortField, sortDirection];
  return [];
}

function parseSizeFromQueryParams(queryParams: QueryParams): number {
  return toSingleValueInteger(queryParams.size);
}

function parseSortFromQueryParams(queryParams: QueryParams): SortOption[] {
  return queryParams["sort"];
}

function paramsToState(queryParams: QueryParams): RequestState {
  const state = {
    current: parseCurrentFromQueryParams(queryParams),
    filters: parseFiltersFromQueryParams(queryParams),
    searchTerm: parseSearchTermFromQueryParams(queryParams),
    resultsPerPage: parseSizeFromQueryParams(queryParams),
    sortField: parseOldSortFromQueryParams(queryParams)[0],
    sortDirection: parseOldSortFromQueryParams(queryParams)[1],
    sortList: parseSortFromQueryParams(queryParams)
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
  sortField,
  sortList
}: RequestState): QueryParams {
  const params: QueryParams = {};
  if (current > 1) params.current = current;
  if (searchTerm) params.q = searchTerm;
  if (resultsPerPage) params.size = resultsPerPage;
  if (filters && filters.length > 0) {
    params["filters"] = filters;
  }
  if (sortList && sortList.length > 0) {
    params["sort"] = sortList;
  } else if (sortField) {
    params["sort-field"] = sortField;
    params["sort-direction"] = sortDirection;
  }
  return params;
}

function stateToQueryString(state: RequestState): string {
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

interface RoutingHandler {
  readUrl: () => string;
  writeUrl: (url: string, { replaceUrl }: { replaceUrl: boolean }) => void;
  urlToState: (url: string) => RequestState;
  stateToUrl: (state: RequestState) => string;
  routeChangeHandler: (handler: (url?: string) => void) => () => void;
}

export type RoutingHandlerOptions = Partial<RoutingHandler>;
type RoutingChangeCallback = (state: RequestState) => void;

export default class URLManager {
  history: History;
  lastPushSearchString: string;
  unlisten?: () => void;
  overrides: any;
  routingOptions: RoutingHandler;

  constructor(routingOptions: RoutingHandlerOptions = {}) {
    this.routingOptions = {
      readUrl: routingOptions.readUrl || this.readUrl.bind(this),
      writeUrl: routingOptions.writeUrl || this.writeUrl.bind(this),
      urlToState: routingOptions.urlToState || this.urlToState.bind(this),
      stateToUrl: routingOptions.stateToUrl || this.stateToUrl.bind(this),
      routeChangeHandler:
        routingOptions.routeChangeHandler || this.routeChangeHandler.bind(this)
    };

    this.history =
      typeof window !== "undefined" ? createHistory() : createMemoryHistory();
    this.lastPushSearchString = "";
  }

  /*
   * These functions are used to read and write the URL
   * Its designed to be overriden by the developer for their own 3rd party routing needs.
   * For example developers override this function to use next.js
   *
   **/
  readUrl() {
    return this.history ? this.history.location.search : "";
  }

  writeUrl(url: string, { replaceUrl = false }: { replaceUrl?: boolean } = {}) {
    const navigationFunction = replaceUrl
      ? this.history.replace
      : this.history.push;
    navigationFunction(`?${url}`);
  }

  /*
   * This function is used to convert a URL into a state object and vice versa
   * the state is stored as a search string in the URL.
   * Developers own implementations of this function should be able to handle full urls
   * and not just the search string.
   **/
  urlToState(url: string): RequestState {
    return paramsToState(queryString.parse(url));
  }

  stateToUrl(state: RequestState): string {
    return `${stateToQueryString(state)}`;
  }

  /**
   * Parse the current URL into application state
   *
   * @return {Object} - The parsed state object
   */
  getStateFromURL(): RequestState {
    return this.routingOptions.urlToState(this.routingOptions.readUrl());
  }

  /**
   * Push the current state of the application to the URL
   *
   * @param {Object} state - The entire current state from the SearchDriver
   * @param {boolean} options
   * @param {boolean} options.replaceUrl - When pushing state to the URL, use history 'replace'
   * rather than 'push' to avoid adding a new history entry
   */
  pushStateToURL(
    state: RequestState,
    { replaceUrl = false }: { replaceUrl?: boolean } = {}
  ): void {
    const url = this.routingOptions.stateToUrl(state);
    this.lastPushSearchString = url;
    this.routingOptions.writeUrl(url, { replaceUrl });
  }

  /**
   * Add an event handler to be executed whenever state is pushed to the URL
   *
   * @callback requestCallback
   * @param {Object} state - Updated application state parsed from the new URL
   *
   * @param {requestCallback} callback
   */
  onURLStateChange(callback: RoutingChangeCallback): void {
    const handler = (url) => {
      if (`?${this.lastPushSearchString}` === url) return;

      // Once we've decided to return based on lastPushSearchString, reset
      // it so that we don't break back / forward button.
      this.lastPushSearchString = "";

      callback(this.routingOptions.urlToState(url));
    };

    this.unlisten = this.routingOptions.routeChangeHandler(handler.bind(this));
  }

  routeChangeHandler(callback) {
    const handler = (location) => {
      callback(location.search);
    };
    return this.history.listen(handler);
  }

  tearDown(): void {
    this.unlisten();
  }
}
