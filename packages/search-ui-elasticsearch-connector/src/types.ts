import type { estypes } from "@elastic/elasticsearch";
import { QueryConfig, RequestState } from "@elastic/search-ui";

export type SearchRequest = estypes.SearchRequest;
export type PostProcessRequestBodyFn = (
  requestBody: SearchRequest,
  requestState: RequestState,
  queryConfig: QueryConfig
) => SearchRequest;

export interface CloudHost {
  id: string;
}
