import { toResultList } from "./ResponseAdapter";
import { adaptFacetConfig, adaptFilterConfig } from "./RequestAdapter";

function _request(documentType, engineKey, method, path, params) {
  const headers = new Headers({
    "Content-Type": "application/json"
  });

  return fetch(`https://search-api.swiftype.com/api/v1/public/${path}`, {
    method,
    headers,
    body: JSON.stringify({
      engine_key: engineKey,
      ...params
    }),
    credentials: "include"
  }).then(response => {
    return response.json().then(json => {
      return toResultList(json, documentType);
    });
  });
}

export default class SiteSearchAPIConnector {
  constructor({ documentType, engineKey }) {
    this.documentType = documentType;
    this.engineKey = engineKey;
    this._request = _request.bind(this, documentType, engineKey);
  }

  click() {
    // TODO
  }

  search(searchTerm, searchOptions) {
    const facets = adaptFacetConfig(searchOptions.facets);
    const filters = adaptFilterConfig(searchOptions.filters);
    return this._request("POST", "engines/search.json", {
      ...(facets && {
        facets: {
          [this.documentType]: facets
        }
      }),
      ...(filters && {
        filters: {
          [this.documentType]: filters
        }
      }),
      q: searchTerm
    });
  }
}
