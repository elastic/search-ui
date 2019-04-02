import * as SwiftypeAppSearch from "swiftype-app-search-javascript";
import AppSearchAPIConnector from "..";

jest.mock("swiftype-app-search-javascript");

const mockClient = {
  search: jest.fn().mockReturnValue({ then: cb => cb(resultList) }),
  click: jest.fn().mockReturnValue(Promise.resolve())
};

SwiftypeAppSearch.createClient.mockReturnValue(mockClient);

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
  mockClient.click = jest.fn().mockReturnValue({ then: () => {} });
});

function getLastSearchCall() {
  return mockClient.search.mock.calls[0];
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
    function subject(state = {}, additionalOptions) {
      if (!state.searchTerm) state.searchTerm = "searchTerm";

      const connector = new AppSearchAPIConnector({
        ...params,
        additionalOptions
      });

      return connector.search(state);
    }

    it("will return updated search state", async () => {
      const state = await subject();
      expect(state).toEqual(resultState);
    });

    it("will pass params through to search endpoint", async () => {
      const state = {
        current: 2,
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
          current: 2
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
      await subject(state, additionalOptions);
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

  describe("autocompleteResults", () => {
    function subject(state = {}, queryConfig = {}, additionalOptions) {
      if (!state.searchTerm) state.searchTerm = "searchTerm";

      const connector = new AppSearchAPIConnector({
        ...params,
        additionalOptions
      });

      return connector.autocompleteResults(state, queryConfig);
    }

    it("will return updated search state", async () => {
      const state = await subject();
      expect(state).toEqual(resultState);
    });

    it("will pass searchTerm from state through to search endpoint", async () => {
      const state = {
        searchTerm: "searchTerm"
      };

      await subject(state);
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
        current: 2,
        page: {
          size: 5
        },
        sort: {
          name: "desc"
        }
      });
    });
  });
});
