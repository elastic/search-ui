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
  results: [{}, {}]
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

  describe("search", () => {
    function subject(searchTerm = "searchTerm", options = {}) {
      const connector = new AppSearchAPIConnector(params);
      return connector.search(searchTerm, options);
    }

    it("will return a search response", async () => {
      const response = await subject();
      expect(response).toBe(resultList);
    });

    it("will pass params through to search endpoint", async () => {
      const options = {};
      const query = "searchTerm";
      await subject(query, options);
      const [passedQuery, passedOptions] = getLastSearchCall();
      expect(passedQuery).toEqual(query);
      expect(passedOptions).toEqual(options);
    });

    it("will parse out disjunctive facet configuration", async () => {
      const options = {
        facets: {
          field1: {
            type: "value",
            disjunctive: true
          },
          field2: {
            type: "value"
          },
          field3: {
            type: "value",
            disjunctive: true
          }
        }
      };
      await subject("searchTerm", options);
      const [_, passedOptions] = getLastSearchCall();
      expect(passedOptions).toEqual({
        facets: {
          field1: {
            type: "value"
          },
          field2: {
            type: "value"
          },
          field3: {
            type: "value"
          }
        },
        disjunctiveFacets: ["field1", "field3"]
      });
    });

    it("will parse out disjunctive facet configuration", async () => {
      const options = {
        facets: {
          field1: {
            type: "value",
            disjunctive: true
          },
          field2: {
            type: "value"
          },
          field3: {
            type: "value",
            disjunctive: true
          }
        }
      };
      await subject("searchTerm", options);
      const [_, passedOptions] = getLastSearchCall();
      expect(passedOptions).toEqual({
        facets: {
          field1: {
            type: "value"
          },
          field2: {
            type: "value"
          },
          field3: {
            type: "value"
          }
        },
        disjunctiveFacets: ["field1", "field3"]
      });
    });

    it("will filter out the conditional keyword", async () => {
      const options = {
        facets: {
          field1: {
            type: "value",
            conditional: () => {}
          }
        }
      };
      await subject("searchTerm", options);
      const [_, passedOptions] = getLastSearchCall();
      expect(passedOptions).toEqual({
        facets: {
          field1: {
            type: "value"
          }
        }
      });
    });
  });
  describe("click", () => {});
});
