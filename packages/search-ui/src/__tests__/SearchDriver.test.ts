import SearchDriver, { DEFAULT_STATE } from "../SearchDriver";
import {
  Filter,
  SearchQuery,
  SearchState,
  QueryConfig,
  AutocompleteQueryConfig
} from "../types";
import {
  doesStateHaveResponseData,
  setupDriver,
  getMockApiConnector,
  searchResponse,
  getMockApiConnectorWithStateAndActions,
  waitATick
} from "../test/helpers";

// We mock this so no state is actually written to the URL
jest.mock("../URLManager");
import URLManager from "../URLManager";
const MockedURLManager = jest.mocked(URLManager, true);

beforeEach(() => {
  MockedURLManager.mockClear();
});

const mockApiConnector = getMockApiConnector();

const params = {
  apiConnector: mockApiConnector,
  trackUrlState: false
};

function getSearchCalls(specificMockApiConnector = mockApiConnector) {
  return (specificMockApiConnector.onSearch as jest.Mock).mock.calls;
}

function getAutocompleteCalls(specificMockApiConnector = mockApiConnector) {
  return (specificMockApiConnector.onAutocomplete as jest.Mock).mock.calls;
}

beforeEach(() => {
  (mockApiConnector.onAutocomplete as jest.Mock).mockClear();
  (mockApiConnector.onSearch as jest.Mock).mockClear();
  (mockApiConnector.onResultClick as jest.Mock).mockClear();
  (mockApiConnector.onAutocompleteResultClick as jest.Mock).mockClear();
});

it("can be initialized", () => {
  const driver = new SearchDriver({
    ...params,
    onSearch: (test, test2) => Promise.resolve(searchResponse)
  });
  expect(driver).toBeInstanceOf(SearchDriver);
});

it("will use initial state if provided", () => {
  const initialState = {
    current: 3,
    resultsPerPage: 60,
    sortField: "name",
    sortDirection: "asc",
    sortList: [
      { direction: "asc", field: "name" },
      { direction: "desc", field: "title" }
    ]
  } as Partial<SearchState>;

  const { stateAfterCreation } = setupDriver({ initialState });

  expect(stateAfterCreation).toEqual({
    ...DEFAULT_STATE,
    ...initialState
  });
});

it("will merge default and custom a11yNotificationMessages", () => {
  const { driver } = setupDriver({
    a11yNotificationMessages: {
      customMessage: () => "Hello world",
      moreFilter: () => "Example override"
    }
  });
  const messages = driver.a11yNotificationMessages;

  expect(messages.customMessage()).toEqual("Hello world");
  expect(messages.moreFilter()).toEqual("Example override");
  expect(messages.searchResults({ start: 0, end: 0, totalResults: 0 })).toEqual(
    "Showing 0 to 0 results out of 0"
  );
});

it("will default facets to {} in state if facets is missing from the response", () => {
  const initialState = {
    searchTerm: "test"
  };

  const { stateAfterCreation } = setupDriver({
    initialState,
    mockSearchResponse: {
      totalResults: 1000,
      totalPages: 100,
      requestId: "67890",
      results: [{}, {}]
    }
  });

  expect(doesStateHaveResponseData(stateAfterCreation)).toBe(true);
  expect(stateAfterCreation.requestId).toEqual("67890");
  expect(stateAfterCreation.facets).toEqual({});
});

it("will trigger a search if searchTerm or filters are provided in initial state", () => {
  const initialState = {
    filters: [{ field: "initial", values: ["value"], type: "all" }] as Filter[],
    searchTerm: "test"
  };

  const { stateAfterCreation } = setupDriver({
    initialState
  });

  expect(doesStateHaveResponseData(stateAfterCreation)).toBe(true);
});

it("does not do an initial search when alwaysSearchOnInitialLoad is not set", () => {
  const initialState = {};

  const { stateAfterCreation } = setupDriver({ initialState });

  expect(doesStateHaveResponseData(stateAfterCreation)).toBe(0);
});

it("does do an initial search when alwaysSearchOnInitialLoad is set", () => {
  const initialState = {};

  const { stateAfterCreation } = setupDriver({
    initialState,
    alwaysSearchOnInitialLoad: true
  });

  expect(doesStateHaveResponseData(stateAfterCreation)).toBe(true);
});

