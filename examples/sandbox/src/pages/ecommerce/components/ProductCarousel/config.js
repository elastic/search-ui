import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

const connector = new AppSearchAPIConnector({
  searchKey: "search-nyxkw1fuqex9qjhfvatbqfmw",
  engineName: "best-buy",
  endpointBase: "https://search-ui-sandbox.ent.us-central1.gcp.cloud.es.io"
});

export const config = (filters) => ({
  alwaysSearchOnInitialLoad: true,
  trackUrlState: false,
  initialState: {
    resultsPerPage: 8
  },
  searchQuery: {
    filters,
    result_fields: {
      name: {
        raw: {}
      },
      image: { raw: {} },
      url: { raw: {} }
    }
  },
  apiConnector: connector
});
