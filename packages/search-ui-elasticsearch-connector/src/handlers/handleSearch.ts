import type {
  QueryConfig,
  RequestState,
  ResponseState
} from "@elastic/search-ui";
import { SearchQueryBuilder } from "../queryBuilders/SearchQueryBuilder";
import { transformSearchResponse } from "../transformer/responseTransformer";
import type { IApiClientTransporter } from "../transporter/ApiClientTransporter";
import type {
  PostProcessRequestBodyFn,
  RequestModifiers,
  SearchQueryHook,
  SearchRequest
} from "../types";

export const handleSearch = async (
  state: RequestState,
  queryConfig: QueryConfig,
  apiClient: IApiClientTransporter,
  beforeSearchCall?: SearchQueryHook,
  getQueryFn?: RequestModifiers["getQueryFn"],
  postProcessRequestBodyFn?: PostProcessRequestBodyFn
): Promise<ResponseState> => {
  const queryBuilder = new SearchQueryBuilder(state, queryConfig, getQueryFn);
  let requestBody = queryBuilder.build();
  const next = async (requestBody: SearchRequest) => {
    return await apiClient.performRequest(requestBody);
  };
  let response;

  if (beforeSearchCall) {
    response = await beforeSearchCall(requestBody, state, queryConfig, next);
  } else if (postProcessRequestBodyFn) {
    requestBody = postProcessRequestBodyFn(requestBody, state, queryConfig);

    response = await apiClient.performRequest(requestBody);
  } else {
    response = await apiClient.performRequest(requestBody);
  }

  return transformSearchResponse(response, queryBuilder);
};
