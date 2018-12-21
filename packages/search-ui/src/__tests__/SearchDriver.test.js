import SearchDriver, { DEFAULT_STATE } from "../SearchDriver";

const mockApiConnector = {
  search: jest.fn().mockReturnValue({ then: cb => cb(resultList) }),
  click: jest.fn().mockReturnValue(Promise.resolve())
};

const resultList = {
  info: {
    facets: {},
    meta: {
      page: {
        total_pages: 100,
        total_results: 1000
      },
      request_id: "12345"
    }
  },
  results: [{}, {}]
};

const resultListWithoutFacets = {
  info: {
    meta: {
      page: {
        total_pages: 100,
        total_results: 1000
      },
      request_id: "12345"
    }
  },
  results: [{}, {}]
};

const params = {
  apiConnector: mockApiConnector,
  trackUrlState: false
};

beforeEach(() => {
  mockApiConnector.search = jest
    .fn()
    .mockReturnValue({ then: cb => cb(resultList) });
  mockApiConnector.click = jest.fn().mockReturnValue({ then: () => {} });
});

it("can be initialized", () => {
  const driver = new SearchDriver(params);
  expect(driver).toBeInstanceOf(SearchDriver);
});

it("will throw when missing required parameters", () => {
  expect(() => {
    new SearchDriver({});
  }).toThrow();
});

it("will use initial state if provided", () => {
  const initialState = {
    current: 3,
    resultsPerPage: 60,
    sortField: "name",
    sortDirection: "asc"
  };

  const driver = new SearchDriver({
    ...params,
    initialState
  });
  const stateAfterCreation = driver.getState();

  expect(stateAfterCreation).toEqual({
    ...DEFAULT_STATE,
    ...initialState
  });
});

it("will default facets to {} in state if facets is missing from the response", () => {
  const initialState = {
    searchTerm: "test"
  };

  mockApiConnector.search = jest
    .fn()
    .mockReturnValue({ then: cb => cb(resultListWithoutFacets) });

  const driver = new SearchDriver({
    ...params,
    initialState
  });
  const stateAfterCreation = driver.getState();

  expect(stateAfterCreation).toEqual({
    ...DEFAULT_STATE,
    ...initialState,
    requestId: "12345",
    resultSearchTerm: "test",
    results: [{}, {}],
    totalPages: 100,
    totalResults: 1000,
    wasSearched: true
  });
});

it("will trigger a search if searchTerm or filters are provided in initial state", () => {
  const initialState = {
    filters: [{ initial: ["value"] }],
    searchTerm: "test"
  };

  const driver = new SearchDriver({
    ...params,
    initialState
  });
  const stateAfterCreation = driver.getState();

  expect(stateAfterCreation).toEqual({
    ...DEFAULT_STATE,
    ...initialState,
    resultSearchTerm: "test",
    requestId: "12345",
    results: [{}, {}],
    totalPages: 100,
    totalResults: 1000,
    wasSearched: true
  });
});

describe("conditional facets", () => {
  function subject(conditional) {
    const driver = new SearchDriver({
      ...params,
      initialState: {
        filters: [{ initial: ["value"] }],
        searchTerm: "test"
      },
      facets: {
        initial: {
          type: "value"
        }
      },
      conditionalFacets: {
        initial: conditional
      }
    });

    driver.setSearchTerm("test");
  }

  it("will fetch a conditional facet that passes its check", () => {
    subject(filters => !!filters);

    // 'initial' WAS included in request to server
    expect(mockApiConnector.search.mock.calls[1][1].facets).toEqual({
      initial: {
        type: "value"
      }
    });
  });

  it("will not fetch a conditional facet that fails its check", () => {
    subject(filters => !filters);

    // 'initial' was NOT included in request to server
    expect(mockApiConnector.search.mock.calls[1][1].facets).toEqual({});
  });
});

