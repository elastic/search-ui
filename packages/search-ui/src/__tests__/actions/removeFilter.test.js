import { setupDriver } from "../../test/helpers";
import {
  itResetsCurrent,
  itFetchesResults,
  itUpdatesURLState
} from "../../test/sharedTests";

// We mock this so no state is actually written to the URL
jest.mock("../../URLManager.js");
import URLManager from "../../URLManager";

beforeEach(() => {
  URLManager.mockClear();
});

describe("#removeFilter", () => {
  function subject(
    name,
    value,
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

    driver.removeFilter(name, value);
    return updatedStateAfterAction.state;
  }

  itFetchesResults(() => subject("field", "value"));

  itResetsCurrent(() =>
    subject("field", "value", { initialState: { current: 2 } })
  );

  itUpdatesURLState(URLManager, () => {
    subject("field", "value");
  });

  it("Does not update other Search Parameter values", () => {
    const initialState = {
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc",
      searchTerm: "test"
    };
    const { resultsPerPage, sortField, sortDirection, searchTerm } = subject(
      "field",
      "value",
      { initialState }
    );
    expect({ resultsPerPage, sortField, sortDirection, searchTerm }).toEqual(
      initialState
    );
  });

  it("Removes just 1 filter value", () => {
    expect(
      subject("test", "value", {
        initialFilters: [
          { field: "initial", values: ["value"], type: "all" },
          {
            field: "test",
            values: ["anotherValue", "value", "someOtherValue"],
            type: "all"
          }
        ]
      }).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all" },
      {
        field: "test",
        values: ["anotherValue", "someOtherValue"],
        type: "all"
      }
    ]);
  });

  it("Removes all filters", () => {
    expect(
      subject("test", undefined, {
        initialFilters: [
          { field: "initial", values: ["value"], type: "all" },
          {
            field: "test",
            values: ["anotherValue", "value", "someOtherValue"],
            type: "all"
          }
        ]
      }).filters
    ).toEqual([{ field: "initial", values: ["value"], type: "all" }]);
  });

  it("Removes all filters when last value", () => {
    expect(
      subject("test", "value", {
        initialFilters: [
          { field: "initial", values: ["value"], type: "all" },
          { field: "test", values: ["value"], type: "all" }
        ]
      }).filters
    ).toEqual([{ field: "initial", values: ["value"], type: "all" }]);
  });

  it("Removes just 1 range filter value", () => {
    expect(
      subject(
        "test",
        {
          from: 20,
          to: 100
        },
        {
          initialFilters: [
            { field: "initial", values: [{ from: 20, to: 100 }], type: "all" },
            {
              field: "test",
              values: ["anotherValue", { from: 20, to: 100 }, "someOtherValue"],
              type: "all"
            }
          ]
        }
      ).filters
    ).toEqual([
      { field: "initial", values: [{ from: 20, to: 100 }], type: "all" },
      {
        field: "test",
        values: ["anotherValue", "someOtherValue"],
        type: "all"
      }
    ]);
  });
});
