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
import { ConnectionOptions, Transporter } from "./types";
import { EngineTransporter } from "./handlers/transporter";
export * from "./types";

function isTransporter(
  config: ConnectionOptions | Transporter
): config is Transporter {
  return (config as Transporter).performRequest !== undefined;
}

class EngineConnector implements APIConnector {
  private transporter: Transporter;
  constructor(private config: ConnectionOptions | Transporter) {
    if (isTransporter(config)) {
      this.transporter = config;
    } else {
      if (!config.host) {
        throw new Error("Engine Host must be provided.");
      }
      if (!config.engineName) {
        throw new Error("Engine Name must be provided.");
      }
      if (!config.apiKey) {
        throw new Error("API Key must be provided.");
      }
      const { host, engineName, apiKey } = config;
      this.transporter = new EngineTransporter(host, engineName, apiKey);
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
      transporter: this.transporter
    });
  }

  async onAutocomplete(
    state: RequestState,
    queryConfig: AutocompleteQueryConfig
  ): Promise<AutocompleteResponseState> {
    return handleAutocompleteRequest({
      state,
      queryConfig,
      transporter: this.transporter
    });
  }
}

export default EngineConnector;
