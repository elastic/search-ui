import { ResultsAutocompleteBuilder } from "../ResultsAutocompleteBuilder";
import type { RequestState } from "@elastic/search-ui";

describe("ResultsAutocompleteBuilder", () => {
  const state: RequestState = {
    searchTerm: "test"
  };

  const config = {
    resultsPerPage: 5,
    search_fields: {
      title: {
        weight: 2
      }
    },
    result_fields: {
      title: {
        snippet: {
          size: 100,
          fallback: true
        }
      }
    }
  };

  it("should build results autocomplete query", () => {
    const builder = new ResultsAutocompleteBuilder(state, config, 5);
    const query = builder.build();

    expect(query).toEqual({
      size: 5,
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: "test",
                type: "bool_prefix",
                fields: ["title^2"]
              }
            }
          ]
        }
      },
      _source: {
        includes: ["title"]
      },
      highlight: {
        fields: {
          title: {}
        }
      }
    });
  });

  it("should handle empty search term", () => {
    const emptyState: RequestState = {
      ...state,
      searchTerm: ""
    };

    const builder = new ResultsAutocompleteBuilder(emptyState, config, 5);
    const query = builder.build();

    expect(query).toEqual({
      _source: {
        includes: ["title"]
      },
      highlight: {
        fields: {
          title: {}
        }
      },
      size: 5
    });
  });

  it("should handle custom size", () => {
    const builder = new ResultsAutocompleteBuilder(state, config, 10);
    const query = builder.build();

    expect(query.size).toBe(10);
  });

  it("should handle multiple search fields", () => {
    const multiFieldConfig = {
      ...config,
      search_fields: {
        title: { weight: 2 },
        description: { weight: 1 }
      }
    };

    const builder = new ResultsAutocompleteBuilder(state, multiFieldConfig, 5);
    const query = builder.build();

    expect(query.query.bool.must[0].multi_match).toEqual({
      query: "test",
      fields: ["title^2", "description^1"],
      type: "bool_prefix"
    });
  });

  describe("fuzziness", () => {
    it("should not add fuzziness when not configured", () => {
      const builder = new ResultsAutocompleteBuilder(state, config, 5);
      const query = builder.build();

      expect(query.query.bool.must[0].multi_match.fuzziness).toBeUndefined();
    });

    it("should add AUTO fuzziness when configured", () => {
      const configWithFuzziness = {
        ...config,
        fuzziness: true
      };

      const builder = new ResultsAutocompleteBuilder(
        state,
        configWithFuzziness,
        5
      );
      const query = builder.build();

      expect(query.query.bool.must[0].multi_match.fuzziness).toBe("AUTO");
      expect(query.query.bool.must).toEqual([
        {
          multi_match: {
            fields: ["title^2"],
            fuzziness: "AUTO",
            query: "test",
            type: "bool_prefix"
          }
        }
      ]);
    });
  });
});
