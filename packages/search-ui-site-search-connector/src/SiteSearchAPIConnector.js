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
    const safeDestructureSort = obj => Object.entries(obj || {})[0] || [];

    const { facets, filters, page, sort, ...rest } = searchOptions;
    const [sortField, sortDirection] = safeDestructureSort(sort);
    const updatedFacets = adaptFacetConfig(facets);
    const updatedFilters = adaptFilterConfig(filters);
    return this._request("POST", "engines/search.json", {
      ...rest,
      ...(page &&
        page.size && {
          per_page: page.size
        }),
      ...(page &&
        page.current && {
          page: page.current
        }),
      ...(sortDirection && {
        sort_direction: {
          [this.documentType]: sortDirection
        }
      }),
      ...(sortField && {
        sort_field: {
          [this.documentType]: sortField
        }
      }),
      ...(updatedFacets && {
        facets: {
          [this.documentType]: updatedFacets
        }
      }),
      ...(updatedFilters && {
        filters: {
          [this.documentType]: updatedFilters
        }
      }),
      q: searchTerm
    });
  }
}
