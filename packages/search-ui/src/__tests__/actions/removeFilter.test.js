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
    type,
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

    driver.removeFilter(name, value, type);
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
      undefined,
      { initialState }
    );
    expect({ resultsPerPage, sortField, sortDirection, searchTerm }).toEqual(
      initialState
    );
  });

  it("Removes just 1 filter value", () => {
    expect(
      subject("test", "value", undefined, {
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
      subject("test", undefined, undefined, {
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
      subject("test", "value", undefined, {
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
        undefined,
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

  it("Removes a range filter value even if only the name matches", () => {
    expect(
      subject(
        "test",
        {
          from: "1692-07-23T21:15:28.816Z",
          name: "A really long time ago"
        },
        undefined,
        {
          initialFilters: [
            {
              field: "test",
              values: [
                {
                  from: "1702-07-23T22:17:28.816Z",
                  name: "A really long time ago"
                },
                {
                  from: "2016-04-11T06:17:43.934Z",
                  name: "A little longer ago"
                }
              ],
              type: "all"
            }
          ]
        }
      ).filters
    ).toEqual([
      {
        field: "test",
        type: "all",
        values: [
          { from: "2016-04-11T06:17:43.934Z", name: "A little longer ago" }
        ]
      }
    ]);
  });

  it("Removes all filters, if no filter value or filter type is specified", () => {
    expect(
      subject("test", undefined, undefined, {
        initialFilters: [
          { field: "initial", values: ["value"], type: "all" },
          { field: "test", values: ["value"], type: "all" },
          { field: "test", values: ["value"], type: "any" },
          { field: "test", values: ["value"], type: "none" }
        ]
      }).filters
    ).toEqual([{ field: "initial", values: ["value"], type: "all" }]);
  });

  it("Removes filter values from all filter types, if no type is specified ", () => {
    expect(
      subject("test", "value", undefined, {
        initialFilters: [
          { field: "initial", values: ["value"], type: "all" },
          {
            field: "test",
            values: ["anotherValue", "value", "someOtherValue"],
            type: "all"
          },
          {
            field: "test",
            values: ["anotherValue", "value", "someOtherValue"],
            type: "any"
          },
          {
            field: "test",
            values: ["anotherValue", "value", "someOtherValue"],
            type: "none"
          }
        ]
      }).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all" },
      {
        field: "test",
        values: ["anotherValue", "someOtherValue"],
        type: "all"
      },
      {
        field: "test",
        values: ["anotherValue", "someOtherValue"],
        type: "any"
      },
      {
        field: "test",
        values: ["anotherValue", "someOtherValue"],
        type: "none"
      }
    ]);
  });

  it("Removes filter values only from specified filter type when specified", () => {
    expect(
      subject("test", "value", "all", {
        initialFilters: [
          { field: "initial", values: ["value"], type: "all" },
          {
            field: "test",
            values: ["anotherValue", "value", "someOtherValue"],
            type: "all"
          },
          {
            field: "test",
            values: ["anotherValue", "value", "someOtherValue"],
            type: "any"
          },
          {
            field: "test",
            values: ["anotherValue", "value", "someOtherValue"],
            type: "none"
          }
        ]
      }).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all" },
      {
        field: "test",
        values: ["anotherValue", "someOtherValue"],
        type: "all"
      },
      {
        field: "test",
        values: ["anotherValue", "value", "someOtherValue"],
        type: "any"
      },
      {
        field: "test",
        values: ["anotherValue", "value", "someOtherValue"],
        type: "none"
      }
    ]);
  });

  it("Does other things", () => {
    expect(
      subject("test", undefined, "all", {
        initialFilters: [
          { field: "initial", values: ["value"], type: "all" },
          {
            field: "test",
            values: ["anotherValue", "value", "someOtherValue"],
            type: "all"
          },
          {
            field: "test",
            values: ["anotherValue", "value", "someOtherValue"],
            type: "any"
          },
          {
            field: "test",
            values: ["anotherValue", "value", "someOtherValue"],
            type: "none"
          }
        ]
      }).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all" },
      {
        field: "test",
        values: ["anotherValue", "value", "someOtherValue"],
        type: "any"
      },
      {
        field: "test",
        values: ["anotherValue", "value", "someOtherValue"],
        type: "none"
      }
    ]);
  });
});
