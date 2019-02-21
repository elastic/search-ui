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
    function subject({
      searchTerm = "searchTerm",
      options = {},
      additionalOptions
    }) {
      const connector = new AppSearchAPIConnector({
        ...params,
        additionalOptions
      });
      return connector.search(searchTerm, options);
    }

    it("will return a search response", async () => {
      const response = await subject({});
      expect(response).toBe(resultList);
    });

    it("will pass params through to search endpoint", async () => {
      const options = {};
      const searchTerm = "searchTerm";
      await subject({ searchTerm, options });
      const [passedSearchTerm, passedOptions] = getLastSearchCall();
      expect(passedSearchTerm).toEqual(searchTerm);
      expect(passedOptions).toEqual(options);
    });

    it("will use the additionalOptions parameter to append additional parameters to the search endpoint call", async () => {
      const options = {};
      const resultFields = {
        result_fields: { title: { raw: {} } }
      };
      const additionalOptions = () => resultFields;
      const searchTerm = "searchTerm";
      await subject({ additionalOptions, searchTerm, options });
      const [passedSearchTerm, passedOptions] = getLastSearchCall();
      expect(passedSearchTerm).toEqual(searchTerm);
      expect(passedOptions).toEqual({
        ...options,
        ...resultFields
      });
    });
  });
});