// disjunctiveFacetsAnalyticsTags
describe("pass through values", () => {
  function subject({
    disjunctiveFacets,
    disjunctiveFacetsAnalyticsTags,
    result_fields,
    search_fields
  }) {
    const driver = new SearchDriver({
      ...params,
      facets: {
        initial: {
          type: "value"
        }
      },
      disjunctiveFacets,
      disjunctiveFacetsAnalyticsTags,
      result_fields,
      search_fields
    });

    driver.setSearchTerm("test");
  }

  it("will pass through disjunctive facet configuration", () => {
    const disjunctiveFacets = ["initial"];
    subject({ disjunctiveFacets });
    expect(mockApiConnector.search.mock.calls[0][1].disjunctiveFacets).toEqual([
      "initial"
    ]);
  });

  it("will pass through disjunctive facet analytics tags", () => {
    const disjunctiveFacetsAnalyticsTags = ["Test"];
    subject({ disjunctiveFacetsAnalyticsTags });
    expect(
      mockApiConnector.search.mock.calls[0][1].disjunctiveFacetsAnalyticsTags
    ).toEqual(["Test"]);
  });

  it("will pass through result_fields configuration", () => {
    const result_fields = { test: {} };
    subject({ result_fields });
    expect(mockApiConnector.search.mock.calls[0][1].result_fields).toEqual(
      result_fields
    );
  });

  it("will pass through search_fields configuration", () => {
    const search_fields = { test: {} };
    subject({ search_fields });
    expect(mockApiConnector.search.mock.calls[0][1].search_fields).toEqual(
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

describe("#getActions", () => {
  it("returns the current state", () => {
    const driver = new SearchDriver(params);
    const actions = driver.getActions();
    expect(actions.addFilter).toBeInstanceOf(Function);
    expect(actions.removeFilter).toBeInstanceOf(Function);
    expect(actions.setResultsPerPage).toBeInstanceOf(Function);
    expect(actions.setSearchTerm).toBeInstanceOf(Function);
    expect(actions.setSort).toBeInstanceOf(Function);
    expect(actions.setCurrent).toBeInstanceOf(Function);
    expect(actions.trackClickThrough).toBeInstanceOf(Function);
  });
});

describe("#setSearchTerm", () => {
  it("Updates state", () => {
    const initialState = {
      current: 2, // RESET
      filters: [
        // RESET
        {
          filter1: ["value1"]
        }
      ],
      resultsPerPage: 60, // KEEP
      sortField: "name", // KEEP
      sortDirection: "asc" // KEEP
    };

    const driver = new SearchDriver({
      ...params,
      initialState
    });
    const stateAfterCreation = driver.getState();

    let updatedState;
    driver.subscribeToStateChanges(newState => {
      updatedState = newState;
    });

    driver.setSearchTerm("test");

    expect(updatedState).toEqual({
      ...stateAfterCreation, // KEPT
      current: 1, // RESET
      filters: [], // RESET
      resultSearchTerm: "test", // UPDATED
      searchTerm: "test" // UPDATED
    });
  });
});

describe("#addFilter", () => {
  function doTest(name, value, initialFilters, expectedFilters) {
    const initialState = {
      filters: initialFilters, // UPDATE
      current: 2, // RESET
      resultsPerPage: 60, // KEEP
      sortField: "name", // KEEP
      sortDirection: "asc" // KEEP
    };

    const driver = new SearchDriver({
      ...params,
      initialState
    });
    const stateAfterCreation = driver.getState();

    let updatedState;
    driver.subscribeToStateChanges(newState => {
      updatedState = newState;
    });

    driver.addFilter(name, value);

    expect(updatedState).toEqual({
      ...stateAfterCreation, // KEPT
      current: 1, // RESET
      filters: expectedFilters // UPDATED
    });
  }

  it("Adds a new filter", () => {
    doTest(
      "test",
      "value",
      [{ initial: ["value"] }],
      [{ initial: ["value"] }, { test: ["value"] }]
    );
  });

  it("Adds an additional filter", () => {
    doTest(
      "test",
      "value2",
      [{ initial: ["value"] }, { test: ["value"] }],
      [{ initial: ["value"] }, { test: ["value", "value2"] }]
    );
  });

  it("Won't add a duplicate filter", () => {
    doTest(
      "test",
      "value",
      [{ initial: ["value"] }, { test: ["value"] }],
      [{ initial: ["value"] }, { test: ["value"] }]
    );
  });

  it("Supports range filters", () => {
    doTest(
      "test",
      {
        from: 20,
        to: 100
      },
      [{ initial: ["value"] }],
      [{ initial: ["value"] }, { test: [{ from: 20, to: 100 }] }]
    );
  });

  it("Adds an additional range filter", () => {
    doTest(
      "test",
      { from: 5, to: 6 },
      [{ initial: [{ from: 20, to: 100 }] }, { test: [{ from: 4, to: 5 }] }],
      [
        { initial: [{ from: 20, to: 100 }] },
        { test: [{ from: 4, to: 5 }, { from: 5, to: 6 }] }
      ]
    );
  });

  it("Won't add a duplicate range filter", () => {
    doTest(
      "test",
      {
        from: 20,
        to: 100
      },
      [{ initial: ["value"] }, { test: [{ from: 20, to: 100 }] }],
      [{ initial: ["value"] }, { test: [{ from: 20, to: 100 }] }]
    );
  });
});

describe("#setFilter", () => {
  function doTest(name, value, initialFilters, expectedFilters) {
    const initialState = {
      filters: initialFilters, // UPDATE
      current: 2, // RESET
      resultsPerPage: 60, // KEEP
      sortField: "name", // KEEP
      sortDirection: "asc" // KEEP
    };

    const driver = new SearchDriver({
      ...params,
      initialState
    });
    const stateAfterCreation = driver.getState();

    let updatedState;
    driver.subscribeToStateChanges(newState => {
      updatedState = newState;
    });

    driver.setFilter(name, value);

    expect(updatedState).toEqual({
      ...stateAfterCreation, // KEPT
      current: 1, // RESET
      filters: expectedFilters // UPDATED
    });
  }

  it("Adds a new filter and removes old filters", () => {
    doTest(
      "test",
      "value2",
      [{ initial: ["value"] }],
      [{ initial: ["value"] }, { test: ["value2"] }]
    );
  });
});

describe("#removeFilter", () => {
  function doTest(name, value, initialFilters, expectedFilters) {
    const initialState = {
      filters: initialFilters, // UPDATE
      current: 2, // RESET
      resultsPerPage: 60, // KEEP
      sortField: "name", // KEEP
      sortDirection: "asc" // KEEP
    };

    const driver = new SearchDriver({
      ...params,
      initialState
    });
    const stateAfterCreation = driver.getState();

    let updatedState;
    driver.subscribeToStateChanges(newState => {
      updatedState = newState;
    });

    driver.removeFilter(name, value);

    expect(updatedState).toEqual({
      ...stateAfterCreation, // KEPT
      current: 1, // RESET
      filters: expectedFilters //UPDATED
    });
  }

  it("Removes just 1 filter value", () => {
    doTest(
      "test",
      "value",
      [
        { initial: ["value"] },
        { test: ["anotherValue", "value", "someOtherValue"] }
      ],
      [{ initial: ["value"] }, { test: ["anotherValue", "someOtherValue"] }]
    );
  });

  it("Removes all filters", () => {
    doTest(
      "test",
      undefined,
      [
        { initial: ["value"] },
        { test: ["anotherValue", "value", "someOtherValue"] }
      ],
      [{ initial: ["value"] }]
    );
  });

  it("Removes all filters when last value", () => {
    doTest(
      "test",
      "value",
      [{ initial: ["value"] }, { test: ["value"] }],
      [{ initial: ["value"] }]
    );
  });

  it("Removes just 1 range filter value", () => {
    doTest(
      "test",
      {
        from: 20,
        to: 100
      },
      [
        { initial: [{ from: 20, to: 100 }] },
        { test: ["anotherValue", { from: 20, to: 100 }, "someOtherValue"] }
      ],
      [
        { initial: [{ from: 20, to: 100 }] },
        { test: ["anotherValue", "someOtherValue"] }
      ]
    );
  });
});

describe("#clearFilters", () => {
  function doTest(except, initialFilters, expectedFilters) {
    const initialState = {
      filters: initialFilters, // UPDATE
      current: 2, // RESET
      resultsPerPage: 60, // KEEP
      sortField: "name", // KEEP
      sortDirection: "asc" // KEEP
    };

    const driver = new SearchDriver({
      ...params,
      initialState
    });
    const stateAfterCreation = driver.getState();

    let updatedState;
    driver.subscribeToStateChanges(newState => {
      updatedState = newState;
    });

    driver.clearFilters(except);

    expect(updatedState).toEqual({
      ...stateAfterCreation, // KEPT
      current: 1, // RESET
      filters: expectedFilters //UPDATED
    });
  }

  it("Removes all filters", () => {
    doTest(
      [],
      [
        ({ initial: ["value"] },
        { test: ["anotherValue", "value", "someOtherValue"] })
      ],
      []
    );
  });

  it("Removes all except the filters listed in 'except'", () => {
    doTest(
      ["initial"],
      [
        { initial: ["value"] },
        { test: ["anotherValue", "value", "someOtherValue"] }
      ],
      [{ initial: ["value"] }]
    );
  });
});

describe("#setCurrent", () => {
  it("Updates state", () => {
    const initialState = {
      filters: [{ initial: ["value"] }], // KEEP
      searchTerm: "test", // KEEP
      current: 1, // UPDATE
      resultsPerPage: 60, // KEEP
      sortField: "name", // KEEP
      sortDirection: "asc" // KEEP
    };

    const driver = new SearchDriver({
      ...params,
      initialState
    });
    const stateAfterCreation = driver.getState();

    let updatedState;
    driver.subscribeToStateChanges(newState => {
      updatedState = newState;
    });

    driver.setCurrent(2);

    expect(updatedState).toEqual({
      ...stateAfterCreation, // KEPT
      current: 2 // UPDATED
    });
  });
});

describe("#setSort", () => {
  it("Updates state", () => {
    const initialState = {
      filters: [{ initial: ["value"] }], // KEEP
      searchTerm: "test", // KEEP
      current: 3, // RESET
      resultsPerPage: 60, // KEPT
      sortField: "name", // UPDATE
      sortDirection: "asc" // UPDATE
    };

    const driver = new SearchDriver({
      ...params,
      initialState
    });
    const stateAfterCreation = driver.getState();

    let updatedState;
    driver.subscribeToStateChanges(newState => {
      updatedState = newState;
    });

    driver.setSort("date", "desc");

    expect(updatedState).toEqual({
      ...stateAfterCreation, // KEPT
      current: 1, // RESET
      sortField: "date", // UPDATED
      sortDirection: "desc" // UPDATED
    });
  });
});

describe("#setResultsPerPage", () => {
  it("Updates state", () => {
    const initialState = {
      filters: [{ initial: ["value"] }], // KEEP
      searchTerm: "test", // KEEP
      current: 3, // RESET
      resultsPerPage: 60, // UPDATE
      sortField: "name", // KEEP
      sortDirection: "asc" // KEEP
    };

    const driver = new SearchDriver({
      ...params,
      initialState
    });
    const stateAfterCreation = driver.getState();

    let updatedState;
    driver.subscribeToStateChanges(newState => {
      updatedState = newState;
    });

    driver.setResultsPerPage(20);

    expect(updatedState).toEqual({
      ...stateAfterCreation, // KEPT
      current: 1, // RESET
      resultsPerPage: 20
    });
  });
});
