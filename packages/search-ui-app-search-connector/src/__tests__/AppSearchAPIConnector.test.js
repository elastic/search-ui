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
      const current = 2;
      const searchTerm = "searchTerm";
      await subject({ current, searchTerm });
      const [passedSearchTerm, passedOptions] = getLastSearchCall();
      expect(passedSearchTerm).toEqual(searchTerm);
      expect(passedOptions).toEqual({
        filters: {},
        page: {
          current: 2
        }
      });
    });

    it("will use the additionalOptions parameter to append additional parameters to the search endpoint call", async () => {
      const current = 2;
      const searchTerm = "searchTerm";
      const additionalOptions = currentOptions => {
        if (currentOptions.page.current === 2) {
          return {
            test: "value"
          };
        }
      };
      await subject({ current, searchTerm }, additionalOptions);
      const [passedSearchTerm, passedOptions] = getLastSearchCall();
      expect(passedSearchTerm).toEqual(searchTerm);
      expect(passedOptions).toEqual({
        filters: {},
        page: {
          current: 2
        },
        test: "value"
      });
    });
  });
});
