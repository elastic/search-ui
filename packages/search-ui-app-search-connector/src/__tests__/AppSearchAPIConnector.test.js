import * as ElasticAppSearch from "@elastic/app-search-javascript";
import AppSearchAPIConnector from "..";

jest.mock("@elastic/app-search-javascript");

const resultsSuggestions = {
  results: {
    documents: [
      {
        suggestion: "carlsbad"
      },
      {
        suggestion: "carlsbad caverns"
      },
      {
        suggestion: "carolina"
      }
    ]
  },
  meta: {
    request_id: "914f909793379ed5af9379b4401f19be"
  }
};

const resultList = {
  info: {
    facets: {},
    meta: {
      page: {
        total_results: 1000
      },
      request_id: "12345"
    }
  },
  rawResults: [{}, {}]
};

const mockClient = {
  search: jest.fn().mockReturnValue({ then: cb => cb(resultList) }),
  querySuggestion: jest
    .fn()
    .mockReturnValue({ then: cb => cb(resultsSuggestions) }),
  click: jest.fn().mockReturnValue(Promise.resolve())
};

ElasticAppSearch.createClient.mockReturnValue(mockClient);

const resultState = {
  facets: {},
  rawResponse: {
    info: {
      facets: {},
      meta: {
        page: {
          total_results: 1000
        },
        request_id: "12345"
      }
    },
    rawResults: [{}, {}]
  },
  results: [{}, {}],
  totalResults: 1000,
  requestId: "12345"
};

const params = {
  engineName: "some-engine",
  hostIdentifier: "host-XXXX",
  searchKey: "search-XXXXX"
};

beforeEach(() => {
  mockClient.search = jest.fn().mockReturnValue({ then: cb => cb(resultList) });
  mockClient.querySuggestion = jest
    .fn()
    .mockReturnValue({ then: cb => cb(resultsSuggestions) });
  mockClient.click = jest.fn().mockReturnValue({ then: () => {} });
});

function getLastSearchCall() {
  return mockClient.search.mock.calls[0];
}

function getLastSuggestCall() {
  return mockClient.querySuggestion.mock.calls[0];
}

function getLastClickCall() {
  return mockClient.click.mock.calls[0];
}

