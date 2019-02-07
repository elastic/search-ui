import { setupDriver } from "../../test/helpers";
import { itResetsCurrent } from "../../test/sharedTests";

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
