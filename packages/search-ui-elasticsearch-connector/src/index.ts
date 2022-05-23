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

export { default as AppSearchElasticsearchAPIConnector } from "./AppSearchElasticsearchAPIConnector";

type ConnectionOptions = {
  host: string;
  index: string;
  apiKey?: string;
};

class ElasticsearchAPIConnector implements APIConnector {
  constructor(private config: ConnectionOptions) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onResultClick(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onAutocompleteResultClick(): void {}

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
      }
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
      }
    });
  }
}

export default ElasticsearchAPIConnector;
