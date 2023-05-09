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
import { Transporter } from "../../types";
import { fieldResponseMapper } from "../common";
import { getResultFields } from "../search/Configuration";

interface AutocompleteHandlerConfiguration {
  state: RequestState;
  queryConfig: AutocompleteQueryConfig;
  transporter: Transporter;
}

export default async function handleRequest(
  configuration: AutocompleteHandlerConfiguration
): Promise<AutocompleteResponseState> {
  const { state, queryConfig } = configuration;

  const suggestionConfigurations = [];

  if (queryConfig.results) {
    const { hitFields, highlightFields } = getResultFields(
      queryConfig.results.result_fields
    );

    suggestionConfigurations.push(
      new HitsSuggestor({
        identifier: "hits-suggestions",
        hits: {
          fields: hitFields,
          highlightedFields: highlightFields
        },
        query: new PrefixQuery({ fields: ["*"] }),
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

        return new HitsSuggestor({
          identifier: `suggestions-hits-${type}`,
          index: configuration.index,
          hits: {
            fields: hitFields,
            highlightedFields: highlightFields
          },
          query: new PrefixQuery({ fields: ["*"] }),
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
    host: "host",
    index: "engineName",
    suggestions: suggestionConfigurations
  };

  const response = await Searchkit(
    searchkitConfig,
    configuration.transporter
  ).executeSuggestions(state.searchTerm);

  const results: AutocompleteResponseState = response.reduce(
    (acc, suggestion) => {
      const { identifier } = suggestion;

      if (identifier === "hits-suggestions") {
        return {
          ...acc,
          autocompletedResults: suggestion.hits.map(fieldResponseMapper)
        };
      } else if (identifier.startsWith("suggestions-completion-")) {
        const name = identifier.replace("suggestions-completion-", "");

        return {
          ...acc,
          autocompletedSuggestions: {
            ...acc.autocompletedSuggestions,
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
          ...acc,
          autocompletedSuggestions: {
            ...acc.autocompletedSuggestions,
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
