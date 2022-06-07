import { QueryConfig, RequestState, ResponseState } from "@elastic/search-ui";
import Searchkit from "@searchkit/sdk";
import { PostProcessRequestBodyFn } from "../../types";
import buildConfiguration from "./Configuration";
import buildRequest from "./Request";
import buildResponse from "./Response";

interface SearchHandlerConfiguration {
  state: RequestState;
  queryConfig: QueryConfig;
  host: string;
  index: string;
  connectionOptions?: {
    apiKey: string;
  };
  transport?: any;
  postProcessRequestBodyFn?: PostProcessRequestBodyFn;
}

export default async function handleRequest(
  configuration: SearchHandlerConfiguration
): Promise<ResponseState> {
  const {
    state,
    queryConfig,
    host,
    index,
    connectionOptions,
    postProcessRequestBodyFn
  } = configuration;
  const { apiKey } = connectionOptions || {};
  const searchkitConfig = buildConfiguration(
    state,
    queryConfig,
    host,
    index,
    apiKey,
    postProcessRequestBodyFn
  );
  const request = Searchkit(
    searchkitConfig,
    configuration.transport
      ? new configuration.transport(searchkitConfig, {
          query: state.searchTerm
        })
      : null
  );

  const searchkitVariables = buildRequest(state);

  const results = await request
    .query(searchkitVariables.query)
    .setFilters(searchkitVariables.filters)
    .setSortBy(searchkitVariables.sort)
    .execute({
      facets: queryConfig.facets && Object.keys(queryConfig.facets).length > 0,
      hits: {
        from: searchkitVariables.from,
        size: searchkitVariables.size,
        includeRawHit: true
      }
    });

  return buildResponse(results);
}
