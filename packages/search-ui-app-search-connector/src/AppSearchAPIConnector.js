import * as SwiftypeAppSearch from "swiftype-app-search-javascript";

import { adaptResponse } from "./responseAdapter";
import { adaptRequest } from "./requestAdapters";

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
   * @param options Object
   * engineName  - Engine to query, found in your App Search Dashboard
   * hostIdentifier - Credential found in your App Search Dashboard
   * searchKey - Credential found in your App Search Dashboard
   * endpointBase - (optional) Overrides the base of the Swiftype API endpoint
   *   completely. Useful when proxying the Swiftype API or developing against
   *   a local API server.
   * additionalOptions - (optional) Append additional options / parameter to the
   *   request before sending to the API.
   */
  constructor({
    searchKey,
    engineName,
    hostIdentifier,
    additionalOptions = () => ({}),
    endpointBase = ""
  }) {
    if (!engineName || !hostIdentifier || !searchKey) {
      throw Error("engineName, hostIdentifier, and searchKey are required");
    }

    this.client = SwiftypeAppSearch.createClient({
      endpointBase,
      hostIdentifier: hostIdentifier,
      apiKey: searchKey,
      engineName: engineName
    });
    this.additionalOptions = additionalOptions;
  }

  click({ query, documentId, requestId, tags = [] }) {
    tags = tags.concat("results");
    return this.client.click({ query, documentId, requestId, tags });
  }

  autocompleteClick({ query, documentId, requestId, tags = [] }) {
    tags = tags.concat("autocomplete");
    return this.client.click({ query, documentId, requestId, tags });
  }

  async search(state, queryConfig) {
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
      ...removeEmptyFacetsAndFilters(withQueryConfigOptions),
      ...this.additionalOptions(withQueryConfigOptions)
    };

    const response = await this.client.search(query, options);
    return adaptResponse(response);
  }

  async autocomplete({ searchTerm }, queryConfig) {
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
        ...removeEmptyFacetsAndFilters(withQueryConfigOptions),
        ...this.additionalOptions(withQueryConfigOptions)
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
