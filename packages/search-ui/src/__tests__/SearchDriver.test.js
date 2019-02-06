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

function setupDriver({ initialState, mockSearchResponse }) {
  const driver = new SearchDriver({
    ...params,
    initialState
  });

  if (mockSearchResponse) {
    mockApiConnector.search = jest
      .fn()
      .mockReturnValue({ then: cb => cb(resultListWithoutFacets) });
  }

  const updatedStateAfterAction = {};
  driver.subscribeToStateChanges(newState => {
    updatedStateAfterAction.state = newState;
  });

  return {
    stateAfterCreation: driver.getState(),
    driver,
    updatedStateAfterAction
  };
}

function doesStateHaveResponseData(response) {
  const {
    requestId,
    results,
    totalPages,
    totalResults,
    wasSearched
  } = response;
  return (
    !!results &&
    !!requestId &&
    results.length &&
    totalPages > 0 &&
    totalResults > 0 &&
    !!wasSearched
  );
}

function itResetsCurrent(fn) {
  const state = fn();
  it("resets current", () => {
    expect(state.current).toEqual(1);
  });
}

function itResetsFilters(fn) {
  const state = fn();
  it("resets filters", () => {
    expect(state.filters).toEqual([]);
  });
}

function itFetchesResults(fn) {
  it("fetches results", () => {
    const state = fn();
    expect(doesStateHaveResponseData(state)).toBe(true);
  });
}

it("will use initial state if provided", () => {
  const initialState = {
    current: 3,
    resultsPerPage: 60,
    sortField: "name",
    sortDirection: "asc"
  };

  const { stateAfterCreation } = setupDriver({ initialState });

  expect(stateAfterCreation).toEqual({
    ...DEFAULT_STATE,
    ...initialState
  });
});

it("will default facets to {} in state if facets is missing from the response", () => {
  const initialState = {
    searchTerm: "test"
  };

  const { stateAfterCreation } = setupDriver({
    initialState,
    resultListWithoutFacets
  });

  expect(doesStateHaveResponseData(stateAfterCreation)).toBe(true);
  expect(stateAfterCreation.facets).toEqual({});
});

it("will trigger a search if searchTerm or filters are provided in initial state", () => {
  const initialState = {
    filters: [{ initial: ["value"] }],
    searchTerm: "test"
  };

  const { stateAfterCreation } = setupDriver({
    initialState
  });

  expect(doesStateHaveResponseData(stateAfterCreation)).toBe(true);
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
    expect(Object.keys(actions).length).toBe(10);
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
  });
});

describe("#setSearchTerm", () => {
  function subject(term = "test", { initialState = {} } = {}) {
    const { driver, stateAfterCreation, updatedStateAfterAction } = setupDriver(
      { initialState }
    );
    driver.setSearchTerm(term);
    return {
      state: updatedStateAfterAction.state,
      stateAfterCreation: stateAfterCreation
    };
  }

  it("Updates searchTerm in state", () => {
    expect(subject("test").state.searchTerm).toEqual("test");
  });

  it("Updates resultSearchTerm in state", () => {
    expect(subject("test").state.resultSearchTerm).toEqual("test");
  });

  itResetsCurrent(
    () => subject("test", { initialState: { current: 2 } }).state
  );
  itResetsFilters(
    () =>
      subject("test", { initialState: { filters: [{ filter1: ["value1"] }] } })
        .state
  );

  it("Does not update other Search Parameter values", () => {
    const initialState = {
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc"
    };
    const { resultsPerPage, sortField, sortDirection } = subject("test", {
      initialState
    }).state;

    expect({ resultsPerPage, sortField, sortDirection }).toEqual(initialState);
  });

  itFetchesResults(() => subject().state);
});

