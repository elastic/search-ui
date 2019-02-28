import adaptRequest from "./requestAdapter";
import adaptResponse from "./responseAdapter";

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
    if (response.status === 200) {
      return response.json();
    } else {
      return response
        .json()
        .then(json => {
          const message = json.error || String(response.status);
          throw new Error(message);
        })
        .catch(() => {
          const message = String(response.status);
          throw new Error(message);
        });
    }
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

  search(state, queryConfig) {
    const options = adaptRequest(state, queryConfig, this.documentType);

    return this._request("POST", "engines/search.json", {
      ...options,
      ...this.additionalOptions(options)
    }).then(json => {
      return adaptResponse(json, this.documentType);
    });
  }
}
