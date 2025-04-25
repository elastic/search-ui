import { QueryConfig, RequestState, ResponseState } from "@elastic/search-ui";
import { SearchQueryBuilder } from "../queryBuilders/SearchQueryBuilder";
import { transformSearchResponse } from "../transformer/responseTransformer";
import type { IApiClientTransporter } from "../transporter/ApiClientTransporter";
import type { PostProcessRequestBodyFn } from "../types";

export async function handleSearch(
  state: RequestState,
  queryConfig: QueryConfig,
  apiClient: IApiClientTransporter,
  postProcessRequestBodyFn?: PostProcessRequestBodyFn
): Promise<ResponseState> {
  const queryBuilder = new SearchQueryBuilder(state, queryConfig);
  let requestBody = queryBuilder.build();

  if (postProcessRequestBodyFn) {
    requestBody = postProcessRequestBodyFn(requestBody, state, queryConfig);
  }

  const response = await apiClient.performRequest(requestBody);

  return transformSearchResponse(response, queryBuilder);
}
