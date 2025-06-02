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
import type { ResponseBody, SearchQueryHook, SearchRequest } from "../types";

const isResultSuggestionConfiguration = (
  config: QueryConfig | ResultSuggestionConfiguration | SuggestionConfiguration
): config is ResultSuggestionConfiguration =>
  "queryType" in config && config.queryType === "results";

const defaultHook = (
  { requestBody }: { requestBody: SearchRequest },
  next: (requestBody: SearchRequest) => Promise<ResponseBody>
) => next(requestBody);

export const handleAutocomplete = async (
  state: RequestState,
  queryConfig: AutocompleteQueryConfig,
  apiClient: IApiClientTransporter,
  interceptAutocompleteSuggestionsRequest: SearchQueryHook<AutocompleteQueryConfig> = defaultHook,
  interceptAutocompleteResultsRequest: SearchQueryHook<AutocompleteQueryConfig> = defaultHook
): Promise<AutocompleteResponseState> => {
  const suggestionTasks: Promise<void>[] = [];
  const result: AutocompleteResponseState = {
    autocompletedResults: [],
    autocompletedSuggestions: {},
    autocompletedResultsRequestId: "",
    autocompletedSuggestionsRequestId: ""
  };
  const next = (requestBody: SearchRequest) =>
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
      interceptAutocompleteResultsRequest(
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
      interceptAutocompleteSuggestionsRequest(
        { requestBody: request, requestState: state, queryConfig },
        next
      ).then((response) => {
        const options = response.suggest?.suggest[0]?.options;
        const suggestions = Array.isArray(options)
          ? options.map(({ text }) => ({ suggestion: text }))
          : [{ suggestion: options?.text }];

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
