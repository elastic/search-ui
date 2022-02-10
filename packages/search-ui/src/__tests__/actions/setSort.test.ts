import { setupDriver } from "../../test/helpers";
import { itResetsCurrent, itUpdatesURLState } from "../../test/sharedTests";

// We mock this so no state is actually written to the URL
jest.mock("../../URLManager");
import URLManager from "../../URLManager";
const MockedURLManager = jest.mocked(URLManager, true);

beforeEach(() => {
  MockedURLManager.mockClear();
});

describe("#setSort", () => {
  function subject(sort?, sortDirection?, { initialState = {} } = {}) {
    const { driver, stateAfterCreation, updatedStateAfterAction } = setupDriver(
      { initialState }
    );
    driver.setSort(sort, sortDirection);
    jest.runAllTimers();
    return {
      state: updatedStateAfterAction.state,
      stateAfterCreation: stateAfterCreation
    };
  }

  itUpdatesURLState(URLManager, () => {
    subject("date", "desc");
  });

  it("Updates sortField in state", () => {
    expect(subject("date", "desc").state.sortField).toEqual("date");
  });

  it("Updates sortDirection in state", () => {
    expect(subject("date", "desc").state.sortDirection).toEqual("desc");
  });

  it("Updates sortList in state", () => {
    expect(
      subject([
        {
          field: "states",
          direction: "asc"
        },
        {
          field: "title",
          direction: "desc"
        }
      ]).state.sortList
    ).toEqual([
      {
        field: "states",
        direction: "asc"
      },
      {
        field: "title",
        direction: "desc"
      }
    ]);
  });

  itResetsCurrent(
    () => subject("date", "desc", { initialState: { current: 2 } }).state
  );

  it("Does not update other Search Parameter values", () => {
    const initialState = {
      searchTerm: "test",
      filters: [{ field: "initial", values: ["value"], type: "all" }],
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
