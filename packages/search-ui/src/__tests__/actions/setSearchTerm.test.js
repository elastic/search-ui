import { getSearchCalls, setupDriver, waitABit } from "../../test/helpers";
import {
  itResetsCurrent,
  itResetsFilters,
  itFetchesResults,
  itUpdatesURLState
} from "../../test/sharedTests";

// We mock this so no state is actually written to the URL
jest.mock("../../URLManager.js");
import URLManager from "../../URLManager";

beforeEach(() => {
  URLManager.mockClear();
});

describe("#setSearchTerm", () => {
  function subject(term, { refresh, initialState = {} } = {}) {
    const { driver, stateAfterCreation, updatedStateAfterAction } = setupDriver(
      { initialState }
    );
    driver.setSearchTerm(term, { refresh });
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
      subject("test", {
        initialState: {
          filters: [
            {
              field: "filter1",
              values: ["value1"],
              type: "all"
            }
          ]
        }
      }).state
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

  itFetchesResults(() => subject("term").state);

  itUpdatesURLState(URLManager, () => {
    subject("term");
  });

  it("Does not update URL state when 'refresh' is set to false", () => {
    subject("term", { refresh: false });
    expect(URLManager.mock.instances[0].pushStateToURL.mock.calls).toHaveLength(
      0
    );
  });

  it("Does not fetch results when 'refresh' is set to false", () => {
    expect(subject("term", { refresh: false }).state.wasSearched).toBe(false);
  });

  it("Will not debounce requests if there is no debounce specified", async () => {
    const { driver, mockApiConnector } = setupDriver();
    driver.setSearchTerm("term", { refresh: true });
    driver.setSearchTerm("term", { refresh: true });
    driver.setSearchTerm("term", { refresh: true });
    expect(getSearchCalls(mockApiConnector)).toHaveLength(3);
  });

  it("Will debounce requests", async () => {
    const { driver, mockApiConnector } = setupDriver();
    driver.setSearchTerm("term", { refresh: true, debounce: 10 });
    driver.setSearchTerm("term", { refresh: true, debounce: 10 });
    driver.setSearchTerm("term", { refresh: true, debounce: 10 });
    await waitABit(100);
    expect(getSearchCalls(mockApiConnector)).toHaveLength(1);
  });
});
