import {
  AutocompleteQuery,
  FieldConfiguration,
  RequestState
} from "@elastic/search-ui";
import Searchkit, { MultiMatchQuery, SearchkitConfig } from "@searchkit/sdk";
import { fieldResponseMapper } from "../common";
import { getResultFields } from "../search/Configuration";

interface ConfigurationOptions {
  host: string;
  index: string;
  apiKey?: string;
  queryFields: string[];
  resultFields: Record<string, FieldConfiguration>;
}

function buildConfiguration({
  host,
  index,
  apiKey,
  queryFields,
  resultFields
}: ConfigurationOptions): SearchkitConfig {
  const { hitFields, highlightFields } = getResultFields(resultFields);

  const searchkitConfiguration: SearchkitConfig = {
    host: host,
    index: index,
    connectionOptions: {
      apiKey: apiKey
    },
    query: new MultiMatchQuery({
      fields: queryFields
    }),
    hits: {
      fields: hitFields,
      highlightedFields: highlightFields
    }
  };
  return searchkitConfiguration;
}

export default async function handler(
  state: RequestState,
  queryConfig: AutocompleteQuery,
  host: string,
  index: string,
  apiKey: string,
  queryFields: string[]
): Promise<any> {
  const searchkitConfiguration = buildConfiguration({
    host,
    index,
    apiKey,
    queryFields,
    resultFields: queryConfig.results.result_fields
  });

  const response = await Searchkit(searchkitConfiguration)
    .query(state.searchTerm)
    .execute({
      facets: false,
      hits: {
        from: 0,
        size: queryConfig.results.resultsPerPage || 5
      }
    });

  return response.hits.items.map(fieldResponseMapper);
}
