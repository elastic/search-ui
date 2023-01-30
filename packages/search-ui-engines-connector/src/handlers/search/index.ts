import type {
  QueryConfig,
  RequestState,
  ResponseState
} from "@elastic/search-ui";
import Searchkit from "@searchkit/sdk";
import { EngineRouteFn } from "../../types";
import { EngineTransporter } from "../transporter";
import buildConfiguration, { buildBaseFilters } from "./Configuration";
import buildRequest from "./Request";
import buildResponse from "./Response";

interface SearchHandlerConfiguration {
  state: RequestState;
  queryConfig: QueryConfig;
  host: string;
  engineName: string;
  apiKey: string;
  engineRouteFn?: EngineRouteFn;
}

export default async function handleRequest(
  configuration: SearchHandlerConfiguration
): Promise<ResponseState> {
  const { state, queryConfig, host, engineName, apiKey } = configuration;
  const searchkitConfig = buildConfiguration({
    state,
    queryConfig,
    host,
    engineName,
    apiKey
  });

  const transporter = new EngineTransporter(
    host,
    engineName,
    configuration.apiKey,
    configuration.engineRouteFn
  );

  const request = Searchkit(searchkitConfig, transporter);

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
