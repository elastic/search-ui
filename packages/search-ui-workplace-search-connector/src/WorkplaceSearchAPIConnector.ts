import queryString from "query-string";
import { adaptResponse } from "./responseAdapter";
import { adaptRequest } from "./requestAdapters";
import buildResponseAdapterOptions from "./buildResponseAdapterOptions";
import type {
  QueryConfig,
  RequestState,
  SearchState,
  AutocompleteQuery,
  SuggestionsQueryConfig
} from "@elastic/search-ui";
import { INVALID_CREDENTIALS } from "@elastic/search-ui";

export type WorkplaceSearchAPIConnectorParams = {
  kibanaBase: string;
  enterpriseSearchBase: string;
  redirectUri: string;
  clientId: string;
  beforeSearchCall?: SearchQueryHook;
  beforeAutocompleteResultsCall?: SearchQueryHook;
  beforeAutocompleteSuggestionsCall?: SuggestionsQueryHook;
};

interface ResultClickParams {
  query: string;
  documentId: string;
  requestId: string;
  tags: string[];
}

export type SearchQueryHook = (
  queryOptions: QueryConfig,
  next: (newQueryOptions: any) => any
) => any;
export type SuggestionsQueryHook = (
  queryOptions: SuggestionsQueryConfig,
  next: (newQueryOptions: any) => any
) => any;

// The API will error out if empty facets or filters objects are sent,
// or if disjunctiveFacets or disjunctiveFacetsAnalyticsTags are sent.
function removeInvalidFields(options) {
  const {
    facets,
    filters,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    disjunctiveFacets,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    disjunctiveFacetsAnalyticsTags,
    ...rest
  } = options;

  if (disjunctiveFacets) {
    console.warn(
      "search-ui-workplace-search-connector: disjunctiveFacets are not supported by Workplace Search"
    );
  }

  if (disjunctiveFacetsAnalyticsTags) {
    console.warn(
      "search-ui-workplace-search-connector: disjunctiveFacetsAnalyticsTags are not supported by Workplace Search"
    );
  }

  return {
    ...(facets && Object.entries(facets).length > 0 && { facets }),
    ...(filters && Object.entries(filters).length > 0 && { filters }),
    ...rest
  };
}

class WorkplaceSearchAPIConnector {
  /**
   * @callback next
   * @param {Object} updatedQueryOptions The options to send to the API
   */

  /**
   * @callback hook
   * @param {Object} queryOptions The options that are about to be sent to the API
   * @param {next} next The options that are about to be sent to the API
   */

  /**
   * @typedef Options
   * @param {hook} beforeSearchCall=(queryOptions,next)=>next(queryOptions) A hook to amend query options before the request is sent to the
   *   API in a query on an "onSearch" event.
   * @param {hook} beforeAutocompleteResultsCall=(queryOptions,next)=>next(queryOptions) A hook to amend query options before the request is sent to the
   *   API in a "results" query on an "onAutocomplete" event.
   * @param {hook} beforeAutocompleteSuggestionsCall=(queryOptions,next)=>next(queryOptions) A hook to amend query options before the request is sent to
   * the API in a "suggestions" query on an "onAutocomplete" event.
   */

  client: any;
  enterpriseSearchBase: string;
  beforeSearchCall?: SearchQueryHook;
  beforeAutocompleteResultsCall?: SearchQueryHook;
  beforeAutocompleteSuggestionsCall?: SuggestionsQueryHook;
  state: {
    authorizeUrl: string;
    isLoggedIn: boolean;
  };

  /**
   * @param {Options} options
   */
  constructor({
    kibanaBase,
    enterpriseSearchBase,
    redirectUri,
    clientId,
    beforeSearchCall = (queryOptions, next) => next(queryOptions),
    beforeAutocompleteResultsCall = (queryOptions, next) => next(queryOptions),
    beforeAutocompleteSuggestionsCall = (queryOptions, next) =>
      next(queryOptions)
  }: WorkplaceSearchAPIConnectorParams) {
    if (!kibanaBase || !enterpriseSearchBase || !redirectUri || !clientId) {
      throw Error(
        "Missing a required parameter. Please provide kibanaBase, enterpriseSearchBase, redirectUri, and clientId."
      );
    }

    const authorizeUrl = `${kibanaBase}/app/enterprise_search/workplace_search/p/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token`;

    // There are 3 ways the initial load might happen:
    // 1) First load: there is no accessToken in localStorage
    // 2) Second+ load: there is an accessToken in localStorage
    // 3) Returning from OAuth: the new accessToken is in the URL, the old one is not relevant anymore

    // First, we get the accessToken from the URL
    const parsedUrlHash = queryString.parse(window.location.hash);
    const accessTokenFromUrl = Array.isArray(parsedUrlHash.access_token)
      ? "" // we don't expect multiple access tokens
      : parsedUrlHash.access_token;
    // TODO: maybe clear the URL afterwards?

    // If access_token is in url, that means we're returning from OAuth, so we add new accessToken to localStorage
    if (accessTokenFromUrl) {
      this.accessToken = accessTokenFromUrl;
    }

    // Now we can work with only localStorage
    // Setting loggedIn based on whether we have an accessToken there
    this.state = {
      authorizeUrl,
      isLoggedIn: !!this.accessToken || false
    };

    this.enterpriseSearchBase = enterpriseSearchBase;
    this.beforeSearchCall = beforeSearchCall;
    this.beforeAutocompleteResultsCall = beforeAutocompleteResultsCall;
    this.beforeAutocompleteSuggestionsCall = beforeAutocompleteSuggestionsCall;
  }

