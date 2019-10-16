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

describe("#addFilter", () => {
  function subject(
    name,
    value,
    type,
    innerType,
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

    driver.addFilter(name, value, type, innerType);
    jest.runAllTimers();
    return updatedStateAfterAction.state;
  }

  itFetchesResults(() => subject("field", "value", undefined));

  itUpdatesURLState(URLManager, () => {
    subject("field", "value", undefined);
  });

  itResetsCurrent(() =>
    subject("field", "value", undefined, { initialState: { current: 2 } })
  );

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
      undefined,
      { initialState }
    );
    expect({ resultsPerPage, sortField, sortDirection, searchTerm }).toEqual(
      initialState
    );
  });

  it("Adds a new filter", () => {
    expect(
      subject("test", "value", undefined, undefined, {
        initialFilters: [
          { field: "initial", values: ["value"], type: "all", innerType: "any" }
        ]
      }).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all", innerType: "any" },
      { field: "test", values: ["value"], type: "all", innerType: "any" }
    ]);
  });

  it("Adds an additional filter", () => {
    expect(
      subject("test", "value2", undefined, undefined, {
        initialFilters: [
          {
            field: "initial",
            values: ["value"],
            type: "all",
            innerType: "any"
          },
          { field: "test", values: ["value"], type: "all", innerType: "any" }
        ]
      }).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all", innerType: "any" },
      {
        field: "test",
        values: ["value", "value2"],
        type: "all",
        innerType: "any"
      }
    ]);
  });

  it("Won't add a duplicate filter", () => {
    expect(
      subject("test", "value", undefined, undefined, {
        initialFilters: [
          {
            field: "initial",
            values: ["value"],
            type: "all",
            innerType: "any"
          },
          { field: "test", values: ["value"], type: "all", innerType: "any" }
        ]
      }).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all", innerType: "any" },
      { field: "test", values: ["value"], type: "all", innerType: "any" }
    ]);
  });

  it("Supports range filters", () => {
    expect(
      subject(
        "test",
        {
          from: 20,
          to: 100
        },
        undefined,
        undefined,
        {
          initialFilters: [
            {
              field: "initial",
              values: ["value"],
              type: "all",
              innerType: "any"
            }
          ]
        }
      ).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all", innerType: "any" },
      {
        field: "test",
        values: [{ from: 20, to: 100 }],
        type: "all",
        innerType: "any"
      }
    ]);
  });

  it("Adds an additional range filter", () => {
    expect(
      subject("test", { from: 5, to: 6 }, undefined, undefined, {
        initialFilters: [
          {
            field: "initial",
            values: [{ from: 20, to: 100 }],
            type: "all",
            innerType: "any"
          },
          {
            field: "test",
            values: [{ from: 4, to: 5 }],
            type: "all",
            innerType: "any"
          }
        ]
      }).filters
    ).toEqual([
      {
        field: "initial",
        values: [{ from: 20, to: 100 }],
        type: "all",
        innerType: "any"
      },
      {
        field: "test",
        values: [{ from: 4, to: 5 }, { from: 5, to: 6 }],
        type: "all",
        innerType: "any"
      }
    ]);
  });

  it("Won't add a duplicate range filter", () => {
    expect(
      subject(
        "test",
        {
          from: 20,
          to: 100
        },
        undefined,
        undefined,
        {
          initialFilters: [
            {
              field: "initial",
              values: ["value"],
              type: "all",
              innerType: "any"
            },
            {
              field: "test",
              values: [{ from: 20, to: 100 }],
              type: "all",
              innerType: "any"
            }
          ]
        }
      ).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all", innerType: "any" },
      {
        field: "test",
        values: [{ from: 20, to: 100 }],
        type: "all",
        innerType: "any"
      }
    ]);
  });

  it("Adds an 'any' type filter", () => {
    expect(subject("test", "value", "any").filters).toEqual([
      { field: "test", values: ["value"], type: "any", innerType: "any" }
    ]);
  });

  it("Adds a 'none' type filter", () => {
    expect(subject("test", "value", "none").filters).toEqual([
      { field: "test", values: ["value"], type: "none", innerType: "any" }
    ]);
  });

  it("Will maintain separate Filter structures for different filter types", () => {
    expect(
      subject("test", "value", "any", undefined, {
        initialFilters: [
          { field: "test", values: ["value"], type: "all", innerType: "any" }
        ]
      }).filters
    ).toEqual([
      { field: "test", values: ["value"], type: "all", innerType: "any" },
      { field: "test", values: ["value"], type: "any", innerType: "any" }
    ]);
  });

  it("Will maintain separate Filter structures for different inner filter types", () => {
    expect(
      subject("test", "value", "all", "all", {
        initialFilters: [
          { field: "test", values: ["value"], type: "all", innerType: "any" }
        ]
      }).filters
    ).toEqual([
      { field: "test", values: ["value"], type: "all", innerType: "any" },
      { field: "test", values: ["value"], type: "all", innerType: "all" }
    ]);
  });

  it("Will add typed filters to the correct existing filter", () => {
    expect(
      subject("test", "value1", "any", "all", {
        initialFilters: [
          { field: "test", values: ["value"], type: "all", innerType: "all" },
          { field: "test", values: ["value"], type: "all", innerType: "any" },
          { field: "test", values: ["value"], type: "any", innerType: "all" },
          { field: "test", values: ["value"], type: "none", innerType: "all" }
        ]
      }).filters
    ).toEqual([
      { field: "test", values: ["value"], type: "all", innerType: "all" },
      { field: "test", values: ["value"], type: "all", innerType: "any" },
      { field: "test", values: ["value"], type: "none", innerType: "all" },
      {
        field: "test",
        values: ["value", "value1"],
        type: "any",
        innerType: "all"
      }
    ]);
  });
});
