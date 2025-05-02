import {
  AutocompleteQueryConfig,
  AutocompleteResponseState,
  QueryConfig,
  RequestState,
  ResultSuggestionConfiguration,
  SuggestionConfiguration
} from "@elastic/search-ui";

import { ResultsAutocompleteBuilder } from "../queryBuilders/ResultsAutocompleteBuilder";
import { SuggestionsAutocompleteBuilder } from "../queryBuilders/SuggestionsAutocompleteBuilder";
import { transformHitToFieldResult } from "../transformer/responseTransformer";
import type { IApiClientTransporter } from "../transporter/ApiClientTransporter";
import type { SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import type { SearchRequest } from "../types";

type SuggestionConfig = {
  searchRequest: SearchRequest;
  handler: (response: SearchResponse) => void;
};

export async function handleAutocomplete(
  state: RequestState,
  queryConfig: AutocompleteQueryConfig,
  apiClient: IApiClientTransporter
): Promise<AutocompleteResponseState> {
  const suggestionConfigurations: SuggestionConfig[] = [];
  const result: AutocompleteResponseState = {
    autocompletedResults: [],
    autocompletedSuggestions: {},
    autocompletedResultsRequestId: "",
    autocompletedSuggestionsRequestId: ""
  };

  const buildResultConfig = (
    config: QueryConfig | ResultSuggestionConfiguration,
    type?: string
  ): SuggestionConfig => {
    const builder = new ResultsAutocompleteBuilder(
      state,
      config,
      config.resultsPerPage || queryConfig.suggestions?.size || 5
    );

    return {
      searchRequest: builder.build(),
      handler(response) {
        const hits = response.hits.hits.map(transformHitToFieldResult);
        if (type) {
          result.autocompletedSuggestions[type] = hits.map((hit) => ({
            queryType: (config as ResultSuggestionConfiguration).queryType,
            result: hit
          }));
        } else {
          result.autocompletedResults.push(...hits);
        }
      }
    };
  };

  const buildSuggestionConfig = (
    config: SuggestionConfiguration,
    type: string
  ): SuggestionConfig => {
    const builder = new SuggestionsAutocompleteBuilder(
      state,
      config,
      queryConfig.suggestions?.size || 5
    );

    return {
      searchRequest: builder.build(),
      handler(response) {
        const options = response.suggest.suggest[0].options;
        const suggestions = Array.isArray(options)
          ? options.map(({ text }) => ({ suggestion: text }))
          : [{ suggestion: options.text }];

        result.autocompletedSuggestions[type] = suggestions;
      }
    };
  };

  if (queryConfig.results) {
    suggestionConfigurations.push(buildResultConfig(queryConfig.results));
  }

  Object.entries(queryConfig.suggestions?.types || {}).forEach(
    ([type, configuration]) => {
      if (configuration.queryType === "results") {
        suggestionConfigurations.push(buildResultConfig(configuration, type));
      } else if (
        !configuration.queryType ||
        configuration.queryType === "suggestions"
      ) {
        suggestionConfigurations.push(
          buildSuggestionConfig(configuration, type)
        );
      }
    }
  );

  await Promise.all(
    suggestionConfigurations.map(({ searchRequest, handler }) =>
      apiClient.performRequest(searchRequest).then(handler)
    )
  );

  return result;
}
