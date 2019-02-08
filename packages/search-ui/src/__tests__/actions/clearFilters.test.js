import { setupDriver } from "../../test/helpers";
import { itResetsCurrent } from "../../test/sharedTests";

// We mock this so no state is actually written to the URL
jest.mock("../../URLManager.js");

describe("#clearFilters", () => {
  function subject(
    except,
    {
      initialFilters = [],
      initialState = {
        filters: initialFilters
      }
    } = {}
  ) {
    const { driver, updatedStateAfterAction } = setupDriver({
      initialState
    });

    driver.clearFilters(except);
    return updatedStateAfterAction.state;
  }

  itResetsCurrent(() => subject(null, { initialState: { current: 2 } }));

  it("Does not update other Search Parameter values", () => {
    const initialState = {
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc",
      searchTerm: "test"
    };
    const { resultsPerPage, sortField, sortDirection, searchTerm } = subject(
      null,
      { initialState }
    );
    expect({ resultsPerPage, sortField, sortDirection, searchTerm }).toEqual(
      initialState
    );
  });

  it("Removes all filters", () => {
    expect(
      subject([], {
        initialFilters: [
          ({ initial: ["value"] },
          { test: ["anotherValue", "value", "someOtherValue"] })
        ]
      }).filters
    ).toEqual([]);
  });

  it("Removes all except the filters listed in 'except'", () => {
    expect(
      subject(["initial"], {
        initialFilters: [
          { initial: ["value"] },
          { test: ["anotherValue", "value", "someOtherValue"] }
        ]
      }).filters
    ).toEqual([{ initial: ["value"] }]);
  });
});
