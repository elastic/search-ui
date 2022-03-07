import { QueryConfig, RequestState, ResponseState } from "@elastic/search-ui";
import Searchkit from "@searchkit/sdk";
import buildConfiguration from "./Configuration";
import buildRequest from "./Request";
import buildResponse from "./Response";

export default async function handleRequest(
  state: RequestState,
  queryConfig: QueryConfig,
  host: string,
  index: string,
  apiKey: string,
  queryFields: string[]
): Promise<ResponseState> {
  const searchkitConfig = buildConfiguration(
    state,
    queryConfig,
    host,
    index,
    apiKey,
    queryFields
  );
  const request = Searchkit(searchkitConfig);

  const searchkitVariables = buildRequest(state);

  const results = await request
    .query(searchkitVariables.query)
    .setFilters(searchkitVariables.filters)
    .setSortBy(searchkitVariables.sort)
    .execute({
      facets: queryConfig.facets && Object.keys(queryConfig.facets).length > 0,
      hits: {
        from: searchkitVariables.from,
        size: searchkitVariables.size
      }
    });

  return buildResponse(results);
}
