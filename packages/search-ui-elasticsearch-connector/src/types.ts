import type { estypes } from "@elastic/elasticsearch";
import { QueryConfig, RequestState } from "@elastic/search-ui";

export type SearchRequest = estypes.SearchRequest;
export type SearchSourceFilter = estypes.SearchSourceFilter;
export type SearchHit = estypes.SearchHit;

export type PostProcessRequestBodyFn = (
  requestBody: SearchRequest,
  requestState: RequestState,
  queryConfig: QueryConfig
) => SearchRequest;

export interface CloudHost {
  id: string;
}

export type ConnectionOptions = {
  host?: string;
  cloud?: CloudHost;
  index: string;
  apiKey?: string;
  connectionOptions?: {
    headers?: Record<string, string>;
  };
};
