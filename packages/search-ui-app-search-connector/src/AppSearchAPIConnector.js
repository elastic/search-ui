import * as SwiftypeAppSearch from "swiftype-app-search-javascript";

import { adaptResponse } from "./responseAdapter";
import { adaptRequest } from "./requestAdapters";

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

  click({ query, documentId, requestId, tags }) {
    return this.client.click({ query, documentId, requestId, tags });
  }

  // TODO - What about errors
  async search(state) {
    // if (searchOptions.facets && !Object.keys(searchOptions.facets).length) {
    //   // Because our API will bomb if these options are empty
    //   searchOptions.facets = undefined;
    // }

    // const { filters, ...otherOptions } = searchOptions;

    const { query, ...options } = adaptRequest(state);

    // TODO
    // ...otherOptions,
    // ...this.additionalOptions(searchOptions)
    const response = await this.client.search(query, options);
    return adaptResponse(response);
  }
}
