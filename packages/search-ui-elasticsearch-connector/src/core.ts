import {
  AutocompleteQuery,
  QueryConfig,
  RequestState,
  SearchState
} from "@elastic/search-ui";
import Searchkit, {
  MultiMatchQuery,
  RefinementSelectFacet,
  SearchkitConfig
} from "@searchkit/sdk";
import {
  buildSKConfiguration,
  getResultFields,
  getSKFilters
} from "./RequestResponseTransformers";

export async function handleSearchRequest(
  state: RequestState,
  queryConfig: QueryConfig,
  host: string,
  index: string,
  apiKey: string,
  queryFields: string[]
): Promise<SearchState> {
  const skConfig = buildSKConfiguration(
    state,
    queryConfig,
    host,
    index,
    apiKey,
    queryFields
  );
  const request = Searchkit(skConfig);

  const filters = getSKFilters(state);

  request
    .query(state.searchTerm)
    .setFilters(filters)
    .setSortBy("selectedOption");
  const results = await request.execute({
    facets: true,
    hits: {
      from: state.current - 1,
      size: state.resultsPerPage
    }
  });

  const facets = results.facets.reduce((acc, f) => {
    return {
      ...acc,
      [f.identifier]: [
        {
          data: f.entries.map((e) => ({
            value: e.label,
            count: e.count
          })),
          type: "value"
        }
      ]
    };
  }, {});

  return {
    resultSearchTerm: results.summary.query,
    totalPages: results.page.totalPages,
    pagingStart: results.page.pageNumber * results.page.size,
    pagingEnd: (results.page.pageNumber + 1) * results.page.size,
    wasSearched: false,
    totalResults: results.summary.total,
    facets,
    results: results.items.map((item) => {
      const fields = item.fields;
      const highlights = item.highlight || {};
      return Object.keys(fields).reduce(
        (acc, key) => {
          return {
            ...acc,
            [key]: { raw: fields[key], snippet: highlights[key] }
          };
        },
        {
          id: { raw: item.id }
        }
      );
    })
  } as SearchState;
}

export async function handleAutocompleteRequest(
  state: RequestState,
  queryConfig: AutocompleteQuery,
  host: string,
  index: string,
  apiKey: string,
  queryFields: string[]
): Promise<SearchState> {
  const requests = [];
  const searchTerm = state.searchTerm;

  if (queryConfig.results) {
    const { hitFields, highlightFields } = getResultFields(
      queryConfig.results.result_fields
    );

    const skConfig: SearchkitConfig = {
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

    const promise = Searchkit(skConfig)
      .query(searchTerm)
      .execute({
        facets: false,
        hits: {
          from: 0,
          size: queryConfig.results.resultsPerPage || 5
        }
      })
      .then((response) => {
        return response.items.map((item, i) => {
          const fields = item.fields;
          const highlights = item.highlight || {};
          return Object.keys(fields).reduce(
            (acc, key) => {
              return {
                ...acc,
                [key]: { raw: fields[key], snippet: highlights[key] }
              };
            },
            {
              id: { raw: item.id || i }
            }
          );
        });
      });

    requests.push(promise);
  }

  if (queryConfig.suggestions && queryConfig.suggestions.types) {
    const firstSuggestionKey = Object.keys(queryConfig.suggestions.types)[0];
    const suggestionConfig = queryConfig.suggestions.types[firstSuggestionKey];

    const skConfig: SearchkitConfig = {
      host: host,
      index: index,
      hits: {
        fields: []
      },
      facets: [
        new RefinementSelectFacet({
          identifier: "suggestions",
          field: suggestionConfig.fields[0],
          label: firstSuggestionKey,
          size: queryConfig.suggestions.size || 4
        })
      ]
    };

    const promise = Searchkit(skConfig)
      .execute({
        facets: [{ identifier: "suggestions", query: searchTerm }]
      })
      .then((response) => {
        const entries = response.facets[0].entries;
        return {
          [firstSuggestionKey]: entries.map((item, i) => {
            return {
              suggestion: item.label
            };
          })
        };
      });

    requests.push(promise);
  }

  const results = await Promise.all(requests);

  return {
    autocompletedResults: results[0],
    autocompletedSuggestions: results[1],
    wasSearched: true,
    totalResults: results[0].length,
    totalPages: 1,
    pagingStart: 0,
    pagingEnd: results[0].length
  } as SearchState;
}
