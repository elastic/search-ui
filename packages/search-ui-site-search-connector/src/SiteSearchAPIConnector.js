import { toResultList } from "./responseAdapters";
import {
  adaptFacetConfig,
  adaptFilterConfig,
  adaptResultFieldsConfig,
  adaptSearchFieldsConfig
} from "./requestAdapters";

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

function _request(engineKey, method, path, params) {
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
    return response.json();
  });
}

export default class SiteSearchAPIConnector {
  constructor({ documentType, engineKey, additionalOptions = () => ({}) }) {
    this.documentType = documentType;
    this.engineKey = engineKey;
    this.additionalOptions = additionalOptions;
    this._request = _request.bind(this, engineKey);
    this._get = _get.bind(this, engineKey);
  }

  click({ query, documentId, tags }) {
    if (tags) {
      console.warn("Site Search does not support tags on click");
    }
    this._get("analytics/pc", {
      t: new Date().getTime(),
      q: query,
      doc_id: documentId
    });
  }

  search(searchTerm, searchOptions) {
    const safeDestructureSort = obj => Object.entries(obj || {})[0] || [];
    const {
      facets,
      filters,
      page,
      sort,
      result_fields,
      search_fields,
      ...rest
    } = searchOptions;
    const [sortField, sortDirection] = safeDestructureSort(sort);
    const updatedFacets = adaptFacetConfig(facets);
    const updatedFilters = adaptFilterConfig(filters);
    const [fetchFields, highlightFields] = adaptResultFieldsConfig(
      result_fields
    );
    const updatedSearchFields = adaptSearchFieldsConfig(search_fields);
    const options = {
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
      ...(fetchFields && {
        fetch_fields: {
          [this.documentType]: fetchFields
        }
      }),
      ...(highlightFields && {
        highlight_fields: {
          [this.documentType]: highlightFields
        }
      }),
      ...(updatedSearchFields &&
        !!updatedSearchFields.length && {
          search_fields: {
            [this.documentType]: updatedSearchFields
          }
        }),
      q: searchTerm
    };
    return this._request("POST", "engines/search.json", {
      ...options,
      ...this.additionalOptions(options)
    }).then(json => {
      return toResultList(json, this.documentType);
    });
  }
}
