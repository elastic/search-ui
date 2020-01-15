declare module "@elastic/search-ui-app-search-connector" {
  class AppSearchAPIConnector {
    /**
     * @typedef {Object.<string, *>} KeyValuePairs
     */
    /**
     * @callback next
     * @param {KeyValuePairs} updatedQueryOptions The options to send to the API
     * @returns {Object} The response
     */
    /**
     * @callback hook
     * @param {KeyValuePairs} queryOptions The options that are about to be sent to the API
     * @param {next} next The options that are about to be sent to the API
     */
    /**
     * @param {Object} options Credential found in your App Search Dashboard
     * @param {string} options.searchKey Credential found in your App Search Dashboard
     * @param {string} options.engineName Engine to query, found in your App Search Dashboard
     * @param {string=} options.hostIdentifier Credential found in your App Search Dashboard. Required only if not using
     * the endpointBase option.
     * @param {hook=} options.beforeSearchCall A hook to amend request or response to API for "onSearch" event.
     * @param {hook=} options.beforeAutocompleteResultsCall A hook to amend request or response to API for a "results"
     * query on an "onAutocomplete" event.
     * @param {hook=} options.beforeAutocompleteSuggestionsCall A hook to amend request or response to API for a "suggestions"
     * query on an "onAutocomplete" event.
     * @param {string=} options.endpointBase="" Overrides the base of the Swiftype API endpoint completely. Useful
     * for non-SaaS App Search deployments. For example, Elastic Cloud, Self-Managed, or proxying SaaS.
     */
    constructor({
      searchKey,
      engineName,
      hostIdentifier,
      beforeSearchCall,
      beforeAutocompleteResultsCall,
      beforeAutocompleteSuggestionsCall,
      endpointBase
    }: {
      searchKey: string;
      engineName: string;
      hostIdentifier?: string;
      beforeSearchCall?: (
        queryOptions: {
          [x: string]: any;
        },
        next: (updatedQueryOptions: { [x: string]: any }) => any
      ) => any;
      beforeAutocompleteResultsCall?: (
        queryOptions: {
          [x: string]: any;
        },
        next: (updatedQueryOptions: { [x: string]: any }) => any
      ) => any;
      beforeAutocompleteSuggestionsCall?: (
        queryOptions: {
          [x: string]: any;
        },
        next: (updatedQueryOptions: { [x: string]: any }) => any
      ) => any;
      endpointBase?: string;
    });
  }

  export default AppSearchAPIConnector;
}
