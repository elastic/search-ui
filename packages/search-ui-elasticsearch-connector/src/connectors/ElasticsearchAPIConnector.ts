import type {
  APIConnector,
  AutocompleteQueryConfig,
  AutocompleteResponseState,
  QueryConfig,
  RequestState,
  ResponseState
} from "@elastic/search-ui";
import { PostProcessRequestBodyFn, ConnectionOptions } from "../types";
import handleSearchRequest from "../handlers/search";
import handleAutocompleteRequest from "../handlers/autocomplete";
import { QueryManager } from "../ElasticsearchQueryTransformer/QueryManager";

export default class ElasticsearchAPIConnector implements APIConnector {
  private queryManager: QueryManager;

  constructor(
    private config: ConnectionOptions,
    private postProcessRequestBodyFn?: PostProcessRequestBodyFn
  ) {
    if (!config.host && !config.cloud) {
      throw new Error("Either host or cloud configuration must be provided");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onResultClick(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onAutocompleteResultClick(): void {}

  getQueryManager(state: RequestState, queryConfig: QueryConfig): QueryManager {
    return new QueryManager(state, queryConfig);
  }

  async onSearch(
    state: RequestState,
    queryConfig: QueryConfig
  ): Promise<ResponseState> {
    const queryManager = this.getQueryManager(state, queryConfig);

    return handleSearchRequest(
      {
        state,
        queryConfig,
        cloud: this.config.cloud,
        host: this.config.host,
        index: this.config.index,
        connectionOptions: {
          apiKey: this.config.apiKey,
          headers: this.config.connectionOptions?.headers
        },
        postProcessRequestBodyFn: this.postProcessRequestBodyFn
      },
      queryManager
    );
  }

  async onAutocomplete(
    state: RequestState,
    queryConfig: AutocompleteQueryConfig
  ): Promise<AutocompleteResponseState> {
    return handleAutocompleteRequest({
      state,
      queryConfig,
      cloud: this.config.cloud,
      host: this.config.host,
      index: this.config.index,
      connectionOptions: {
        apiKey: this.config.apiKey,
        headers: this.config.connectionOptions?.headers
      }
    });
  }
}
