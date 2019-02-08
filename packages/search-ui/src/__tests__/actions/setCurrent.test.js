import { setupDriver } from "../../test/helpers";

// We mock this so no state is actually written to the URL
jest.mock("../../URLManager.js");

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
