import {
  AutocompleteQueryConfig,
  AutocompleteResponseState,
  RequestState
} from "@elastic/search-ui";
import Searchkit, {
  CompletionSuggester,
  HitsSuggestor,
  PrefixQuery,
  SearchkitConfig
} from "@searchkit/sdk";
import { fieldResponseMapper } from "../common";
import { getQueryFields, getResultFields } from "../search/Configuration";

interface AutocompleteHandlerConfiguration {
  state: RequestState;
  queryConfig: AutocompleteQueryConfig;
  host: string;
  index: string;
  connectionOptions?: {
    apiKey: string;
  };
}

export default async function handleRequest(
  configuration: AutocompleteHandlerConfiguration
): Promise<AutocompleteResponseState> {
  const { state, queryConfig, host, index, connectionOptions } = configuration;
  const { apiKey } = connectionOptions || {};

  const suggestionConfigurations = [];

  if (queryConfig.results) {
    const { hitFields, highlightFields } = getResultFields(
      queryConfig.results.result_fields
    );
    const queryFields = getQueryFields(queryConfig.results.search_fields);

    suggestionConfigurations.push(
      new HitsSuggestor({
        identifier: "hits-suggestions",
        hits: {
          fields: hitFields,
          highlightedFields: highlightFields
        },
        query: new PrefixQuery({ fields: queryFields }),
        size: queryConfig.results.resultsPerPage || 5
      })
    );
  }

  if (queryConfig.suggestions && queryConfig.suggestions.types) {
    const configs = Object.keys(queryConfig.suggestions.types).map((type) => {
      const { fields } = queryConfig.suggestions.types[type];
      return new CompletionSuggester({
        identifier: type,
        field: fields[0],
        size: queryConfig.suggestions.size || 5
      });
    });
    suggestionConfigurations.push(...configs);
  }

  const searchkitConfig: SearchkitConfig = {
    host,
    index,
    connectionOptions: {
      apiKey
    },
    suggestions: suggestionConfigurations
  };

  const response = await Searchkit(searchkitConfig).executeSuggestions(
    state.searchTerm
  );

  const results: AutocompleteResponseState = response.reduce(
    (sum, suggestion) => {
      if (suggestion.identifier === "hits-suggestions") {
        return {
          ...sum,
          autocompletedResults: suggestion.hits.map(fieldResponseMapper)
        };
      } else {
        return {
          ...sum,
          autocompletedSuggestions: {
            ...sum.autocompletedSuggestions,
            [suggestion.identifier]: suggestion.suggestions.map(
              (suggestion) => {
                return {
                  suggestion: suggestion
                };
              }
            )
          }
        };
      }
    },
    {
      autocompletedSuggestions: {}
    }
  );

  return results;
}
