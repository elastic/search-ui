import type {
  QueryConfig,
  RequestState,
  ResponseState,
  AutocompleteResponseState,
  APIConnector,
  AutocompleteQueryConfig
} from "@elastic/search-ui";

import handleSearchRequest from "./handlers/search";
import handleAutocompleteRequest from "./handlers/autocomplete";

type ConnectionOptions = {
  host: string;
  index: string;
  apiKey?: string;
};

type SearchConfiguration = {
  queryFields: string[];
};

class ElasticsearchAPIConnector implements APIConnector {
  constructor(
    private config: ConnectionOptions,
    private searchConfig: SearchConfiguration
  ) {}

  onResultClick(): void {
    console.error("not implemented");
  }

  onAutocompleteResultClick(): void {
    console.error("not implemented");
  }

  async onSearch(
    state: RequestState,
    queryConfig: QueryConfig
  ): Promise<ResponseState> {
    return handleSearchRequest({
      state,
      queryConfig,
      host: this.config.host,
      index: this.config.index,
      connectionOptions: {
        apiKey: this.config.apiKey
      },
      queryFields: this.searchConfig.queryFields
    });
  }

  async onAutocomplete(
    state: RequestState,
    queryConfig: AutocompleteQueryConfig
  ): Promise<AutocompleteResponseState> {
    return handleAutocompleteRequest({
      state,
      queryConfig,
      host: this.config.host,
      index: this.config.index,
      connectionOptions: {
        apiKey: this.config.apiKey
      },
      queryFields: this.searchConfig.queryFields
    });
  }
}

export default ElasticsearchAPIConnector;
