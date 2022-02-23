import * as ElasticAppSearch from "@elastic/app-search-javascript";

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

// The API will error out if empty facets or filters objects
// are sent.
function removeEmptyFacetsAndFilters(options) {
  const { facets, filters, ...rest } = options;
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
  beforeSearchCall?: SearchQueryHook;
  beforeAutocompleteResultsCall?: SearchQueryHook;
  beforeAutocompleteSuggestionsCall?: SuggestionsQueryHook;

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
      next(queryOptions),
    ...rest
  }: WorkplaceSearchAPIConnectorParams) {
    if (!kibanaBase || !enterpriseSearchBase || !redirectUri || !clientId) {
      throw Error(
        "Missing a required parameter. Please provide kibanaBase, enterpriseSearchBase, redirectUri, and clientId."
      );
    }

    // TODO: replace with enterprise-search-js client once it's available
    // this.client = ElasticAppSearch.createClient({
    //   ...(endpointBase && { endpointBase }), //Add property on condition
    //   ...(hostIdentifier && { hostIdentifier: hostIdentifier }),
    //   apiKey: searchKey,
    //   engineName: engineName,
    //   ...rest
    // });
    this.beforeSearchCall = beforeSearchCall;
    this.beforeAutocompleteResultsCall = beforeAutocompleteResultsCall;
    this.beforeAutocompleteSuggestionsCall = beforeAutocompleteSuggestionsCall;
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
      ...removeEmptyFacetsAndFilters(withQueryConfigOptions)
    };

    return this.beforeSearchCall(options, async (newOptions) => {
      const response = await this.client.search(query, newOptions);
      return adaptResponse(response, buildResponseAdapterOptions(queryConfig));
    });
  }

  async onAutocomplete(
    { searchTerm }: RequestState,
    queryConfig: AutocompleteQuery
  ): Promise<SearchState> {
    const autocompletedState: any = {};
    const promises = [];

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
      const options = removeEmptyFacetsAndFilters(withQueryConfigOptions);
      promises.push(
        this.beforeAutocompleteResultsCall(options, (newOptions) => {
          return this.client.search(query, newOptions).then((response) => {
            autocompletedState.autocompletedResults =
              adaptResponse(response).results;
            autocompletedState.autocompletedResultsRequestId =
              response.info.meta.request_id;
          });
        })
      );
    }

    if (queryConfig.suggestions) {
      const options = queryConfig.suggestions;

      promises.push(
        this.beforeAutocompleteSuggestionsCall(options, (newOptions) =>
          this.client
            .querySuggestion(searchTerm, newOptions)
            .then((response) => {
              autocompletedState.autocompletedSuggestions = response.results;
              autocompletedState.autocompletedSuggestionsRequestId =
                response.meta.request_id;
            })
        )
      );
    }

    await Promise.all(promises);
    return autocompletedState;
  }
}

export default WorkplaceSearchAPIConnector;
