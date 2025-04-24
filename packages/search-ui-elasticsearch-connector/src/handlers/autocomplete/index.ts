import type {
  AutocompleteQueryConfig,
  AutocompleteResponseState,
  RequestState
} from "@elastic/search-ui";

import { ResultsAutocompleteBuilder } from "../../queryBuilders/ResultsAutocompleteBuilder";
import { SuggestionsAutocompleteBuilder } from "../../queryBuilders/SuggestionsAutocompleteBuilder";
import { transformHitToFieldResult } from "../../ElasticsearchQueryTransformer/utils";
import type { ApiClientTransporter } from "../../transporter/ApiClientTransporter";
import type { SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import type { SearchRequest } from "../../types";

interface AutocompleteHandlerConfiguration {
  state: RequestState;
  queryConfig: AutocompleteQueryConfig;
}

type SuggestionConfig = {
  eql: SearchRequest;
  handle: (response: SearchResponse) => void;
};

export default async function handleRequest(
  configuration: AutocompleteHandlerConfiguration,
  apiClient: ApiClientTransporter
): Promise<AutocompleteResponseState> {
  const { state, queryConfig } = configuration;
  const suggestionConfigurations: SuggestionConfig[] = [];
  const result: AutocompleteResponseState = {
    autocompletedResults: [],
    autocompletedSuggestions: {},
    autocompletedResultsRequestId: "",
    autocompletedSuggestionsRequestId: ""
  };

  const buildResultConfig = (config: any, type?: string): SuggestionConfig => {
    const builder = new ResultsAutocompleteBuilder(
      state,
      config,
      config.resultsPerPage || queryConfig.suggestions?.size || 5
    );

    return {
      eql: builder.build(),
      handle(response) {
        const hits = response.hits.hits.map(transformHitToFieldResult);
        if (type) {
          result.autocompletedSuggestions[type] = hits.map((hit) => ({
            queryType: config.queryType,
            result: hit
          }));
        } else {
          result.autocompletedResults.push(...hits);
        }
      }
    };
  };

  const buildSuggestionConfig = (
    config: any,
    type: string
  ): SuggestionConfig => {
    const builder = new SuggestionsAutocompleteBuilder(
      state,
      config,
      queryConfig.suggestions?.size || 5
    );

    return {
      eql: builder.build(),
      handle(response) {
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
      } else {
        suggestionConfigurations.push(
          buildSuggestionConfig(configuration, type)
        );
      }
    }
  );

  await Promise.all(
    suggestionConfigurations.map(async ({ eql, handle }) => {
      const response = await apiClient.performRequest(eql);
      handle(response);
    })
  );

  return result;
}