describe("AppSearchAPIConnector", () => {
  it("can be initialized", () => {
    const connector = new AppSearchAPIConnector(params);
    expect(connector).toBeInstanceOf(AppSearchAPIConnector);
  });

  it("can be initialized with endpointBase", () => {
    let newParams = { ...params };
    newParams.hostIdentifier = undefined;
    newParams.endpointBase = "http://localhost:3001";

    const connector = new AppSearchAPIConnector(newParams);
    expect(connector).toBeInstanceOf(AppSearchAPIConnector);
  });

  it("will throw when missing required parameters", () => {
    expect(() => {
      new AppSearchAPIConnector({});
    }).toThrow();
  });

  describe("onResultClick", () => {
    function subject() {
      const connector = new AppSearchAPIConnector({
        ...params
      });

      return connector.onResultClick({
        query: "test",
        documentId: "11111",
        requestId: "12345",
        tags: ["test"]
      });
    }

    it("calls the App Search click endpoint", () => {
      subject();
      expect(getLastClickCall()).toBeDefined();
    });

    it("passes query, documentId, and requestId to the click endpoint", () => {
      subject();
      const [{ query, documentId, requestId }] = getLastClickCall();
      expect(query).toEqual("test");
      expect(documentId).toEqual("11111");
      expect(requestId).toEqual("12345");
    });

    it("appends tags to a base 'results' tag", () => {
      subject();
      const [{ tags }] = getLastClickCall();
      expect(tags).toEqual(["test", "results"]);
    });
  });

  describe("onAutocompleteResultClick", () => {
    function subject() {
      const connector = new AppSearchAPIConnector({
        ...params
      });

      return connector.onAutocompleteResultClick({
        query: "test",
        documentId: "11111",
        requestId: "12345",
        tags: ["test"]
      });
    }

    it("calls the App Search click endpoint", () => {
      subject();
      expect(getLastClickCall()).toBeDefined();
    });

    it("passes query, documentId, and requestId to the click endpoint", () => {
      subject();
      const [{ query, documentId, requestId }] = getLastClickCall();
      expect(query).toEqual("test");
      expect(documentId).toEqual("11111");
      expect(requestId).toEqual("12345");
    });

    it("appends tags to a base 'autocomplete' tag", () => {
      subject();
      const [{ tags }] = getLastClickCall();
      expect(tags).toEqual(["test", "autocomplete"]);
    });
  });

  describe("onSearch", () => {
    function subject(state = {}, queryConfig = {}, beforeSearchCall) {
      if (!state.searchTerm) state.searchTerm = "searchTerm";

      const connector = new AppSearchAPIConnector({
        ...params,
        beforeSearchCall
      });

      return connector.onSearch(state, queryConfig);
    }

    it("will return updated search state", async () => {
      const state = await subject();
      expect(state).toEqual(resultState);
    });

    it("will pass request state through to search endpoint", async () => {
      const state = {
        current: 2,
        resultsPerPage: 10,
        searchTerm: "searchTerm",
        filters: [
          {
            field: "world_heritage_site",
            values: ["true"],
            type: "all"
          }
        ],
        sortDirection: "desc",
        sortField: "name"
      };

      await subject(state);
      const [passedSearchTerm, passedOptions] = getLastSearchCall();
      expect(passedSearchTerm).toEqual(state.searchTerm);
      expect(passedOptions).toEqual({
        filters: {
          all: [
            {
              all: [
                {
                  world_heritage_site: "true"
                }
              ]
            }
          ]
        },
        sort: {
          name: "desc"
        },
        page: {
          current: 2,
          size: 10
        }
      });
    });

    it("will pass queryConfig to search endpoint", async () => {
      const state = {
        searchTerm: "searchTerm"
      };

      const queryConfig = {
        facets: {
          states: {
            type: "value",
            size: 30
          }
        },
        result_fields: {
          title: { raw: {}, snippet: { size: 20, fallback: true } }
        },
        search_fields: {
          title: {},
          description: {},
          states: {}
        }
      };

      await subject(state, queryConfig);
      const [passedSearchTerm, passedOptions] = getLastSearchCall();
      expect(passedSearchTerm).toEqual(state.searchTerm);
      expect(passedOptions).toEqual({
        facets: {
          states: {
            type: "value",
            size: 30
          }
        },
        page: {},
        result_fields: {
          title: { raw: {}, snippet: { size: 20, fallback: true } }
        },
        search_fields: {
          title: {},
          description: {},
          states: {}
        }
      });
    });

    it("will not pass empty facets or filter state to search endpoint", async () => {
      const state = {
        searchTerm: "searchTerm",
        filters: [],
        facets: {}
      };

      const queryConfig = {
        filters: [],
        facets: {}
      };

      await subject(state, queryConfig);
      // eslint-disable-next-line no-unused-vars
      const [passedSearchTerm, passedOptions] = getLastSearchCall();
      expect(passedOptions).toEqual({
        page: {}
      });
    });

    it("will pass request parameter state provided to queryConfig, overriding the same value provided in state", async () => {
      const state = {
        searchTerm: "searchTerm",
        current: 1,
        resultsPerPage: 10,
        sortDirection: "desc",
        sortField: "name",
        filters: [
          {
            field: "title",
            type: "all",
            values: ["Acadia", "Grand Canyon"]
          },
          {
            field: "world_heritage_site",
            values: ["true"],
            type: "all"
          }
        ]
      };

      const queryConfig = {
        current: 2,
        resultsPerPage: 5,
        sortDirection: "asc",
        sortField: "title",
        filters: [
          {
            field: "date_made",
            values: ["yesterday"],
            type: "all"
          }
        ]
      };

      await subject(state, queryConfig);
      const [passedSearchTerm, passedOptions] = getLastSearchCall();
      expect(passedSearchTerm).toEqual(state.searchTerm);
      expect(passedOptions).toEqual({
        filters: {
          all: [
            {
              all: [
                {
                  date_made: "yesterday"
                }
              ]
            }
          ]
        },
        sort: {
          title: "asc"
        },
        page: {
          current: 2,
          size: 5
        }
      });
    });

    it("will use the beforeSearchCall parameter to amend option parameters to the search endpoint call", async () => {
      const state = {
        current: 2,
        searchTerm: "searchTerm"
      };

      const queryConfig = {
        sortDirection: "desc",
        sortField: "name",
        resultsPerPage: 5
      };

      const beforeSearchCall = (options, next) => {
        // Remove sort_direction and sort_field
        // eslint-disable-next-line no-unused-vars
        const { sort, ...rest } = options;
        return next({
          ...rest,
          // Add test
          test: "value"
        });
      };

      await subject(state, queryConfig, beforeSearchCall);

      expect(getLastSearchCall()).toEqual([
        state.searchTerm,
        {
          page: {
            current: 2,
            size: 5
          },
          test: "value"
        }
      ]);
    });
  });

  describe("onAutocomplete", () => {
    function subject(
      state = {},
      queryConfig = {},
      { beforeAutocompleteResultsCall, beforeAutocompleteSuggestionsCall } = {}
    ) {
      if (!state.searchTerm) state.searchTerm = "searchTerm";

      const connector = new AppSearchAPIConnector({
        ...params,
        beforeAutocompleteResultsCall,
        beforeAutocompleteSuggestionsCall
      });

      return connector.onAutocomplete(state, queryConfig);
    }

    describe("when 'results' type is requested", () => {
      it("will return search state with autocompletedResults set", async () => {
        const state = await subject({}, { results: {} });
        expect(state).toEqual({
          autocompletedResults: resultState.results,
          autocompletedResultsRequestId: resultState.requestId
        });
      });

      it("will pass searchTerm from state through to search endpoint", async () => {
        const state = {
          searchTerm: "searchTerm"
        };

        await subject(state, { results: {} });
        const [passedSearchTerm, passedOptions] = getLastSearchCall();
        expect(passedSearchTerm).toEqual(state.searchTerm);
        expect(passedOptions).toEqual({
          page: {}
        });
      });

      it("will pass queryConfig to search endpoint", async () => {
        const state = {
          searchTerm: "searchTerm"
        };

        const queryConfig = {
          results: {
            result_fields: {
              title: { raw: {}, snippet: { size: 20, fallback: true } }
            },
            search_fields: {
              title: {},
              description: {},
              states: {}
            }
          }
        };

        await subject(state, queryConfig);
        const [passedSearchTerm, passedOptions] = getLastSearchCall();
        expect(passedSearchTerm).toEqual(state.searchTerm);
        expect(passedOptions).toEqual({
          page: {},
          result_fields: {
            title: { raw: {}, snippet: { size: 20, fallback: true } }
          },
          search_fields: {
            title: {},
            description: {},
            states: {}
          }
        });
      });

      it("will not pass empty facets or filter state to search endpoint", async () => {
        const state = {
          searchTerm: "searchTerm",
          filters: [],
          facets: {}
        };

        const queryConfig = {
          results: {
            filters: [],
            facets: {}
          }
        };

        await subject(state, queryConfig);
        // eslint-disable-next-line no-unused-vars
        const [passedSearchTerm, passedOptions] = getLastSearchCall();
        expect(passedOptions).toEqual({
          page: {}
        });
      });

      it("will pass request parameter state provided to queryConfig", async () => {
        const state = {
          searchTerm: "searchTerm"
        };

        const queryConfig = {
          results: {
            current: 2,
            resultsPerPage: 5,
            filters: [
              {
                field: "world_heritage_site",
                values: ["true"],
                type: "all"
              }
            ],
            sortDirection: "desc",
            sortField: "name"
          }
        };

        await subject(state, queryConfig);
        const [passedSearchTerm, passedOptions] = getLastSearchCall();
        expect(passedSearchTerm).toEqual(state.searchTerm);
        expect(passedOptions).toEqual({
          filters: {
            all: [
              {
                all: [
                  {
                    world_heritage_site: "true"
                  }
                ]
              }
            ]
          },
          page: {
            current: 2,
            size: 5
          },
          sort: {
            name: "desc"
          }
        });
      });
    });

    describe("when 'suggestions' type is requested", () => {
      it("will return search state with autocompletedSuggestions set", async () => {
        const state = await subject({}, { suggestions: {} });
        expect(state).toEqual({
          autocompletedSuggestions: resultsSuggestions.results,
          autocompletedSuggestionsRequestId: resultsSuggestions.meta.request_id
        });
      });

      it("will pass searchTerm from state through to search endpoint", async () => {
        const state = {
          searchTerm: "searchTerm"
        };

        await subject(state, { suggestions: {} });
        const [passedSearchTerm, passedOptions] = getLastSuggestCall();
        expect(passedSearchTerm).toEqual(state.searchTerm);
        expect(passedOptions).toEqual({});
      });

      it("will pass queryConfig to search endpoint", async () => {
        const state = {
          searchTerm: "searchTerm"
        };

        const queryConfig = {
          suggestions: {
            types: {
              documents: {
                fields: ["title"]
              }
            }
          }
        };

        await subject(state, queryConfig);
        const [passedSearchTerm, passedOptions] = getLastSuggestCall();
        expect(passedSearchTerm).toEqual(state.searchTerm);
        expect(passedOptions).toEqual({
          types: {
            documents: {
              fields: ["title"]
            }
          }
        });
      });
    });

    describe("when 'results' and 'suggestions' type are both requested", () => {
      it("will return search state with autocompletedSuggestions and autocompletedResults set", async () => {
        const state = await subject({}, { suggestions: {}, results: {} });
        expect(state).toEqual({
          autocompletedSuggestions: resultsSuggestions.results,
          autocompletedSuggestionsRequestId: resultsSuggestions.meta.request_id,
          autocompletedResults: resultState.results,
          autocompletedResultsRequestId: resultState.requestId
        });
      });
    });

    describe("beforeAutocompleteResultsCall", () => {
      it("will use the beforeAutocompleteResultsCall parameter to amend option parameters to the search endpoint call", async () => {
        const state = {
          current: 2,
          searchTerm: "searchTerm"
        };

        const queryConfig = {
          results: {
            sortDirection: "desc",
            sortField: "name",
            resultsPerPage: 5
          }
        };

        const beforeAutocompleteResultsCall = (options, next) => {
          // Remove sort_direction and sort_field
          // eslint-disable-next-line no-unused-vars
          const { sort, ...rest } = options;
          return next({
            ...rest,
            // Add test
            test: "value"
          });
        };

        await subject(state, queryConfig, { beforeAutocompleteResultsCall });

        expect(getLastSearchCall()).toEqual([
          state.searchTerm,
          {
            page: {
              size: 5
            },
            test: "value"
          }
        ]);
      });
    });

    describe("beforeAutocompleteSuggestionsCall", () => {
      it("will use the beforeAutocompleteSuggestionsCall parameter to amend option parameters to the search endpoint call", async () => {
        const state = {
          current: 2,
          searchTerm: "searchTerm",
          sortDirection: "desc",
          sortField: "name"
        };

        const queryConfig = {
          suggestions: {}
        };

        const beforeAutocompleteSuggestionsCall = (options, next) => {
          // Remove sort_direction and sort_field
          // eslint-disable-next-line no-unused-vars
          const { sort, ...rest } = options;
          return next({
            ...rest,
            // Add test
            test: "value"
          });
        };

        await subject(state, queryConfig, {
          beforeAutocompleteSuggestionsCall
        });

        expect(getLastSuggestCall()).toEqual([
          state.searchTerm,
          {
            test: "value"
          }
        ]);

        await subject(
          {},
          { suggestions: {} },
          {
            beforeAutocompleteSuggestionsCall: (queryOptions, next) =>
              next({
                ...queryOptions,
                test: "value"
              })
          }
        );
        // eslint-disable-next-line no-unused-vars
        const [_, passedOptions] = getLastSuggestCall();
        expect(passedOptions).toEqual({ test: "value" });
      });
    });

    describe("when no type is requested", () => {
      it("will return empty state", async () => {
        const state = await subject({}, {});
        expect(state).toEqual({});
      });
    });
  });
});
