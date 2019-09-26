import { setupDriver } from "../../test/helpers";
import { itResetsCurrent, itUpdatesURLState } from "../../test/sharedTests";

// We mock this so no state is actually written to the URL
jest.mock("../../URLManager.js");
import URLManager from "../../URLManager";

beforeEach(() => {
  URLManager.mockClear();
});

describe("#setResultsPerPage", () => {
  function subject(resultsPerPage, { initialState = {} } = {}) {
    const { driver, stateAfterCreation, updatedStateAfterAction } = setupDriver(
      { initialState }
    );
    driver.setResultsPerPage(resultsPerPage);
    jest.runAllTimers();
    return {
      state: updatedStateAfterAction.state,
      stateAfterCreation: stateAfterCreation
    };
  }

  it("Updates resultsPerPage in state", () => {
    expect(subject(10).state.resultsPerPage).toEqual(10);
  });

  itUpdatesURLState(URLManager, () => {
    subject(20);
  });

  itResetsCurrent(() => subject(20, { initialState: { current: 2 } }).state);

  it("Does not update other Search Parameter values", () => {
    const initialState = {
      searchTerm: "test",
      filters: [{ field: "initial", values: ["value"], type: "all" }],
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
