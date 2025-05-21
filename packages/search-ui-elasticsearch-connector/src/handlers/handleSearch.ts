import type {
  QueryConfig,
  RequestState,
  ResponseState
} from "@elastic/search-ui";
import { SearchQueryBuilder } from "../queryBuilders/SearchQueryBuilder";
import { transformSearchResponse } from "../transformer/responseTransformer";
import type { IApiClientTransporter } from "../transporter/ApiClientTransporter";
import type { PostProcessRequestBodyFn, RequestModifiers } from "../types";

export const handleSearch = async (
  state: RequestState,
  queryConfig: QueryConfig,
  apiClient: IApiClientTransporter,
  beforeSearchCall: RequestModifiers["beforeSearchCall"] = (
    { requestBody },
    next
  ) => next(requestBody),
  getQueryFn?: RequestModifiers["getQueryFn"],
  postProcessRequestBodyFn?: PostProcessRequestBodyFn
): Promise<ResponseState> => {
  const queryBuilder = new SearchQueryBuilder(state, queryConfig, getQueryFn);
  let requestBody = queryBuilder.build();
  let response;

  if (postProcessRequestBodyFn) {
    requestBody = postProcessRequestBodyFn(requestBody, state, queryConfig);

    response = await apiClient.performRequest(requestBody);
  } else {
    response = await beforeSearchCall(
      { requestBody, requestState: state, queryConfig },
      (requestBody: RequestState) => apiClient.performRequest(requestBody)
    );
  }

  return transformSearchResponse(response, queryBuilder);
};
