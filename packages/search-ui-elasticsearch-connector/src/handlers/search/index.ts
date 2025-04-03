import type {
  QueryConfig,
  RequestState,
  ResponseState
} from "@elastic/search-ui";
import { CloudHost, PostProcessRequestBodyFn } from "../../types";
import buildConfiguration, { buildBaseFilters } from "./Configuration";
import buildRequest from "./Request";
import buildResponse from "./Response";
import createRequest from "../../Request/Request";

interface SearchHandlerConfiguration {
  state: RequestState;
  queryConfig: QueryConfig;
  cloud?: CloudHost;
  host?: string;
  index: string;
  connectionOptions?: {
    apiKey?: string;
    headers?: Record<string, string>;
  };
  postProcessRequestBodyFn?: PostProcessRequestBodyFn;
}

export default async function handleRequest(
  configuration: SearchHandlerConfiguration
): Promise<ResponseState> {
  const {
    state,
    queryConfig,
    host,
    cloud,
    index,
    connectionOptions,
    postProcessRequestBodyFn
  } = configuration;
  const { apiKey, headers } = connectionOptions || {};
  const searchkitConfig = buildConfiguration({
    state,
    queryConfig,
    cloud,
    host,
    index,
    apiKey,
    headers,
    postProcessRequestBodyFn
  });
  console.log("v1", "searchkitConfig", searchkitConfig);
  const request = createRequest(searchkitConfig);

  const searchkitVariables = buildRequest(state, queryConfig);

  const baseFilters = buildBaseFilters(queryConfig.filters);

  const results = await request
    .query(searchkitVariables.query)
    .setFilters(searchkitVariables.filters)
    .setSortBy(searchkitVariables.sort)
    .execute(
      {
        facets:
          queryConfig.facets && Object.keys(queryConfig.facets).length > 0,
        hits: {
          from: searchkitVariables.from,
          size: searchkitVariables.size,
          includeRawHit: true
        }
      },
      baseFilters
    );

  return buildResponse(results);
}
