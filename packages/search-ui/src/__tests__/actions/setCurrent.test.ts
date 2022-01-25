import { setupDriver } from "../../test/helpers";
import { itUpdatesURLState } from "../../test/sharedTests";

// We mock this so no state is actually written to the URL
jest.mock("../../URLManager");
import URLManager from "../../URLManager";
const MockedURLManager = jest.mocked(URLManager, true);

beforeEach(() => {
  MockedURLManager.mockClear();
});

describe("#setCurrent", () => {
  function subject(current, { initialState = {} } = {}) {
    const { driver, stateAfterCreation, updatedStateAfterAction } = setupDriver(
      { initialState }
    );
    driver.setCurrent(current);
    jest.runAllTimers();
    return {
      state: updatedStateAfterAction.state,
      stateAfterCreation: stateAfterCreation
    };
  }

  itUpdatesURLState(MockedURLManager, () => {
    subject(2);
  });

  it("Updates searchTerm in state", () => {
    expect(
      subject(2, { initialState: { searchTerm: "test" } }).state.current
    ).toEqual(2);
  });

  it("Does not update other Search Parameter values", () => {
    const initialState = {
      searchTerm: "test",
      filters: [{ field: "initial", values: ["value"], type: "all" }],
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc",
      sortList: [
        { direction: "asc", field: "name" },
        { direction: "desc", field: "title" }
      ]
    };
    const {
      searchTerm,
      filters,
      resultsPerPage,
      sortField,
      sortList,
      sortDirection
    } = subject(2, {
      initialState
    }).state;

    expect({
      searchTerm,
      filters,
      resultsPerPage,
      sortField,
      sortList,
      sortDirection
    }).toEqual(initialState);
  });
});
