import * as ElasticAppSearch from "@elastic/app-search-javascript";
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
class AppSearchAPIConnector {
  /**
   * @callback next
   * @param {Object} updatedQueryOptions The options to send to the API
   * @returns {Object} The API response
   */

  /**
   * Hooks work like middleware. This gives you an opportunity to modify the request and response
   * to for a particular API call.
   *
   * @callback hook
   * @param {Object} queryOptions The options that are about to be sent to the API
   * @param {next} next Callback to continue to make the actual API call
   * @return {Object} The API response, which may or may not have been amended by this hook
   */

  /**
   * @param {Object} options Credential found in your App Search Dashboard
   * @param {string} options.searchKey Credential found in your App Search Dashboard
   * @param {string} options.engineName Engine to query, found in your App Search Dashboard
   * @param {string=} options.hostIdentifier Credential found in your App Search Dashboard. Required only if not using
   * the endpointBase option.
   * @param {hook=} options.beforeSearchCall A hook to amend request or response to API for "onSearch" event.
   * @param {hook=} options.beforeAutocompleteResultsCall A hook to amend request or response to API for a "results"
   * query on an "onAutocomplete" event.
   * @param {hook=} options.beforeAutocompleteSuggestionsCall A hook to amend request or response to API for a "suggestions"
   * query on an "onAutocomplete" event.
   * @param {string=} options.endpointBase Overrides the base of the Swiftype API endpoint completely. Useful
   * for non-SaaS App Search deployments. For example, Elastic Cloud, Self-Managed, or proxying SaaS.
   */
  constructor({
    searchKey,
    engineName,
    hostIdentifier,
    beforeSearchCall = (queryOptions, next) => next(queryOptions),
    beforeAutocompleteResultsCall = (queryOptions, next) => next(queryOptions),
    beforeAutocompleteSuggestionsCall = (queryOptions, next) =>
      next(queryOptions),
    endpointBase = ""
  }) {
    if (!engineName || !(hostIdentifier || endpointBase) || !searchKey) {
      throw Error(
        "hostIdentifier or endpointBase, engineName, and searchKey are required"
      );
    }

    this.client = ElasticAppSearch.createClient({
      ...(endpointBase && { endpointBase }), //Add property on condition
      ...(hostIdentifier && { hostIdentifier: hostIdentifier }),
      apiKey: searchKey,
      engineName: engineName,
      additionalHeaders: {
        "x-swiftype-integration": "search-ui",
        "x-swiftype-integration-version": version
      }
    });
    this.beforeSearchCall = beforeSearchCall;
    this.beforeAutocompleteResultsCall = beforeAutocompleteResultsCall;
    this.beforeAutocompleteSuggestionsCall = beforeAutocompleteSuggestionsCall;
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
      ...removeEmptyFacetsAndFilters(withQueryConfigOptions)
    };

    return this.beforeSearchCall(options, async newOptions => {
      const response = await this.client.search(query, newOptions);
      return adaptResponse(response, buildResponseAdapterOptions(queryConfig));
    });
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
      const options = removeEmptyFacetsAndFilters(withQueryConfigOptions);
      promises.push(
        this.beforeAutocompleteResultsCall(options, newOptions => {
          return this.client.search(query, newOptions).then(response => {
            autocompletedState.autocompletedResults = adaptResponse(
              response
            ).results;
            autocompletedState.autocompletedResultsRequestId =
              response.info.meta.request_id;
          });
        })
      );
    }

    if (queryConfig.suggestions) {
      const options = queryConfig.suggestions;

      promises.push(
        this.beforeAutocompleteSuggestionsCall(options, newOptions =>
          this.client.querySuggestion(searchTerm, newOptions).then(response => {
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

export default AppSearchAPIConnector;
