import type {
  APIConnector,
  AutocompleteQueryConfig,
  AutocompleteResponseState,
  QueryConfig,
  RequestState,
  ResponseState
} from "@elastic/search-ui";
import { PostProcessRequestBodyFn, ConnectionOptions } from "../types";
import handleAutocompleteRequest from "../handlers/autocomplete";
import { QueryManager } from "../ElasticsearchQueryTransformer/QueryManager";
import { ApiClientTransporter } from "../ElasticsearchQueryTransformer/ApiClient";
import { transformResponse } from "../handlers/search/Response";
import { SearchQueryBuilder } from "../ElasticsearchQueryTransformer/SearchQueryBuilder";

export default class ElasticsearchAPIConnector implements APIConnector {
  private queryManager: QueryManager;
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
    const queryBuilder = new SearchQueryBuilder(state, queryConfig);
    let requestBody = queryBuilder.build();

    if (this.postProcessRequestBodyFn) {
      requestBody = this.postProcessRequestBodyFn(
        requestBody,
        state,
        queryConfig
      );
    }
    const response = await this.apiClient.performRequest(requestBody);

    return transformResponse(response, queryBuilder);
  }

  async onAutocomplete(
    state: RequestState,
    queryConfig: AutocompleteQueryConfig
  ): Promise<AutocompleteResponseState> {
    // const queryManager = this.getQueryManager(
    //   state,
    //   queryConfig,
    //   "autocomplete"
    // );

    // let requestBody = queryManager.getQuery();
    return handleAutocompleteRequest(
      {
        state,
        queryConfig
      },
      this.apiClient
    );
  }

  getQueryManager(
    state: RequestState,
    queryConfig: QueryConfig,
    type: "search" | "autocomplete"
  ): QueryManager {
    return new QueryManager(state, queryConfig, type);
  }
}