it("will sync initial state to the URL", () => {
  const initialState = {
    filters: [{ field: "initial", values: ["value"], type: "all" }] as Filter[],
    searchTerm: "test"
  };

  setupDriver({ initialState });

  const pushStateCalls = (
    MockedURLManager.mock.instances[0].pushStateToURL as jest.Mock
  ).mock.calls;
  expect(pushStateCalls).toHaveLength(1);
  // "will sync to the url with 'replace' rather than 'push'"
  expect(pushStateCalls[0][1].replaceUrl).toEqual(true);
});

it("will not sync initial state to the URL if trackURLState is set to false", () => {
  const initialState = {
    filters: [{ field: "initial", values: ["value"], type: "all" }] as Filter[],
    searchTerm: "test"
  };

  setupDriver({ initialState, trackUrlState: false });

  expect(MockedURLManager.mock.instances).toHaveLength(0);
});

describe("searchQuery config", () => {
  describe("conditional facets", () => {
    function subject(conditional) {
      const driver = new SearchDriver({
        ...params,
        initialState: {
          filters: [{ field: "initial", values: ["value"], type: "all" }],
          searchTerm: "test"
        },
        searchQuery: {
          facets: {
            initial: {
              type: "value"
            }
          },
          conditionalFacets: {
            initial: conditional
          }
        }
      });

      jest.runAllTimers();
      driver.setSearchTerm("test");
      jest.runAllTimers();
    }

    it("will fetch a conditional facet that passes its check", () => {
      subject((filters) => !!filters);

      // 'initial' WAS included in request to server
      expect(getSearchCalls()[1][1].facets).toEqual({
        initial: {
          type: "value"
        }
      });
    });

    it("will not pass through `conditionalFacets` prop to connector", () => {
      subject((filters) => !!filters);

      expect(Object.keys(getSearchCalls()[1][1])).not.toContain(
        "conditionalFacets"
      );
    });

    it("will not fetch a conditional facet that fails its check", () => {
      subject((filters) => !filters);

      // 'initial' was NOT included in request to server
      expect(getSearchCalls()[1][1].facets).toEqual({});
    });
  });

  describe("pass through values", () => {
    function subject({
      disjunctiveFacets,
      disjunctiveFacetsAnalyticsTags,
      result_fields,
      search_fields
    }: Partial<SearchQuery>) {
      const driver = new SearchDriver({
        ...params,
        searchQuery: {
          facets: {
            initial: {
              type: "value"
            }
          },
          disjunctiveFacets,
          disjunctiveFacetsAnalyticsTags,
          result_fields,
          search_fields
        }
      });

      jest.runAllTimers();
      driver.setSearchTerm("test");
      jest.runAllTimers();
    }

    it("will pass through facet configuration", () => {
      const facets = {
        initial: {
          type: "value"
        }
      };
      subject({ facets });
      expect(getSearchCalls()[0][1].facets).toEqual({
        initial: {
          type: "value"
        }
      });
    });

    it("will pass through disjunctive facet configuration", () => {
      const disjunctiveFacets = ["initial"];
      subject({ disjunctiveFacets });
      expect(getSearchCalls()[0][1].disjunctiveFacets).toEqual(["initial"]);
    });

    it("will pass through disjunctive facet analytics tags", () => {
      const disjunctiveFacetsAnalyticsTags = ["Test"];
      subject({ disjunctiveFacetsAnalyticsTags });
      expect(getSearchCalls()[0][1].disjunctiveFacetsAnalyticsTags).toEqual([
        "Test"
      ]);
    });

    it("will pass through result_fields configuration", () => {
      const result_fields = { test: {} };
      subject({ result_fields });
      expect(getSearchCalls()[0][1].result_fields).toEqual(result_fields);
    });

    it("will pass through search_fields configuration", () => {
      const search_fields = { test: {} };
      subject({ search_fields });
      expect(getSearchCalls()[0][1].search_fields).toEqual(search_fields);
    });
  });

  describe("filters", () => {
    function subject() {
      const driver = new SearchDriver({
        ...params,
        searchQuery: {
          filters: [{ field: "initial", values: ["value"], type: "all" }]
        }
      });

      jest.runAllTimers();
      driver.setFilter("initial", "newValue", "all");
      driver.setFilter("other", "value", "all");
      jest.runAllTimers();
    }

    it("will merge applied filters and configured filters", () => {
      subject();
      expect(getSearchCalls()[0][0].filters).toEqual([
        { field: "initial", type: "all", values: ["newValue"] },
        { field: "other", type: "all", values: ["value"] }
      ]);
    });

    it("will remove filters parameter from queryConfig since its merged into state", () => {
      subject();
      expect(getSearchCalls()[0][1].filters).not.toBeDefined();
    });
  });
});

