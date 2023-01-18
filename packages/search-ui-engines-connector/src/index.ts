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
  engineName: string;
  apiKey: string;
};

export * from "./types";

class EngineConnector implements APIConnector {
  constructor(private config: ConnectionOptions) {
    if (!config.host) {
      throw new Error("Engine Host must be provided.");
    }
    if (!config.engineName) {
      throw new Error("Engine Name must be provided.");
    }
    if (!config.apiKey) {
      throw new Error("API Key must be provided.");
    }
  }

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
      engineName: this.config.engineName,
      apiKey: this.config.apiKey
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
      engineName: this.config.engineName,
      apiKey: this.config.apiKey
    });
  }
}

export default EngineConnector;
