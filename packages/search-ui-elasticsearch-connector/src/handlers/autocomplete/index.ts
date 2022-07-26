import type {
  AutocompleteQueryConfig,
  AutocompleteResponseState,
  RequestState,
  ResultSuggestionConfiguration
} from "@elastic/search-ui";
import Searchkit, {
  CompletionSuggester,
  HitsSuggestor,
  PrefixQuery,
  SearchkitConfig
} from "@searchkit/sdk";
import { CloudHost } from "../../types";
import { fieldResponseMapper } from "../common";
import { getQueryFields, getResultFields } from "../search/Configuration";

interface AutocompleteHandlerConfiguration {
  state: RequestState;
  queryConfig: AutocompleteQueryConfig;
  cloud?: CloudHost;
  host?: string;
  index: string;
  connectionOptions?: {
    apiKey?: string;
    headers?: Record<string, string>;
  };
}

export default async function handleRequest(
  configuration: AutocompleteHandlerConfiguration
): Promise<AutocompleteResponseState> {
  const { state, queryConfig, host, cloud, index, connectionOptions } =
    configuration;
  const { apiKey, headers } = connectionOptions || {};

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
      const configuration = queryConfig.suggestions.types[type];
      const suggestionsSize = queryConfig.suggestions.size || 5;

      if (configuration.queryType === "results") {
        const { hitFields, highlightFields } = getResultFields(
          configuration.result_fields
        );
        const queryFields = getQueryFields(configuration.search_fields);

        return new HitsSuggestor({
          identifier: `suggestions-hits-${type}`,
          index: configuration.index,
          hits: {
            fields: hitFields,
            highlightedFields: highlightFields
          },
          query: new PrefixQuery({ fields: queryFields }),
          size: suggestionsSize
        });
      } else if (
        !configuration.queryType ||
        configuration.queryType === "suggestions"
      ) {
        const { fields } = configuration;

        return new CompletionSuggester({
          identifier: `suggestions-completion-${type}`,
          field: fields[0],
          size: suggestionsSize
        });
      }
    });
    suggestionConfigurations.push(...configs);
  }

  const searchkitConfig: SearchkitConfig = {
    host,
    cloud,
    index,
    connectionOptions: {
      apiKey,
      headers
    },
    suggestions: suggestionConfigurations
  };

  const response = await Searchkit(searchkitConfig).executeSuggestions(
    state.searchTerm
  );

  const results: AutocompleteResponseState = response.reduce(
    (sum, suggestion) => {
      const { identifier } = suggestion;

      if (identifier === "hits-suggestions") {
        return {
          ...sum,
          autocompletedResults: suggestion.hits.map(fieldResponseMapper)
        };
      } else if (identifier.startsWith("suggestions-completion-")) {
        const name = identifier.replace("suggestions-completion-", "");

        return {
          ...sum,
          autocompletedSuggestions: {
            ...sum.autocompletedSuggestions,
            [name]: suggestion.suggestions.map((suggestion) => {
              return {
                suggestion: suggestion
              };
            })
          }
        };
      } else if (identifier.startsWith("suggestions-hits-")) {
        const name = identifier.replace("suggestions-hits-", "");
        const config = queryConfig.suggestions.types[
          name
        ] as ResultSuggestionConfiguration;
        return {
          ...sum,
          autocompletedSuggestions: {
            ...sum.autocompletedSuggestions,
            [name]: suggestion.hits.map((hit) => ({
              queryType: config.queryType,
              result: fieldResponseMapper(hit)
            }))
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
