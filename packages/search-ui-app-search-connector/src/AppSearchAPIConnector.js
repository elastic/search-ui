import * as SwiftypeAppSearch from "swiftype-app-search-javascript";

export default class AppSearchAPIConnector {
  /**
   * @param options Object
   * engineName  - Engine to query, found in your App Search Dashboard
   * hostIdentifier - Credential found in your App Search Dashboard
   * searchKey - Credential found in your App Search Dashboard
   * endpointBase - (optional) Overrides the base of the Swiftype API endpoint
   *   completely. Useful when proxying the Swiftype API or developing against
   *   a local API server.
   */
  constructor({ searchKey, engineName, hostIdentifier, endpointBase = "" }) {
    if (!engineName || !hostIdentifier || !searchKey) {
      throw Error("engineName, hostIdentifier, and searchKey are required");
    }

    this.client = SwiftypeAppSearch.createClient({
      endpointBase,
      hostIdentifier: hostIdentifier,
      apiKey: searchKey,
      engineName: engineName
    });
  }

  click({ query, documentId, requestId, tags }) {
    return this.client.click({ query, documentId, requestId, tags });
  }

  search(searchTerm, searchOptions) {
    if (searchOptions.facets && !Object.keys(searchOptions.facets).length) {
      // Because our API will bomb if these options are empty
      searchOptions.facets = undefined;
    }

    return this.client.search(searchTerm, {
      ...searchOptions
    });
  }
}