describe("autocompleteQuery config", () => {
  function subject(config) {
    const driver = new SearchDriver({
      ...params,
      autocompleteQuery: {
        results: config
      }
    });

    driver.setSearchTerm("test", { refresh: false, autocompleteResults: true });
  }

  it("will pass through result_fields configuration", () => {
    const result_fields = { test: {} };
    subject({ result_fields });
    expect(getAutocompleteCalls()[0][1].results.result_fields).toEqual(
      result_fields
    );
  });

  it("will pass through search_fields configuration", () => {
    const search_fields = { test: {} };
    subject({ search_fields });
    expect(getAutocompleteCalls()[0][1].results.search_fields).toEqual(
      search_fields
    );
  });
});

describe("#getState", () => {
  it("returns the current state", () => {
    const driver = new SearchDriver(params);
    expect(driver.getState()).toEqual(DEFAULT_STATE);
  });
});

describe("subscribeToStateChanges", () => {
  it("will add a subscription", () => {
    const { driver } = setupDriver();
    let called = false;
    driver.subscribeToStateChanges(() => (called = true));
    driver.setSearchTerm("test");
    expect(called).toBe(true);
  });

  it("will add multiple subscriptions", () => {
    const { driver } = setupDriver();
    let called1 = false;
    let called2 = false;
    driver.subscribeToStateChanges(() => (called1 = true));
    driver.subscribeToStateChanges(() => (called2 = true));
    driver.setSearchTerm("test");
    expect(called1).toBe(true);
    expect(called2).toBe(true);
  });

  it("will update own state before notifying subscribers", () => {
    const { driver } = setupDriver();
    let searchTermFromDriver, searchTermFromSubscription, called;
    driver.subscribeToStateChanges((state) => {
      // So that this subscription does not run multiple times
      if (called) return;
      called = true;
      searchTermFromDriver = driver.getState().searchTerm;
      searchTermFromSubscription = state.searchTerm;
    });
    driver.setSearchTerm("newValue");
    expect(searchTermFromDriver).toBe("newValue");
    expect(searchTermFromSubscription).toBe("newValue");
  });
});

describe("unsubscribeToStateChanges", () => {
  it("will remove subscription", () => {
    const { driver } = setupDriver();
    let called1 = false;
    let called2 = false;
    const sub1 = () => (called1 = true);
    const sub2 = () => (called2 = true);
    driver.subscribeToStateChanges(sub1);
    driver.subscribeToStateChanges(sub2);
    driver.setSearchTerm("test");
    expect(called1).toBe(true);
    expect(called2).toBe(true);
    called1 = false;
    called2 = false;
    driver.unsubscribeToStateChanges(sub1);
    driver.setSearchTerm("test");
    expect(called1).toBe(false); // Did not call, unsubscribed
    expect(called2).toBe(true);
  });
});

describe("tearDown", () => {
  it("will remove subscriptions and stop listening for URL changes", () => {
    const { driver } = setupDriver();
    let called1 = false;
    let called2 = false;
    const sub1 = () => (called1 = true);
    const sub2 = () => (called2 = true);
    driver.subscribeToStateChanges(sub1);
    driver.subscribeToStateChanges(sub2);
    driver.setSearchTerm("test");
    expect(called1).toBe(true);
    expect(called2).toBe(true);
    expect(
      (MockedURLManager.mock.instances[0].tearDown as jest.Mock).mock.calls
        .length
    ).toBe(0);
    called1 = false;
    called2 = false;
    driver.tearDown();
    driver.setSearchTerm("test");
    expect(called1).toBe(false); // Did not call, unsubscribed
    expect(called2).toBe(false); // Did not call, unsubscribed
    expect(
      (MockedURLManager.mock.instances[0].tearDown as jest.Mock).mock.calls
        .length
    ).toBe(1);
  });
});