describe("#addFilter", () => {
  function subject(
    name,
    value,
    {
      initialFilters = [],
      initialState = {
        filters: initialFilters
      }
    } = {}
  ) {
    const { driver, updatedStateAfterAction } = setupDriver({ initialState });

    driver.addFilter(name, value);
    return updatedStateAfterAction.state;
  }

  itFetchesResults(() => subject("field", "value"));

  itResetsCurrent(() =>
    subject("field", "value", { initialState: { current: 2 } })
  );

  it("Does not update other Search Parameter values", () => {
    const initialState = {
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc",
      searchTerm: "test"
    };
    const { resultsPerPage, sortField, sortDirection, searchTerm } = subject(
      "field",
      "value",
      { initialState }
    );
    expect({ resultsPerPage, sortField, sortDirection, searchTerm }).toEqual(
      initialState
    );
  });

  it("Adds a new filter", () => {
    expect(
      subject("test", "value", { initialFilters: [{ initial: ["value"] }] })
        .filters
    ).toEqual([{ initial: ["value"] }, { test: ["value"] }]);
  });

  it("Adds an additional filter", () => {
    expect(
      subject("test", "value2", {
        initialFilters: [{ initial: ["value"] }, { test: ["value"] }]
      }).filters
    ).toEqual([{ initial: ["value"] }, { test: ["value", "value2"] }]);
  });

  it("Won't add a duplicate filter", () => {
    expect(
      subject("test", "value", {
        initialFilters: [{ initial: ["value"] }, { test: ["value"] }]
      }).filters
    ).toEqual([{ initial: ["value"] }, { test: ["value"] }]);
  });

  it("Supports range filters", () => {
    expect(
      subject(
        "test",
        {
          from: 20,
          to: 100
        },
        { initialFilters: [{ initial: ["value"] }] }
      ).filters
    ).toEqual([{ initial: ["value"] }, { test: [{ from: 20, to: 100 }] }]);
  });

  it("Adds an additional range filter", () => {
    expect(
      subject(
        "test",
        { from: 5, to: 6 },
        {
          initialFilters: [
            { initial: [{ from: 20, to: 100 }] },
            { test: [{ from: 4, to: 5 }] }
          ]
        }
      ).filters
    ).toEqual([
      { initial: [{ from: 20, to: 100 }] },
      { test: [{ from: 4, to: 5 }, { from: 5, to: 6 }] }
    ]);
  });

  it("Won't add a duplicate range filter", () => {
    expect(
      subject(
        "test",
        {
          from: 20,
          to: 100
        },
        {
          initialFilters: [
            { initial: ["value"] },
            { test: [{ from: 20, to: 100 }] }
          ]
        }
      ).filters
    ).toEqual([{ initial: ["value"] }, { test: [{ from: 20, to: 100 }] }]);
  });
});

describe("#setFilter", () => {
  function subject(
    name,
    value,
    {
      initialFilters = [],
      initialState = {
        filters: initialFilters
      }
    } = {}
  ) {
    const { driver, updatedStateAfterAction } = setupDriver({ initialState });

    driver.setFilter(name, value);
    return updatedStateAfterAction.state;
  }

  itFetchesResults(() => subject("field", "value"));

  itResetsCurrent(() =>
    subject("field", "value", { initialState: { current: 2 } })
  );

  it("Does not update other Search Parameter values", () => {
    const initialState = {
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc",
      searchTerm: "test"
    };
    const { resultsPerPage, sortField, sortDirection, searchTerm } = subject(
      "field",
      "value",
      { initialState }
    );
    expect({ resultsPerPage, sortField, sortDirection, searchTerm }).toEqual(
      initialState
    );
  });

  it("Adds a new filter and removes old filters", () => {
    expect(
      subject("test", "value2", { initialFilters: [{ initial: ["value"] }] })
        .filters
    ).toEqual([{ initial: ["value"] }, { test: ["value2"] }]);
  });
});

describe("#removeFilter", () => {
  function subject(
    name,
    value,
    {
      initialFilters = [],
      initialState = {
        filters: initialFilters
      }
    } = {}
  ) {
    const { driver, updatedStateAfterAction } = setupDriver({ initialState });

    driver.removeFilter(name, value);
    return updatedStateAfterAction.state;
  }

  itFetchesResults(() => subject("field", "value"));

  itResetsCurrent(() =>
    subject("field", "value", { initialState: { current: 2 } })
  );

  it("Does not update other Search Parameter values", () => {
    const initialState = {
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc",
      searchTerm: "test"
    };
    const { resultsPerPage, sortField, sortDirection, searchTerm } = subject(
      "field",
      "value",
      { initialState }
    );
    expect({ resultsPerPage, sortField, sortDirection, searchTerm }).toEqual(
      initialState
    );
  });

  it("Removes just 1 filter value", () => {
    expect(
      subject("test", "value", {
        initialFilters: [
          { initial: ["value"] },
          { test: ["anotherValue", "value", "someOtherValue"] }
        ]
      }).filters
    ).toEqual([
      { initial: ["value"] },
      { test: ["anotherValue", "someOtherValue"] }
    ]);
  });

  it("Removes all filters", () => {
    expect(
      subject("test", undefined, {
        initialFilters: [
          { initial: ["value"] },
          { test: ["anotherValue", "value", "someOtherValue"] }
        ]
      }).filters
    ).toEqual([{ initial: ["value"] }]);
  });

  it("Removes all filters when last value", () => {
    expect(
      subject("test", "value", {
        initialFilters: [{ initial: ["value"] }, { test: ["value"] }]
      }).filters
    ).toEqual([{ initial: ["value"] }]);
  });

  it("Removes just 1 range filter value", () => {
    expect(
      subject(
        "test",
        {
          from: 20,
          to: 100
        },
        {
          initialFilters: [
            { initial: [{ from: 20, to: 100 }] },
            { test: ["anotherValue", { from: 20, to: 100 }, "someOtherValue"] }
          ]
        }
      ).filters
    ).toEqual([
      { initial: [{ from: 20, to: 100 }] },
      { test: ["anotherValue", "someOtherValue"] }
    ]);
  });
});

