import { DEFAULT_STATE } from "../../SearchDriver";
import { setupDriver } from "../../test/helpers";
import { itUpdatesURLState } from "../../test/sharedTests";
import { SearchState } from "../../types";

// We mock this so no state is actually written to the URL
jest.mock("../../URLManager");
import URLManager from "../../URLManager";
const MockedURLManager = jest.mocked(URLManager, true);

beforeEach(() => {
  MockedURLManager.mockClear();
});

describe("#reset", () => {
  function subject({
    initialState = {
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc",
      sortList: [
        { direction: "asc", field: "name" },
        { direction: "desc", field: "title" }
      ]
    } as SearchState
  } = {}) {
    const { driver, updatedStateAfterAction } = setupDriver({
      initialState
    });

    driver.setSearchTerm("test");

    const updatedStated = updatedStateAfterAction.state;

    // Because we only want to know if it was called AFTER reset is called
    (
      MockedURLManager.mock.instances[0].pushStateToURL as jest.Mock
    ).mockClear();

    expect(updatedStated).not.toEqual({
      ...DEFAULT_STATE,
      ...initialState
    });

    driver.reset();
    return updatedStateAfterAction.state;
  }

  it("Resets state back to the initial state provided at initialization", () => {
    const initialState = {
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc",
      sortList: [
        { direction: "asc", field: "name" },
        { direction: "desc", field: "title" }
      ]
    } as SearchState;
    expect(subject({ initialState })).toEqual({
      ...DEFAULT_STATE,
      ...initialState
    });
  });

  itUpdatesURLState(URLManager, () => {
    subject();
  });
});