describe("#getActions", () => {
  it("returns the current actions", () => {
    const driver = new SearchDriver(params);
    const actions = driver.getActions();
    expect(Object.keys(actions).length).toBe(12);
    expect(actions.addFilter).toBeInstanceOf(Function);
    expect(actions.clearFilters).toBeInstanceOf(Function);
    expect(actions.removeFilter).toBeInstanceOf(Function);
    expect(actions.reset).toBeInstanceOf(Function);
    expect(actions.setFilter).toBeInstanceOf(Function);
    expect(actions.setResultsPerPage).toBeInstanceOf(Function);
    expect(actions.setSearchTerm).toBeInstanceOf(Function);
    expect(actions.setSort).toBeInstanceOf(Function);
    expect(actions.setCurrent).toBeInstanceOf(Function);
    expect(actions.trackClickThrough).toBeInstanceOf(Function);
    expect(actions.trackAutocompleteClickThrough).toBeInstanceOf(Function);
    expect(actions.a11yNotify).toBeInstanceOf(Function);
  });

  it("includes connector actions if they're available", () => {
    const driver = new SearchDriver({
      apiConnector: getMockApiConnectorWithStateAndActions(),
      trackUrlState: false
    });

    const actions = driver.getActions();
    expect(Object.keys(actions).length).toBe(13);
  });
});

describe("_updateSearchResults", () => {
  const initialState = {
    searchTerm: "test",
    resultsPerPage: 20,
    current: 2
  };

  it("calculates pagingStart and pagingEnd correctly", () => {
    const { stateAfterCreation } = setupDriver({ initialState });

    expect(stateAfterCreation.totalResults).toEqual(1000);
    expect(stateAfterCreation.pagingStart).toEqual(21);
    expect(stateAfterCreation.pagingEnd).toEqual(40);
  });

  it("does not set pagingEnd to more than the total # of results", () => {
    const mockSearchResponse = { totalResults: 30, totalPages: 2 };

    const { stateAfterCreation } = setupDriver({
      initialState,
      mockSearchResponse
    });

    expect(stateAfterCreation.totalResults).toEqual(30);
    expect(stateAfterCreation.pagingStart).toEqual(21);
    expect(stateAfterCreation.pagingEnd).toEqual(30);
  });

  it("calculates pagingEnd correctly when resultsPerPage is one less than totalResults", () => {
    const mockSearchResponse = { totalResults: 41, totalPages: 2 };

    const { stateAfterCreation } = setupDriver({
      initialState,
      mockSearchResponse
    });

    expect(stateAfterCreation.totalResults).toEqual(41);
    expect(stateAfterCreation.pagingStart).toEqual(21);
    expect(stateAfterCreation.pagingEnd).toEqual(40);
  });

  it("zeroes out pagingStart and pagingEnd correctly", () => {
    const mockSearchResponse = { totalResults: 0 };

    const { stateAfterCreation } = setupDriver({
      initialState,
      mockSearchResponse
    });

    expect(stateAfterCreation.totalResults).toEqual(0);
    expect(stateAfterCreation.pagingStart).toEqual(0);
    expect(stateAfterCreation.pagingEnd).toEqual(0);
  });

  it("calls a11yNotify when search results update", () => {
    const searchResultsNotification = jest.fn();

    setupDriver({
      initialState,
      hasA11yNotifications: true,
      a11yNotificationMessages: {
        searchResults: searchResultsNotification
      }
    });

    expect(searchResultsNotification).toHaveBeenCalledWith({
      start: 21,
      end: 40,
      totalResults: 1000,
      searchTerm: "test"
    });
  });
});

