import adaptRequest from "./requestAdapter";
import adaptResponse from "./responseAdapter";
import request from "./request";

function _get(engineKey, path, params) {
  const query = Object.entries({ engine_key: engineKey, ...params })
    .map(([paramName, paramValue]) => {
      return `${paramName}=${encodeURIComponent(paramValue)}`;
    })
    .join("&");

  return fetch(
    `https://search-api.swiftype.com/api/v1/public/${path}?${query}`,
    {
      method: "GET",
      credentials: "include"
    }
  );
}

export default class SiteSearchAPIConnector {
  constructor({ documentType, engineKey, additionalOptions = () => ({}) }) {
    this.documentType = documentType;
    this.engineKey = engineKey;
    this.additionalOptions = additionalOptions;
    this.request = request.bind(this, engineKey);
    this._get = _get.bind(this, engineKey);
  }

  click({ query, documentId, tags }) {
    if (tags) {
      console.warn(
        "search-ui-site-search-connector: Site Search does not support tags on click"
      );
    }
    this._get("analytics/pc", {
      t: new Date().getTime(),
      q: query,
      doc_id: documentId
    });
  }

  autocompleteClick({ query, documentId, tags }) {
    if (tags) {
      console.warn(
        "search-ui-site-search-connector: Site Search does not support tags on autocompleteClick"
      );
    }
    this._get("analytics/pas", {
      t: new Date().getTime(),
      q: query,
      doc_id: documentId
    });
  }

  search(state, queryConfig) {
    const options = adaptRequest(state, queryConfig, this.documentType);

    return this.request("POST", "engines/search.json", {
      ...options,
      ...this.additionalOptions(options)
    }).then(json => {
      return adaptResponse(json, this.documentType);
    });
  }

  async autocomplete({ searchTerm }, queryConfig) {
    if (queryConfig.results) {
      const options = adaptRequest(
        { searchTerm },
        queryConfig.results,
        this.documentType
      );

      return this.request("POST", "engines/suggest.json", {
        ...options,
        ...this.additionalOptions(options)
      }).then(json => {
        return {
          autocompletedResults: adaptResponse(json, this.documentType).results
        };
      });
    }
    if (queryConfig.suggestions) {
      console.warn(
        "search-ui-site-search-connector: Site Search does support query suggestions on autocomplete"
      );
    }
  }
}
