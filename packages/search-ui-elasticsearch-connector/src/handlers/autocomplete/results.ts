import {
  AutocompletedResult,
  AutocompleteQueryConfig,
  FieldConfiguration,
  RequestState,
  ResponseState,
  SearchFieldConfiguration
} from "@elastic/search-ui";
import Searchkit, { MultiMatchQuery, SearchkitConfig } from "@searchkit/sdk";
import { fieldResponseMapper } from "../common";
import { getResultFields, getQueryFields } from "../search/Configuration";

interface ConfigurationOptions {
  host: string;
  index: string;
  apiKey?: string;
  searchFields: Record<string, SearchFieldConfiguration>;
  resultFields: Record<string, FieldConfiguration>;
}

function buildConfiguration({
  host,
  index,
  apiKey,
  searchFields,
  resultFields
}: ConfigurationOptions): SearchkitConfig {
  const { hitFields, highlightFields } = getResultFields(resultFields);
  const queryFields = getQueryFields(searchFields);

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
  queryConfig: AutocompleteQueryConfig,
  host: string,
  index: string,
  apiKey: string
): Promise<AutocompletedResult[]> {
  const searchkitConfiguration = buildConfiguration({
    host,
    index,
    apiKey,
    searchFields: queryConfig.results.search_fields,
    resultFields: queryConfig.results.result_fields
  });

  const response = await Searchkit(searchkitConfiguration)
    .query(state.searchTerm)
    .execute({
      facets: false,
      hits: {
        from: 0,
        size: queryConfig.results.resultsPerPage || 5,
        includeRawHit: true
      }
    });

  return response.hits.items.map(fieldResponseMapper);
}
