import {
  AutocompleteQuery,
  AutocompleteResponseState,
  RequestState
} from "@elastic/search-ui";
import resultsHandler from "./results";
import suggestionsHandler from "./suggestions";

export default async function handleRequest(
  state: RequestState,
  queryConfig: AutocompleteQuery,
  host: string,
  index: string,
  apiKey: string,
  queryFields: string[]
): Promise<AutocompleteResponseState> {
  const requests = [];

  if (queryConfig.results) {
    requests.push(
      resultsHandler(state, queryConfig, host, index, apiKey, queryFields)
    );
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
