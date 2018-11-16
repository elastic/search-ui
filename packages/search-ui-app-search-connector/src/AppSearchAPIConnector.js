import * as SwiftypeAppSearch from "swiftype-app-search-javascript";

/*
 * We simply pass our Facet configuration through to the App Search API
 * call. There are, however, certain properties that the API does not
 * support in that configuration. For that reason, we need to filter
 * those properties out before passing them to the API.
 *
 * An example is 'disjunctive', and 'conditional'.
 */
function toAPIFacetSyntax(facetConfig = {}) {
  return Object.entries(facetConfig).reduce((acc, [key, value]) => {
    acc[key] = Object.entries(value).reduce((propAcc, [propKey, propValue]) => {
      if (!["disjunctive", "conditional"].includes(propKey)) {
        propAcc[propKey] = propValue;
      }
      return propAcc;
    }, {});
    return acc;
  }, {});
}

/*
 * 'disjunctive' flags are embedded in individual facet configurations, like
 * so:
 *
 * facets
 */
function getListOfDisjunctiveFacets(facetConfig = {}) {
  return Object.entries(facetConfig).reduce((acc, [key, value]) => {
    if (value && value.disjunctive === true) {
      return acc.concat(key);
    }
    return acc;
  }, []);
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
    const disjunctiveFacets = getListOfDisjunctiveFacets(searchOptions.facets);

    if (searchOptions.facets && !Object.keys(searchOptions.facets).length) {
      // Because our API will bomb if these options are empty
      searchOptions.facets = undefined;
    }
    if (searchOptions.facets) {
      searchOptions.facets = toAPIFacetSyntax(searchOptions.facets);
    }

    return this.client.search(searchTerm, {
      ...searchOptions,
      ...(disjunctiveFacets.length && { disjunctiveFacets })
    });
  }
}
