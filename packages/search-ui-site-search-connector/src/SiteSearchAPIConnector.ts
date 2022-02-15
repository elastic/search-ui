import adaptRequest from "./requestAdapter";
import adaptResponse from "./responseAdapter";
import request from "./request";
import type { RequestState } from "@elastic/search-ui";
import type {
  SearchQueryHook,
  SiteSearchAPIConnectorParams,
  SiteSearchQueryConfig
} from "./types";

function _get(engineKey: string, path: string, params: Record<string, any>) {
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

class SiteSearchAPIConnector {
  /**
   * @callback next
   * @param {Object} updatedQueryOptions The options to send to the API
   */

  /**
   * @callback hook
   * @param {Object} queryOptions The options that are about to be sent to the API
   * @param {next} next The options that are about to be sent to the API
   */

  /**
   * @typedef Options
   * @param  {string} documentType Document Type found in your Site Search Dashboard
   * @param  {string} engineKey Credential found in your Site Search Dashboard
   * @param  {hook} beforeSearchCall=(queryOptions,next)=>next(queryOptions) A hook to amend query options before the request is sent to the
   *   API in a query on an "onSearch" event.
   * @param  {hook} beforeAutocompleteResultsCall=(queryOptions,next)=>next(queryOptions) A hook to amend query options before the request is sent to the
   *   API in a "results" query on an "onAutocomplete" event.
   */

  /**
   * @param {Options} options
   */

  _get: (path: string, params: Record<string, any>) => Promise<Response>;
  request: (
    method: string,
    path: string,
    params: Record<string, any>
  ) => Promise<any>;
  beforeAutocompleteResultsCall: SearchQueryHook;
  documentType: string;
  engineKey: string;
  beforeSearchCall: SearchQueryHook;

  constructor({
    documentType,
    engineKey,
    beforeSearchCall = (queryOptions, next) => next(queryOptions),
    beforeAutocompleteResultsCall = (queryOptions, next) => next(queryOptions)
  }: SiteSearchAPIConnectorParams) {
    this.documentType = documentType;
    this.engineKey = engineKey;
    this.beforeSearchCall = beforeSearchCall;
    this.beforeAutocompleteResultsCall = beforeAutocompleteResultsCall;
    this.request = request.bind(this, engineKey);
    this._get = _get.bind(this, engineKey);
  }

  onResultClick({
    query,
    documentId,
    tags
  }: {
    query: string;
    documentId: string;
    tags: string[];
  }) {
    if (tags && tags.length > 0) {
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

  onAutocompleteResultClick({
    query,
    documentId,
    tags
  }: {
    query: string;
    documentId: string;
    tags: string[];
  }) {
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

  onSearch(requestState: RequestState, queryConfig: SiteSearchQueryConfig) {
    const options = adaptRequest(requestState, queryConfig, this.documentType);

    return this.beforeSearchCall(options, (newOptions) =>
      this.request("POST", "engines/search.json", newOptions).then((json) =>
        adaptResponse(json, this.documentType)
      )
    );
  }

  async onAutocomplete(
    { searchTerm }: { searchTerm: string },
    queryConfig: { results?: SiteSearchQueryConfig; [key: string]: any }
  ) {
    if (queryConfig.results) {
      const options = adaptRequest(
        { searchTerm },
        queryConfig.results,
        this.documentType
      );

      return this.beforeAutocompleteResultsCall(options, (newOptions) =>
        this.request("POST", "engines/suggest.json", newOptions).then(
          (json) => ({
            autocompletedResults: adaptResponse(json, this.documentType).results
          })
        )
      );
    }
    if (queryConfig.suggestions) {
      console.warn(
        "search-ui-site-search-connector: Site Search does support query suggestions on autocomplete"
      );
    }
  }
}

export default SiteSearchAPIConnector;
