import type { AutocompleteQueryConfig, RequestState } from "@elastic/search-ui";
import type { ResponseBody } from "../../types";
import { handleAutocomplete } from "../handleAutocomplete";
import { IApiClientTransporter } from "../../transporter/ApiClientTransporter";

const mockResponse: ResponseBody = {
  took: 1,
  timed_out: false,
  _shards: {
    total: 1,
    successful: 1,
    skipped: 0,
    failed: 0
  },
  hits: {
    total: { value: 1, relation: "eq" },
    hits: [
      {
        _index: "test",
        _id: "1",
        _source: {
          title: "Test Title",
          description: "Test Description"
        },
        highlight: {
          title: ["<em>Test</em> Title"]
        }
      }
    ]
  },
  suggest: {
    suggest: [
      {
        length: 1,
        offset: 0,
        text: "test",
        options: [{ text: "sweaters" }, { text: "sweatpants" }]
      }
    ]
  }
};

class MockApiClientTransporter implements IApiClientTransporter {
  headers: Record<string, string> = {};

  async performRequest(): Promise<ResponseBody> {
    return mockResponse;
  }
}

describe("Autocomplete results", () => {
  let apiClient: MockApiClientTransporter;

  beforeEach(() => {
    apiClient = new MockApiClientTransporter();
  });

  const state: RequestState = {
    searchTerm: "test"
  };

  const queryConfig: AutocompleteQueryConfig = {
    results: {
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
        },
        nps_link: {
          raw: {}
        }
      }
    },
    suggestions: {
      types: {
        documents: {
          fields: ["title"]
        },
        popularQueries: {
          queryType: "results",
          search_fields: {
            title: {}
          },
          result_fields: {
            title: {
              raw: {}
            }
          }
        }
      }
    }
  };

  it("should return autocomplete results", async () => {
    const results = await handleAutocomplete(state, queryConfig, apiClient);

    expect(results).toEqual({
      autocompletedResults: [
        {
          id: { raw: "1" },
          title: {
            raw: "Test Title",
            snippet: ["<em>Test</em> Title"]
          },
          description: { raw: "Test Description" },
          _meta: {
            id: "1",
            rawHit: {
              _id: "1",
              _index: "test",
              _source: {
                title: "Test Title",
                description: "Test Description"
              },
              highlight: {
                title: ["<em>Test</em> Title"]
              }
            }
          }
        }
      ],
      autocompletedSuggestions: {
        documents: [{ suggestion: "sweaters" }, { suggestion: "sweatpants" }],
        popularQueries: [
          {
            queryType: "results",
            result: {
              id: { raw: "1" },
              title: {
                raw: "Test Title",
                snippet: ["<em>Test</em> Title"]
              },
              description: { raw: "Test Description" },
              _meta: {
                id: "1",
                rawHit: {
                  _id: "1",
                  _index: "test",
                  _source: {
                    title: "Test Title",
                    description: "Test Description"
                  },
                  highlight: {
                    title: ["<em>Test</em> Title"]
                  }
                }
              }
            }
          }
        ]
      },
      autocompletedResultsRequestId: "",
      autocompletedSuggestionsRequestId: ""
    });
  });

  it("should handle empty results", async () => {
    class EmptyResponseApiClient extends MockApiClientTransporter {
      async performRequest(): Promise<ResponseBody> {
        return {
          took: 1,
          timed_out: false,
          _shards: {
            total: 1,
            successful: 1,
            skipped: 0,
            failed: 0
          },
          hits: {
            total: { value: 0, relation: "eq" },
            hits: []
          },
          suggest: {
            suggest: [
              {
                length: 1,
                offset: 0,
                text: "test",
                options: []
              }
            ]
          }
        };
      }
    }

    const results = await handleAutocomplete(
      state,
      queryConfig,
      new EmptyResponseApiClient()
    );

    expect(results).toEqual({
      autocompletedResults: [],
      autocompletedSuggestions: {
        documents: [],
        popularQueries: []
      },
      autocompletedResultsRequestId: "",
      autocompletedSuggestionsRequestId: ""
    });
  });

  it("should handle search errors", async () => {
    class ErrorApiClient extends MockApiClientTransporter {
      async performRequest(): Promise<ResponseBody> {
        throw new Error("Search failed");
      }
    }

    await expect(
      handleAutocomplete(state, queryConfig, new ErrorApiClient())
    ).rejects.toThrow("Search failed");
  });

  describe("beforeAutocomplete hooks", () => {
    it("should modify suggestions request using onBeforeAutocompleteSuggestionsCall", async () => {
      const modifiedRequestBody = {
        suggest: {
          suggest: {
            text: "test",
            completion: {
              field: "title"
            }
          }
        }
      };

      const mockPerformRequest = jest.fn().mockResolvedValue(mockResponse);
      const customApiClient = {
        ...apiClient,
        performRequest: mockPerformRequest
      };

      const customBeforeSuggestionsCall = jest.fn(({ requestBody }, next) => {
        return next(modifiedRequestBody);
      });

      const results = await handleAutocomplete(
        state,
        queryConfig,
        customApiClient,
        customBeforeSuggestionsCall
      );

      expect(customBeforeSuggestionsCall).toHaveBeenCalledWith(
        expect.objectContaining({
          requestBody: expect.any(Object),
          requestState: state,
          queryConfig
        }),
        expect.any(Function)
      );
      expect(mockPerformRequest).toHaveBeenCalledWith(modifiedRequestBody);
      expect(results.autocompletedSuggestions.documents).toHaveLength(2);
    });

    it("should modify results request using onBeforeAutocompleteResultsCall", async () => {
      const modifiedRequestBody = {
        query: {
          match: {
            title: "test"
          }
        }
      };

      const mockPerformRequest = jest.fn().mockResolvedValue(mockResponse);
      const customApiClient = {
        ...apiClient,
        performRequest: mockPerformRequest
      };

      const customBeforeResultsCall = jest.fn(({ requestBody }, next) => {
        return next(modifiedRequestBody);
      });

      const results = await handleAutocomplete(
        state,
        queryConfig,
        customApiClient,
        undefined,
        customBeforeResultsCall
      );

      expect(customBeforeResultsCall).toHaveBeenCalledWith(
        expect.objectContaining({
          requestBody: expect.any(Object),
          requestState: state,
          queryConfig
        }),
        expect.any(Function)
      );
      expect(mockPerformRequest).toHaveBeenCalledWith(modifiedRequestBody);
      expect(results.autocompletedResults).toHaveLength(1);
    });
  });
});
