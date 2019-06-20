import * as SwiftypeAppSearch from "swiftype-app-search-javascript";
import { version } from "../package.json";

import { adaptResponse } from "./responseAdapter";
import { adaptRequest } from "./requestAdapters";
import buildResponseAdapterOptions from "./buildResponseAdapterOptions";

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
export default class AppSearchAPIConnector {
  /**
   * @callback hook
   * @param {Object} queryOptions - The options that are about to be sent to the API
   *
   * @typedef Options
   * @property {string} engineName - Engine to query, found in your App Search Dashboard
   * @property {string} hostIdentifier - Credential found in your App Search Dashboard
   * @property {string} searchKey - Credential found in your App Search Dashboard
   * @property {string} [endpointBase] - Overrides the base of the Swiftype API endpoint completely.
   *  Useful when proxying the Swiftype API or developing against a local API server.
   * @property {hook} [beforeSearchCall] - A hook to amend query options before the request is sent to the
   *   API in a query on an "onSearch" event.
   * @property {hook} [beforeAutocompleteResultsCall] - A hook to amend query options before the request is sent to the
   *   API in a "results" query on an "onAutocomplete" event.
   *
   * @param {Options} options
   */
  constructor({
    searchKey,
    engineName,
    hostIdentifier,
    beforeSearchCall = queryOptions => queryOptions,
    beforeAutocompleteResultsCall = queryOptions => queryOptions,
    endpointBase = ""
  }) {
    if (!engineName || !hostIdentifier || !searchKey) {
      throw Error("engineName, hostIdentifier, and searchKey are required");
    }

    this.client = SwiftypeAppSearch.createClient({
      endpointBase,
      hostIdentifier: hostIdentifier,
      apiKey: searchKey,
      engineName: engineName,
      additionalHeaders: {
        "x-swiftype-integration": "search-ui",
        "x-swiftype-integration-version": version
      }
    });
    this.beforeSearchCall = beforeSearchCall;
    this.beforeAutocompleteResultsCall = beforeAutocompleteResultsCall;
  }

  onResultClick({ query, documentId, requestId, tags = [] }) {
    tags = tags.concat("results");
    return this.client.click({ query, documentId, requestId, tags });
  }

  onAutocompleteResultClick({ query, documentId, requestId, tags = [] }) {
    tags = tags.concat("autocomplete");
    return this.client.click({ query, documentId, requestId, tags });
  }

  async onSearch(state, queryConfig) {
    const {
      current,
      filters,
      resultsPerPage,
      sortDirection,
      sortField,
      ...restOfQueryConfig
    } = queryConfig;

    const { query, ...optionsFromState } = adaptRequest({
      ...state,
      ...(current !== undefined && { current }),
      ...(filters !== undefined && { filters }),
      ...(resultsPerPage !== undefined && { resultsPerPage }),
      ...(sortDirection !== undefined && { sortDirection }),
      ...(sortField !== undefined && { sortField })
    });

    const withQueryConfigOptions = {
      ...restOfQueryConfig,
      ...optionsFromState
    };
    const options = {
      ...this.beforeSearchCall(
        removeEmptyFacetsAndFilters(withQueryConfigOptions)
      )
    };

    const response = await this.client.search(query, options);
    return adaptResponse(response, buildResponseAdapterOptions(queryConfig));
  }

  async onAutocomplete({ searchTerm }, queryConfig) {
    const autocompletedState = {};
    let promises = [];

    if (queryConfig.results) {
      const {
        current,
        filters,
        resultsPerPage,
        sortDirection,
        sortField,
        ...restOfQueryConfig
      } = queryConfig.results;

      const { query, ...optionsFromState } = adaptRequest({
        current,
        searchTerm,
        filters,
        resultsPerPage,
        sortDirection,
        sortField
      });

      const withQueryConfigOptions = {
        ...restOfQueryConfig,
        ...optionsFromState
      };
      const options = {
        ...this.beforeAutocompleteResultsCall(
          removeEmptyFacetsAndFilters(withQueryConfigOptions)
        )
      };

      promises.push(
        this.client.search(query, options).then(response => {
          autocompletedState.autocompletedResults = adaptResponse(
            response
          ).results;
          autocompletedState.autocompletedResultsRequestId =
            response.info.meta.request_id;
        })
      );
    }

    if (queryConfig.suggestions) {
      promises.push(
        this.client
          .querySuggestion(searchTerm, queryConfig.suggestions)
          .then(response => {
            autocompletedState.autocompletedSuggestions = response.results;
            autocompletedState.autocompletedSuggestionsRequestId =
              response.meta.request_id;
          })
      );
    }

    await Promise.all(promises);
    return autocompletedState;
  }
}
