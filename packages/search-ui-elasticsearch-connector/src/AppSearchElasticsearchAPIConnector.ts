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
import { SearchkitConfig, SearchkitTransporter } from "@searchkit/sdk";

type ConnectionOptions = {
  host: string;
  apiKey?: string;
  engineName: string;
};

class EntSearchProxyTransporter implements SearchkitTransporter {
  constructor(private config: SearchkitConfig, private searchTerm: string) {}

  async performRequest(requestBody): Promise<any> {
    if (!fetch)
      throw new Error("Fetch is not supported in this browser / environment");
    const response = await fetch(
      this.config.host +
        "/api/as/v0/engines/" +
        this.config.index +
        "/elasticsearch/_search",
      {
        method: "POST",
        body: JSON.stringify({
          request: {
            body: requestBody
          },
          analytics: {
            ...(this.searchTerm ? { query: this.searchTerm } : {})
          }
        }),
        headers: {
          "Content-Type": "application/json",
          ...(this.config.connectionOptions?.headers || {}),
          ...(this.config.connectionOptions?.apiKey
            ? {
                Authorization: `Bearer ${this.config.connectionOptions.apiKey}`
              }
            : {})
        }
      }
    );
    const json = await response.json();
    return json;
  }
}

class AppSearchElasticsearchAPIConnector implements APIConnector {
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
      index: this.config.engineName,
      connectionOptions: {
        apiKey: this.config.apiKey
      },
      transport: EntSearchProxyTransporter
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
      index: this.config.engineName,
      connectionOptions: {
        apiKey: this.config.apiKey
      },
      transport: EntSearchProxyTransporter
    });
  }
}

export default AppSearchElasticsearchAPIConnector;