describe("When multiple actions are called", () => {
  it("Will batch them into a single API call", () => {
    const { driver, mockApiConnector } = setupDriver();
    driver.setSearchTerm("term");
    driver.addFilter("field1", "value1");
    driver.addFilter("field2", "value2");
    driver.addFilter("field3", "value3");
    jest.runAllTimers();
    expect(getSearchCalls(mockApiConnector)).toHaveLength(1);
    expect(getSearchCalls(mockApiConnector)[0][0].filters).toEqual([
      {
        field: "field1",
        values: ["value1"],
        type: "all"
      },
      {
        field: "field2",
        values: ["value2"],
        type: "all"
      },
      {
        field: "field3",
        values: ["value3"],
        type: "all"
      }
    ]);
  });

  describe("setSearchTerm is called with a debounce", () => {
    it("The original call which should have been triggered by setSearchTerm should be cancelled.", () => {
      const { driver, mockApiConnector } = setupDriver();
      driver.setSearchTerm("park", { refresh: true, debounce: 1000 });
      driver.addFilter("field1", "value1");
      driver.addFilter("field2", "value2");
      driver.addFilter("field3", "value3");
      jest.advanceTimersByTime(500);

      expect(getSearchCalls(mockApiConnector)).toHaveLength(1);
      expect(getSearchCalls(mockApiConnector)[0][0].searchTerm).toEqual("park");
      expect(getSearchCalls(mockApiConnector)[0][0].filters).toEqual([
        {
          field: "field1",
          values: ["value1"],
          type: "all"
        },
        {
          field: "field2",
          values: ["value2"],
          type: "all"
        },
        {
          field: "field3",
          values: ["value3"],
          type: "all"
        }
      ]);

      jest.runAllTimers();
      // If this case were not working correctly, there would have been a second call here
      // which would have cleared out the existing filters, since that is the behavior of a "setSearchTerm"
      // action that is debounced by 1000 milliseconds.
      expect(getSearchCalls(mockApiConnector)).toHaveLength(1);
    });
  });
});

