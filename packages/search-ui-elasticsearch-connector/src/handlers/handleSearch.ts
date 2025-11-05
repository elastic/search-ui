import type {
  QueryConfig,
  RequestState,
  ResponseState
} from "@elastic/search-ui";
import { SearchQueryBuilder } from "../queryBuilders/SearchQueryBuilder";
import { transformSearchResponse } from "../transformer/responseTransformer";
import type { IApiClientTransporter } from "../transporter/ApiClientTransporter";
import type {
  ElasticsearchError,
  PostProcessRequestBodyFn,
  RequestModifiers,
  SearchRequest,
  SearchResponseWithError
} from "../types";

interface ElasticsearchSearchError extends Error {
  elasticsearchError: ElasticsearchError;
}

export const handleSearch = async (
  state: RequestState,
  queryConfig: QueryConfig,
  apiClient: IApiClientTransporter,
  interceptSearchRequest: RequestModifiers["interceptSearchRequest"] = (
    { requestBody },
    next
  ) => next(requestBody),
  getQueryFn?: RequestModifiers["getQueryFn"],
  postProcessRequestBodyFn?: PostProcessRequestBodyFn
): Promise<ResponseState> => {
  const queryBuilder = new SearchQueryBuilder(state, queryConfig, getQueryFn);
  let requestBody = await queryBuilder.build();
  let response: SearchResponseWithError;

  if (postProcessRequestBodyFn) {
    requestBody = postProcessRequestBodyFn(requestBody, state, queryConfig);

    response = await apiClient.performRequest(requestBody);
  } else {
    response = await interceptSearchRequest(
      { requestBody, requestState: state, queryConfig },
      (requestBody: SearchRequest) => apiClient.performRequest(requestBody)
    );
  }
  if (response.error) {
    const rootCause = response.error.root_cause?.[0];
    const message =
      rootCause?.reason ||
      response.error.reason ||
      "Elasticsearch search failed";

    const error = new Error(message) as ElasticsearchSearchError;
    error.elasticsearchError = response.error;
    throw error;
  }

  return transformSearchResponse(response, queryBuilder, queryConfig);
};
