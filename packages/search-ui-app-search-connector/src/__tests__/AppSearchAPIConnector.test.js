import * as SwiftypeAppSearch from "swiftype-app-search-javascript";
import AppSearchAPIConnector from "..";

jest.mock("swiftype-app-search-javascript");

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

SwiftypeAppSearch.createClient.mockReturnValue(mockClient);

const resultState = {
  facets: {},
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

  it("will throw when missing required parameters", () => {
    expect(() => {
      new AppSearchAPIConnector({});
    }).toThrow();
  });

  describe("click", () => {
    function subject() {
      const connector = new AppSearchAPIConnector({
        ...params
      });

      return connector.click({
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

  describe("autocompleteClick", () => {
    function subject() {
      const connector = new AppSearchAPIConnector({
        ...params
      });

      return connector.autocompleteClick({
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

  describe("search", () => {
    function subject(state = {}, queryConfig = {}, additionalOptions) {
      if (!state.searchTerm) state.searchTerm = "searchTerm";

      const connector = new AppSearchAPIConnector({
        ...params,
        additionalOptions
      });

      return connector.search(state, queryConfig);
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
        filters: {},
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

    it("will use the additionalOptions parameter to append additional parameters to the search endpoint call", async () => {
      const state = {
        current: 2,
        searchTerm: "searchTerm"
      };
      const additionalOptions = currentOptions => {
        if (currentOptions.page.current === 2) {
          return {
            test: "value"
          };
        }
      };
      await subject(state, {}, additionalOptions);
      const [passedSearchTerm, passedOptions] = getLastSearchCall();
      expect(passedSearchTerm).toEqual(state.searchTerm);
      expect(passedOptions).toEqual({
        filters: {},
        page: {
          current: 2
        },
        test: "value"
      });
    });
  });

  describe("autocomplete", () => {
    function subject(state = {}, queryConfig = {}, additionalOptions) {
      if (!state.searchTerm) state.searchTerm = "searchTerm";

      const connector = new AppSearchAPIConnector({
        ...params,
        additionalOptions
      });

      return connector.autocomplete(state, queryConfig);
    }

    describe("when 'results' type is requested", () => {
      it("will return search state with autocompletedResults set", async () => {
        const state = await subject({}, { results: {} });
        expect(state).toEqual({
          autocompletedResults: resultState.results
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
          filters: {},
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
          filters: {},
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
          autocompletedSuggestions: resultsSuggestions.results
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
          autocompletedResults: resultState.results
        });
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
