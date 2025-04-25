import type {
  APIConnector,
  AutocompleteQueryConfig,
  AutocompleteResponseState,
  QueryConfig,
  RequestState,
  ResponseState
} from "@elastic/search-ui";
import { PostProcessRequestBodyFn, ConnectionOptions } from "../types";
import { ApiClientTransporter } from "../transporter/ApiClientTransporter";
import { handleAutocomplete } from "../handlers/handleAutocomplete";
import { handleSearch } from "../handlers/handleSearch";

export default class ElasticsearchAPIConnector implements APIConnector {
  private apiClient: ApiClientTransporter;

  constructor(
    private config: ConnectionOptions,
    private postProcessRequestBodyFn?: PostProcessRequestBodyFn
  ) {
    if (!config.host && !config.cloud) {
      throw new Error("Either host or cloud configuration must be provided");
    }

    this.apiClient = new ApiClientTransporter(config);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onResultClick(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onAutocompleteResultClick(): void {}

  async onSearch(
    state: RequestState,
    queryConfig: QueryConfig
  ): Promise<ResponseState> {
    return handleSearch(state, queryConfig, this.apiClient);
  }

  async onAutocomplete(
    state: RequestState,
    queryConfig: AutocompleteQueryConfig
  ): Promise<AutocompleteResponseState> {
    return handleAutocomplete(state, queryConfig, this.apiClient);
  }
}
