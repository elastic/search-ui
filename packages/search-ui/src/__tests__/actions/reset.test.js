import { DEFAULT_STATE } from "../../SearchDriver";
import { setupDriver } from "../../test/helpers";
import { itUpdatesURLState } from "../../test/sharedTests";

// We mock this so no state is actually written to the URL
jest.mock("../../URLManager.js");
import URLManager from "../../URLManager";

beforeEach(() => {
  URLManager.mockClear();
});

describe("#reset", () => {
  function subject({
    initialState = {
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc"
    }
  } = {}) {
    const { driver, updatedStateAfterAction } = setupDriver({
      initialState
    });

    driver.setSearchTerm("test");

    let updatedStated = updatedStateAfterAction.state;

    // Because we only want to know if it was called AFTER reset is called
    URLManager.mock.instances[0].pushStateToURL.mockClear();

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
      sortDirection: "asc"
    };
    expect(subject({ initialState })).toEqual({
      ...DEFAULT_STATE,
      ...initialState
    });
  });

  itUpdatesURLState(URLManager, () => {
    subject();
  });
});
