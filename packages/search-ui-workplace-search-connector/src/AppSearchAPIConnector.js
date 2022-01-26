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
class WorkplaceSearchAPIConnector {
  constructor({ clientId, redirectUri, endpointBase = "" }) {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.endpointBase = endpointBase;
  }

  async onSearch(state, queryConfig) {
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

    return this.beforeSearchCall(options, async newOptions => {
      const response = await this.client.search(query, newOptions);
      return adaptResponse(response, buildResponseAdapterOptions(queryConfig));
    });
  }
}

export default WorkplaceSearchAPIConnector;
