import type {
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
import type { SearchQueryHook } from "../types";

const isResultSuggestionConfiguration = (
  config: QueryConfig | ResultSuggestionConfiguration | SuggestionConfiguration
): config is ResultSuggestionConfiguration =>
  "queryType" in config && config.queryType === "results";

const defaultHook = ({ requestBody }, next) => next(requestBody);

export const handleAutocomplete = async (
  state: RequestState,
  queryConfig: AutocompleteQueryConfig,
  apiClient: IApiClientTransporter,
  onBeforeAutocompleteSuggestionsCall: SearchQueryHook<AutocompleteQueryConfig> = defaultHook,
  onBeforeAutocompleteResultsCall: SearchQueryHook<AutocompleteQueryConfig> = defaultHook
): Promise<AutocompleteResponseState> => {
  const suggestionTasks: Promise<void>[] = [];
  const result: AutocompleteResponseState = {
    autocompletedResults: [],
    autocompletedSuggestions: {},
    autocompletedResultsRequestId: "",
    autocompletedSuggestionsRequestId: ""
  };
  const next = (requestBody: RequestState) =>
    apiClient.performRequest(requestBody);

  const buildResultHandler = (
    config: QueryConfig | ResultSuggestionConfiguration,
    type?: string
  ): void => {
    const builder = new ResultsAutocompleteBuilder(
      state,
      config,
      config.resultsPerPage || queryConfig.suggestions?.size || 5
    );

    const request = builder.build();

    suggestionTasks.push(
      onBeforeAutocompleteResultsCall(
        { requestBody: request, requestState: state, queryConfig },
        next
      ).then((response) => {
        const hits = response.hits.hits.map(transformHitToFieldResult);
        if (type && isResultSuggestionConfiguration(config)) {
          result.autocompletedSuggestions[type] = hits.map((hit) => ({
            queryType: config.queryType,
            result: Object.keys(config.result_fields || {}).reduce(
              (acc, field) => ({
                ...acc,
                [field]: hit[field]
              }),
              {}
            )
          }));
        } else {
          result.autocompletedResults.push(...hits);
        }
      })
    );
  };

  const buildSuggestionHandler = (
    config: SuggestionConfiguration,
    type: string
  ): void => {
    const builder = new SuggestionsAutocompleteBuilder(
      state,
      config,
      queryConfig.suggestions?.size || 5
    );

    const request = builder.build();

    suggestionTasks.push(
      onBeforeAutocompleteSuggestionsCall(
        { requestBody: request, requestState: state, queryConfig },
        next
      ).then((response) => {
        const options = response.suggest.suggest[0].options;
        const suggestions = Array.isArray(options)
          ? options.map(({ text }) => ({ suggestion: text }))
          : [{ suggestion: options.text }];

        result.autocompletedSuggestions[type] = suggestions;
      })
    );
  };

  if (queryConfig.results) {
    buildResultHandler(queryConfig.results);
  }

  Object.entries(queryConfig.suggestions?.types || {}).forEach(
    ([type, configuration]) => {
      if (isResultSuggestionConfiguration(configuration)) {
        buildResultHandler(configuration, type);
      } else if (
        !configuration.queryType ||
        configuration.queryType === "suggestions"
      ) {
        buildSuggestionHandler(configuration, type);
      }
    }
  );

  await Promise.all(suggestionTasks);

  return result;
};