  // get accessToken from localStorage
  get accessToken() {
    return localStorage.getItem("SearchUIWorkplaceSearchAccessToken");
  }

  // save accessToken to localStorage
  set accessToken(token) {
    if (token) {
      localStorage.setItem("SearchUIWorkplaceSearchAccessToken", token);
    } else {
      localStorage.removeItem("SearchUIWorkplaceSearchAccessToken");
    }
  }

  onResultClick({
    query,
    documentId,
    requestId,
    tags = []
  }: ResultClickParams): void {
    tags = tags.concat("results");
    return this.client.click({ query, documentId, requestId, tags });
  }

  onAutocompleteResultClick({
    query,
    documentId,
    requestId,
    tags = []
  }: ResultClickParams): void {
    tags = tags.concat("autocomplete");
    return this.client.click({ query, documentId, requestId, tags });
  }

  async onSearch(
    state: RequestState,
    queryConfig: QueryConfig
  ): Promise<SearchState> {
    // Do not perform a search if not logged in
    if (!this.state.isLoggedIn) {
      return Promise.reject(new Error(INVALID_CREDENTIALS));
    }

    const {
      current,
      filters,
      resultsPerPage,
      sortDirection,
      sortField,
      sortList,
      ...restOfQueryConfig
    } = queryConfig;

    const { query, ...optionsFromState } = adaptRequest({
      ...state,
      ...(current !== undefined && { current }),
      ...(filters !== undefined && { filters }),
      ...(resultsPerPage !== undefined && { resultsPerPage }),
      ...(sortDirection !== undefined && { sortDirection }),
      ...(sortField !== undefined && { sortField }),
      ...(sortList !== undefined && { sortList })
    });

    const withQueryConfigOptions = {
      ...restOfQueryConfig,
      ...optionsFromState
    };
    const options = {
      ...removeInvalidFields(withQueryConfigOptions)
    };

    return this.beforeSearchCall(options, async (newOptions) => {
      const searchResponse = await fetch(
        `${this.enterpriseSearchBase}/api/ws/v1/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.accessToken}`
          },
          body: JSON.stringify({
            query,
            ...newOptions
          })
        }
      );

      if (searchResponse.status === 401) {
        this.state.isLoggedIn = false; // Remove the token to trigger the Log in dialog
        throw new Error(INVALID_CREDENTIALS);
      }

      const responseJson = await searchResponse.json();

      // const response = await this.client.search(query, newOptions);
      return adaptResponse(
        responseJson,
        buildResponseAdapterOptions(queryConfig)
      );
    });
  }

  async onAutocomplete(
    { searchTerm }: RequestState,
    queryConfig: AutocompleteQuery
  ): Promise<SearchState> {
    const autocompletedState: any = {};

    if (queryConfig.suggestions) {
      console.warn(
        "search-ui-workplace-search-connector: Workplace Search does support query suggestions on autocomplete"
      );
    }

    if (queryConfig.results) {
      const {
        current,
        filters,
        resultsPerPage,
        sortDirection,
        sortField,
        sortList,
        ...restOfQueryConfig
      } = queryConfig.results;

      const { query, ...optionsFromState } = adaptRequest({
        current,
        searchTerm,
        filters,
        resultsPerPage,
        sortDirection,
        sortField,
        sortList
      });

      const withQueryConfigOptions = {
        ...restOfQueryConfig,
        ...optionsFromState
      };

      const options = removeInvalidFields(withQueryConfigOptions);

      this.beforeAutocompleteResultsCall(options, async (newOptions) => {
        const searchResponse = await fetch(
          `${this.enterpriseSearchBase}/api/ws/v1/search`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.accessToken}`
            },
            body: JSON.stringify({
              query,
              ...newOptions
            })
          }
        );

        const responseJson = await searchResponse.json();

        autocompletedState.autocompletedResults =
          adaptResponse(responseJson).results;
        autocompletedState.autocompletedResultsRequestId =
          responseJson.meta.request_id;
      });
    }

    return autocompletedState;
  }
}

export default WorkplaceSearchAPIConnector;
