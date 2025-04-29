import { SuggestionsAutocompleteBuilder } from "../SuggestionsAutocompleteBuilder";
import type { RequestState, SuggestionConfiguration } from "@elastic/search-ui";
import type { SearchFieldSuggester } from "@elastic/elasticsearch/lib/api/types";

describe("SuggestionsAutocompleteBuilder", () => {
  const state: RequestState = {
    searchTerm: "test"
  };

  const config: SuggestionConfiguration = {
    fields: ["title"],
    queryType: "suggestions"
  };

  it("should build suggestions autocomplete query", () => {
    const builder = new SuggestionsAutocompleteBuilder(state, config, 5);
    const query = builder.build();

    expect(query).toEqual({
      size: 0,
      _source: {
        includes: []
      },
      suggest: {
        suggest: {
          prefix: "test",
          completion: {
            size: 5,
            skip_duplicates: true,
            field: "title",
            fuzzy: {
              fuzziness: 1
            }
          }
        }
      }
    });
  });

  it("should handle empty search term", () => {
    const emptyState: RequestState = {
      ...state,
      searchTerm: ""
    };

    const builder = new SuggestionsAutocompleteBuilder(emptyState, config, 5);
    const query = builder.build();

    expect(query.suggest).toBeUndefined();
  });

  it("should handle custom size", () => {
    const builder = new SuggestionsAutocompleteBuilder(state, config, 10);
    const query = builder.build();

    expect(
      (query.suggest.suggest as SearchFieldSuggester).completion.size
    ).toBe(10);
  });

  it("should handle multiple fields", () => {
    const multiFieldConfig: SuggestionConfiguration = {
      ...config,
      fields: ["title", "description"]
    };

    const builder = new SuggestionsAutocompleteBuilder(
      state,
      multiFieldConfig,
      5
    );
    const query = builder.build();

    expect(query).toEqual({
      size: 0,
      _source: {
        includes: []
      },
      suggest: {
        suggest: {
          prefix: "test",
          completion: {
            size: 5,
            skip_duplicates: true,
            field: "title",
            fuzzy: {
              fuzziness: 1
            }
          }
        }
      }
    });
  });
});
