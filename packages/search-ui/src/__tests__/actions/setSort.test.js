import { setupDriver } from "../../test/helpers";
import { itResetsCurrent, itUpdatesURLState } from "../../test/sharedTests";

// We mock this so no state is actually written to the URL
jest.mock("../../URLManager.js");
import URLManager from "../../URLManager";

beforeEach(() => {
  URLManager.mockClear();
});

describe("#setSort", () => {
  function subject(
    sortField,
    sortDirection,
    sortList,
    { initialState = {} } = {}
  ) {
    const { driver, stateAfterCreation, updatedStateAfterAction } = setupDriver(
      { initialState }
    );
    driver.setSort(sortField, sortDirection, sortList);
    jest.runAllTimers();
    return {
      state: updatedStateAfterAction.state,
      stateAfterCreation: stateAfterCreation
    };
  }

  itUpdatesURLState(URLManager, () => {
    subject("date", "desc", [{ states: "asc" }, { title: "desc" }]);
  });

  it("Updates sortField in state", () => {
    expect(subject("date", "desc").state.sortField).toEqual("date");
  });

  it("Updates sortDirection in state", () => {
    expect(subject("date", "desc").state.sortDirection).toEqual("desc");
  });

  it("Updates sortList in state", () => {
    expect(
      subject("date", "desc", [{ states: "asc" }, { title: "desc" }]).state
        .sortList
    ).toEqual([{ states: "asc" }, { title: "desc" }]);
  });

  itResetsCurrent(
    () =>
      subject("date", "desc", [{ states: "asc" }, { title: "desc" }], {
        initialState: { current: 2 }
      }).state
  );

  it("Does not update other Search Parameter values", () => {
    const initialState = {
      searchTerm: "test",
      filters: [{ field: "initial", values: ["value"], type: "all" }],
      resultsPerPage: 60
    };
    const { searchTerm, filters, resultsPerPage } = subject(
      "date",
      "desc",
      [{ states: "asc" }, { title: "desc" }],
      {
        initialState
      }
    ).state;

    expect({
      searchTerm,
      filters,
      resultsPerPage
    }).toEqual(initialState);
  });
});
