import type {
  QueryConfig,
  RequestState,
  SearchState,
  AutocompleteQuery
} from "@elastic/search-ui";

type ServerAPIConnectorConfig = {
  apiUrl: string;
};

class APIElasticsearchServerConnector {
  constructor(private config: ServerAPIConnectorConfig) {}

  onResultClick(): void {
    console.error("not implemented");
  }

  onAutocompleteResultClick(): void {
    console.error("not implemented");
  }

  async onSearch(
    state: RequestState,
    queryConfig: QueryConfig
  ): Promise<SearchState> {
    const response = await fetch(this.config.apiUrl + "/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        state,
        queryConfig
      })
    });

    const json = await response.json();

    return json;
  }

  async onAutocomplete(
    state: RequestState,
    queryConfig: AutocompleteQuery
  ): Promise<SearchState> {
    const response = await fetch(this.config.apiUrl + "/autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        state,
        queryConfig
      })
    });

    const json = await response.json();

    return json;
  }
}

export default APIElasticsearchServerConnector;