describe("Request sequencing", () => {
  function mockSequenced(
    mockApiConnector,
    firstRequestId,
    secondRequestId,
    method,
    stateFieldToUpdate
  ) {
    let callCount = 0;
    const promiseResolvers = [];
    mockApiConnector[method] = jest.fn().mockImplementation(() => {
      callCount++;
      return new Promise((resolve) => {
        const currentCallCount = callCount;
        promiseResolvers.push(() => {
          resolve({
            [stateFieldToUpdate]:
              currentCallCount === 1 ? firstRequestId : secondRequestId
          });
        });
      });
    });
    return promiseResolvers;
  }

  it("Will ignore old search requests if a new request has already completed", async () => {
    const FIRST_SEARCH_TERM = "term";
    const FIRST_REQUEST_ID = "1";
    const SECOND_SEARCH_TERM = "term2";
    const SECOND_REQUEST_ID = "2";

    const mockApiConnector = getMockApiConnector();
    const onSearchPromiseResolvers = mockSequenced(
      mockApiConnector,
      FIRST_REQUEST_ID,
      SECOND_REQUEST_ID,
      "onSearch",
      "requestId"
    );
    const { driver } = setupDriver({ mockApiConnector });
    jest.runAllTimers();

    let latestRequestId = "";
    driver.subscribeToStateChanges(() => {
      latestRequestId = driver.getState().requestId;
    });

    // Initiate the first request
    driver.setSearchTerm(FIRST_SEARCH_TERM);
    jest.runAllTimers();

    // Initiate the second request
    driver.setSearchTerm(SECOND_SEARCH_TERM);
    jest.runAllTimers();

    // Since we're using promises above, we use "waitATick" to wait for them
    // to complete, rather than just "runAllTimers"
    await waitATick();

    // Note that I'm completing the second request before the first request
    // here
    onSearchPromiseResolvers[1]();
    onSearchPromiseResolvers[0]();

    await waitATick();

    // Since the second request completed after the first request, the
    // value would be "term", and not "term2"
    expect(latestRequestId).toBe(SECOND_REQUEST_ID);
  });

  it("Will ignore old autocomplete requests if a new request has already completed", async () => {
    const FIRST_SEARCH_TERM = "term";
    const FIRST_REQUEST_ID = "1";
    const SECOND_SEARCH_TERM = "term2";
    const SECOND_REQUEST_ID = "2";

    const mockApiConnector = getMockApiConnector();
    const onAutocompletePromiseResolvers = mockSequenced(
      mockApiConnector,
      FIRST_REQUEST_ID,
      SECOND_REQUEST_ID,
      "onAutocomplete",
      "autocompletedResultsRequestId"
    );

    const { driver } = setupDriver({ mockApiConnector });
    jest.runAllTimers();

    let latestRequestId = "";
    driver.subscribeToStateChanges(() => {
      latestRequestId = driver.getState().autocompletedResultsRequestId;
    });

    // Initiate the first request
    driver.setSearchTerm(FIRST_SEARCH_TERM, { autocompleteResults: true });
    jest.runAllTimers();

    // Initiate the second request
    driver.setSearchTerm(SECOND_SEARCH_TERM, { autocompleteResults: true });
    jest.runAllTimers();

    // Since we're using promises above, we use "waitATick" to wait for them
    // to complete, rather than just "runAllTimers"
    await waitATick();

    // Note that I'm completing the second request before the first request
    // here
    onAutocompletePromiseResolvers[1]();

    await waitATick();

    onAutocompletePromiseResolvers[0]();

    await waitATick();

    // Since the second request completed after the first request, the
    // value would be "term", and not "term2"
    expect(latestRequestId).toBe(SECOND_REQUEST_ID);
  });

  it("Will sequence autocomplete and search separately", async () => {
    const FIRST_SEARCH_TERM = "term";
    const FIRST_SEARCH_REQUEST_ID = "1";
    const SECOND_SEARCH_REQUEST_ID = "2";
    const FIRST_AUTOCOMPLETE_REQUEST_ID = "3";
    const SECOND_AUTOCOMPLETE_REQUEST_ID = "4";

    const mockApiConnector = getMockApiConnector();

    const onSearchPromiseResolvers = mockSequenced(
      mockApiConnector,
      FIRST_SEARCH_REQUEST_ID,
      SECOND_SEARCH_REQUEST_ID,
      "onSearch",
      "requestId"
    );

    const onAutocompletePromiseResolvers = mockSequenced(
      mockApiConnector,
      FIRST_AUTOCOMPLETE_REQUEST_ID,
      SECOND_AUTOCOMPLETE_REQUEST_ID,
      "onAutocomplete",
      "autocompletedResultsRequestId"
    );

    const { driver } = setupDriver({ mockApiConnector });
    jest.runAllTimers();

    let latestRequestId = "";
    driver.subscribeToStateChanges(() => {
      latestRequestId = driver.getState().requestId;
    });

    // Initiate the first request
    driver.setSearchTerm(FIRST_SEARCH_TERM, { autocompleteResults: true });
    jest.runAllTimers();

    // Since we're using promises above, we use "waitATick" to wait for them
    // to complete, rather than just "runAllTimers"
    await waitATick();

    // Note that I'm completing the second request before the first request
    // here
    onAutocompletePromiseResolvers[0]();

    await waitATick();

    onSearchPromiseResolvers[0]();

    await waitATick();

    // If the autocomplete request had interfered with the search request, then this would be false
    expect(latestRequestId).toBe(FIRST_SEARCH_REQUEST_ID);
  });

  describe("SearchDriver hooks", () => {
    it("onSearch Hook", () => {
      const onSearchMock = jest
        .fn()
        .mockImplementation(
          async (query: SearchState, searchConfig: QueryConfig, next) => {
            expect(query).toBeDefined();
            expect(query.searchTerm).toBe("hello");
            expect(searchConfig).toBeDefined();
            expect(searchConfig.facets).toEqual({});
            expect(typeof next).toBe("function");
            const x = await next(query, searchConfig);
            return x;
          }
        );
      const mockApiConnector = getMockApiConnector();
      const driver = new SearchDriver({
        apiConnector: mockApiConnector,
        onSearch: onSearchMock
      });

      driver.setSearchTerm("hello");
      jest.runAllTimers();

      expect(onSearchMock).toHaveBeenCalled();
    });

    it("onAutocomplete Hook", () => {
      const onAutocompleteHook = jest
        .fn()
        .mockImplementation(
          (query: SearchState, searchConfig: AutocompleteQueryConfig, next) => {
            expect(query).toBeDefined();
            expect(query.searchTerm).toBe("hello");
            expect(searchConfig).toBeDefined();
            expect(searchConfig.results).toEqual({});
            expect(typeof next).toBe("function");
            return next(query, searchConfig);
          }
        );
      const mockApiConnector = getMockApiConnector();
      const driver = new SearchDriver({
        apiConnector: mockApiConnector,
        onAutocomplete: onAutocompleteHook
      });

      driver.setSearchTerm("hello", { autocompleteResults: true });
      jest.runAllTimers();

      expect(onAutocompleteHook).toHaveBeenCalled();
    });
  });
});
