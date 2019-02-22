import SearchDriver, { DEFAULT_STATE } from "../SearchDriver";

import { searchResponseWithoutFacets } from "../test/fixtures";
import {
  doesStateHaveResponseData,
  setupDriver,
  getMockApiConnector
} from "../test/helpers";

// We mock this so no state is actually written to the URL
jest.mock("../URLManager.js");
import URLManager from "../URLManager";

beforeEach(() => {
  URLManager.mockClear();
});

const mockApiConnector = getMockApiConnector();

const params = {
  apiConnector: mockApiConnector,
  trackUrlState: false
};

function getSearchCalls(specificMockApiConnector) {
  return (specificMockApiConnector || mockApiConnector).search.mock.calls;
}

beforeEach(() => {
  mockApiConnector.search.mockClear();
  mockApiConnector.click.mockClear();
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
    searchResponseWithoutFacets
  });

  expect(doesStateHaveResponseData(stateAfterCreation)).toBe(true);
  expect(stateAfterCreation.facets).toEqual({});
});

it("will trigger a search if searchTerm or filters are provided in initial state", () => {
  const initialState = {
    filters: [{ field: "initial", values: ["value"], type: "all" }],
    searchTerm: "test"
  };

  const { stateAfterCreation } = setupDriver({
    initialState
  });

  expect(doesStateHaveResponseData(stateAfterCreation)).toBe(true);
});

it("will sync initial state to the URL", () => {
  const initialState = {
    filters: [{ field: "initial", values: ["value"], type: "all" }],
    searchTerm: "test"
  };

  setupDriver({ initialState });

  expect(URLManager.mock.instances[0].pushStateToURL.mock.calls).toHaveLength(
    1
  );
});

it("will not sync initial state to the URL if trackURLState is set to false", () => {
  const initialState = {
    filters: [{ field: "initial", values: ["value"], type: "all" }],
    searchTerm: "test"
  };

  setupDriver({ initialState, trackUrlState: false });

  expect(URLManager.mock.instances).toHaveLength(0);
});

describe("conditional facets", () => {
  function subject(conditional) {
    const driver = new SearchDriver({
      ...params,
      initialState: {
        filters: [{ field: "initial", values: ["value"], type: "all" }],
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
    expect(getSearchCalls()[1][1].facets).toEqual({
      initial: {
        type: "value"
      }
    });
  });

  it("will not fetch a conditional facet that fails its check", () => {
    subject(filters => !filters);

    // 'initial' was NOT included in request to server
    expect(getSearchCalls()[1][1].facets).toEqual({});
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
