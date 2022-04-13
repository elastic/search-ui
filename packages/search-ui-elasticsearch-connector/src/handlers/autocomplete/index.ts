import {
  AutocompleteQueryConfig,
  AutocompleteResponseState,
  RequestState
} from "@elastic/search-ui";
import resultsHandler from "./results";
import suggestionsHandler from "./suggestions";

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
  const requests = [];

  if (queryConfig.results) {
    requests.push(resultsHandler(state, queryConfig, host, index, apiKey));
  }

  if (queryConfig.suggestions && queryConfig.suggestions.types) {
    const promises = Object.keys(queryConfig.suggestions.types).map((type) => {
      const typeConfig = queryConfig.suggestions.types[type];
      return suggestionsHandler(state, typeConfig);
    });

    requests.push(...promises);
  }

  const results = await Promise.all(requests);

  return {
    autocompletedResults: results[0],
    autocompletedSuggestions: results[1] //todo: figure out how to handle multiple suggestions
  } as AutocompleteResponseState;
}
