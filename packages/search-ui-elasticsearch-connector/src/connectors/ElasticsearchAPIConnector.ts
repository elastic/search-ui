import type {
  APIConnector,
  AutocompleteQueryConfig,
  AutocompleteResponseState,
  QueryConfig,
  RequestState,
  ResponseState
} from "@elastic/search-ui";
import {
  PostProcessRequestBodyFn,
  ConnectionOptions,
  RequestModifiers,
  SearchQueryHook
} from "../types";
import {
  ApiClientTransporter,
  type IApiClientTransporter
} from "../transporter/ApiClientTransporter";
import { handleAutocomplete } from "../handlers/handleAutocomplete";
import { handleSearch } from "../handlers/handleSearch";

export default class ElasticsearchAPIConnector implements APIConnector {
  private apiClient: IApiClientTransporter;
  private beforeSearchCall?: SearchQueryHook;
  private getQueryFn?: RequestModifiers["getQueryFn"];
  private beforeAutocompleteResultsCall?: SearchQueryHook;
  private beforeAutocompleteSuggestionsCall?: SearchQueryHook;

  constructor(
    config: ConnectionOptions & RequestModifiers,
    /**
     * @deprecated Use `config.beforeSearchCall` instead
     */
    private postProcessRequestBodyFn?: PostProcessRequestBodyFn
  ) {
    if (!config.apiClient && !config.host && !config.cloud) {
      throw new Error(
        "Either host or cloud configuration or custom apiClient must be provided"
      );
    }

    if (postProcessRequestBodyFn) {
      console.warn(
        "[Search UI] `postProcessRequestBodyFn` is deprecated. Please use `beforeSearchCall` instead."
      );
    }

    this.apiClient = config.apiClient || new ApiClientTransporter(config);
    this.beforeSearchCall = config.beforeSearchCall;
    this.getQueryFn = config.getQueryFn;
    this.beforeAutocompleteResultsCall = config.beforeAutocompleteResultsCall;
    this.beforeAutocompleteSuggestionsCall =
      config.beforeAutocompleteSuggestionsCall;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onResultClick(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onAutocompleteResultClick(): void {}

  async onSearch(
    state: RequestState,
    queryConfig: QueryConfig
  ): Promise<ResponseState> {
    return handleSearch(
      state,
      queryConfig,
      this.apiClient,
      this.beforeSearchCall,
      this.getQueryFn,
      this.postProcessRequestBodyFn
    );
  }

  async onAutocomplete(
    state: RequestState,
    queryConfig: AutocompleteQueryConfig
  ): Promise<AutocompleteResponseState> {
    return handleAutocomplete(state, queryConfig, this.apiClient);
  }
}
