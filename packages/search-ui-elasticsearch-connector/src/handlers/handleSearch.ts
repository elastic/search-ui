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
  const next = async (body: SearchRequest) => {
    return await apiClient.performRequest(body);
  };
  let response;

  if (postProcessRequestBodyFn) {
    requestBody = postProcessRequestBodyFn(requestBody, state, queryConfig);

    response = await apiClient.performRequest(requestBody);
  } else if (beforeSearchCall) {
    response = await beforeSearchCall(
      { requestBody, requestState: state, queryConfig },
      next
    );
  } else {
    response = await next(requestBody);
  }

  return transformSearchResponse(response, queryBuilder);
};
