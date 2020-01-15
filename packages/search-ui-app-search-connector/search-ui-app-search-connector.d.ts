declare module "@elastic/search-ui-app-search-connector" {
  class AppSearchAPIConnector {
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
        queryOptions: object,
        next: (updatedQueryOptions: object) => object
      ) => any;
      beforeAutocompleteResultsCall?: (
        queryOptions: object,
        next: (updatedQueryOptions: object) => object
      ) => any;
      beforeAutocompleteSuggestionsCall?: (
        queryOptions: object,
        next: (updatedQueryOptions: object) => object
      ) => any;
      endpointBase?: string;
    });
  }

  export default AppSearchAPIConnector;
}