describe("#reset", () => {
  it("Resets state back to the initial state provided at initialization", () => {
    const initialState = {
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc"
    };

    const { driver, updatedStateAfterAction } = setupDriver({ initialState });

    driver.setSearchTerm("test");
    let updatedStated = updatedStateAfterAction.state;

    expect(updatedStated).not.toEqual({
      ...DEFAULT_STATE,
      ...initialState
    });

    driver.reset();
    updatedStated = updatedStateAfterAction.state;

    expect(updatedStated).toEqual({
      ...DEFAULT_STATE,
      ...initialState
    });
  });
});

describe("#clearFilters", () => {
  function subject(
    except,
    {
      initialFilters = [],
      initialState = {
        filters: initialFilters
      }
    } = {}
  ) {
    const { driver, updatedStateAfterAction } = setupDriver({ initialState });

    driver.clearFilters(except);
    return updatedStateAfterAction.state;
  }

  itResetsCurrent(() => subject(null, { initialState: { current: 2 } }));

  it("Does not update other Search Parameter values", () => {
    const initialState = {
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc",
      searchTerm: "test"
    };
    const { resultsPerPage, sortField, sortDirection, searchTerm } = subject(
      null,
      { initialState }
    );
    expect({ resultsPerPage, sortField, sortDirection, searchTerm }).toEqual(
      initialState
    );
  });

  it("Removes all filters", () => {
    expect(
      subject([], {
        initialFilters: [
          ({ initial: ["value"] },
          { test: ["anotherValue", "value", "someOtherValue"] })
        ]
      }).filters
    ).toEqual([]);
  });

  it("Removes all except the filters listed in 'except'", () => {
    expect(
      subject(["initial"], {
        initialFilters: [
          { initial: ["value"] },
          { test: ["anotherValue", "value", "someOtherValue"] }
        ]
      }).filters
    ).toEqual([{ initial: ["value"] }]);
  });
});

describe("#setCurrent", () => {
  function subject(current, { initialState = {} } = {}) {
    const { driver, stateAfterCreation, updatedStateAfterAction } = setupDriver(
      { initialState }
    );
    driver.setCurrent(current);
    return {
      state: updatedStateAfterAction.state,
      stateAfterCreation: stateAfterCreation
    };
  }

  it("Updates searchTerm in state", () => {
    expect(
      subject(2, { initialState: { searchTerm: "test" } }).state.current
    ).toEqual(2);
  });

  it("Does not update other Search Parameter values", () => {
    const initialState = {
      searchTerm: "test",
      filters: [{ initial: ["value"] }],
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc"
    };
    const {
      searchTerm,
      filters,
      resultsPerPage,
      sortField,
      sortDirection
    } = subject(2, {
      initialState
    }).state;

    expect({
      searchTerm,
      filters,
      resultsPerPage,
      sortField,
      sortDirection
    }).toEqual(initialState);
  });
});

describe("#setSort", () => {
  function subject(sortField, sortDirection, { initialState = {} } = {}) {
    const { driver, stateAfterCreation, updatedStateAfterAction } = setupDriver(
      { initialState }
    );
    driver.setSort(sortField, sortDirection);
    return {
      state: updatedStateAfterAction.state,
      stateAfterCreation: stateAfterCreation
    };
  }

  it("Updates sortField in state", () => {
    expect(subject("date", "desc").state.sortField).toEqual("date");
  });

  it("Updates sortDirection in state", () => {
    expect(subject("date", "desc").state.sortDirection).toEqual("desc");
  });

  itResetsCurrent(
    () => subject("date", "desc", { initialState: { current: 2 } }).state
  );

  it("Does not update other Search Parameter values", () => {
    const initialState = {
      searchTerm: "test",
      filters: [{ initial: ["value"] }],
      resultsPerPage: 60
    };
    const { searchTerm, filters, resultsPerPage } = subject("date", "desc", {
      initialState
    }).state;

    expect({
      searchTerm,
      filters,
      resultsPerPage
    }).toEqual(initialState);
  });
});

describe("#setResultsPerPage", () => {
  function subject(resultsPerPage, { initialState = {} } = {}) {
    const { driver, stateAfterCreation, updatedStateAfterAction } = setupDriver(
      { initialState }
    );
    driver.setResultsPerPage(resultsPerPage);
    return {
      state: updatedStateAfterAction.state,
      stateAfterCreation: stateAfterCreation
    };
  }

  it("Updates resultsPerPage in state", () => {
    expect(subject(10).state.resultsPerPage).toEqual(10);
  });

  itResetsCurrent(() => subject(20, { initialState: { current: 2 } }).state);

  it("Does not update other Search Parameter values", () => {
    const initialState = {
      searchTerm: "test",
      filters: [{ initial: ["value"] }],
      sortField: "date",
      sortDirection: "desc"
    };
    const { searchTerm, filters, sortField, sortDirection } = subject(10, {
      initialState
    }).state;

    expect({
      searchTerm,
      filters,
      sortField,
      sortDirection
    }).toEqual(initialState);
  });
});
