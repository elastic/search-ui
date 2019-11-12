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
    outerType,
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

    driver.addFilter(name, value, type, outerType);
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
      subject("test", "value", "any", undefined, {
        initialFilters: [
          { field: "initial", values: ["value"], outerType: "all", type: "any" }
        ]
      }).filters
    ).toEqual([
      { field: "initial", values: ["value"], outerType: "all", type: "any" },
      { field: "test", values: ["value"], outerType: "all", type: "any" }
    ]);
  });

  it("Adds an additional filter", () => {
    expect(
      subject("test", "value2", "any", undefined, {
        initialFilters: [
          {
            field: "initial",
            values: ["value"],
            outerType: "all",
            type: "any"
          },
          { field: "test", values: ["value"], outerType: "all", type: "any" }
        ]
      }).filters
    ).toEqual([
      { field: "initial", values: ["value"], outerType: "all", type: "any" },
      {
        field: "test",
        values: ["value", "value2"],
        outerType: "all",
        type: "any"
      }
    ]);
  });

  it("Won't add a duplicate filter", () => {
    expect(
      subject("test", "value", "any", undefined, {
        initialFilters: [
          {
            field: "initial",
            values: ["value"],
            outerType: "all",
            type: "any"
          },
          { field: "test", values: ["value"], outerType: "all", type: "any" }
        ]
      }).filters
    ).toEqual([
      { field: "initial", values: ["value"], outerType: "all", type: "any" },
      { field: "test", values: ["value"], outerType: "all", type: "any" }
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
              outerType: "all",
              type: "any"
            }
          ]
        }
      ).filters
    ).toEqual([
      { field: "initial", values: ["value"], outerType: "all", type: "any" },
      {
        field: "test",
        values: [{ from: 20, to: 100 }],
        outerType: "all",
        type: "all"
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
            outerType: "all",
            type: "all"
          },
          {
            field: "test",
            values: [{ from: 4, to: 5 }],
            outerType: "all",
            type: "all"
          }
        ]
      }).filters
    ).toEqual([
      {
        field: "initial",
        values: [{ from: 20, to: 100 }],
        outerType: "all",
        type: "all"
      },
      {
        field: "test",
        values: [{ from: 4, to: 5 }, { from: 5, to: 6 }],
        outerType: "all",
        type: "all"
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
        "any",
        undefined,
        {
          initialFilters: [
            {
              field: "initial",
              values: ["value"],
              outerType: "all",
              type: "any"
            },
            {
              field: "test",
              values: [{ from: 20, to: 100 }],
              outerType: "all",
              type: "any"
            }
          ]
        }
      ).filters
    ).toEqual([
      { field: "initial", values: ["value"], outerType: "all", type: "any" },
      {
        field: "test",
        values: [{ from: 20, to: 100 }],
        outerType: "all",
        type: "any"
      }
    ]);
  });

  it("Adds an 'any' type filter", () => {
    expect(subject("test", "value", undefined, "any").filters).toEqual([
      { field: "test", values: ["value"], outerType: "any", type: "all" }
    ]);
  });

  it("Adds a 'none' type filter", () => {
    expect(subject("test", "value", undefined, "none").filters).toEqual([
      { field: "test", values: ["value"], outerType: "none", type: "all" }
    ]);
  });

  it("Will maintain separate Filter structures for different filter types", () => {
    expect(
      subject("test", "value", undefined, "any", {
        initialFilters: [
          { field: "test", values: ["value"], outerType: "all", type: "any" }
        ]
      }).filters
    ).toEqual([
      { field: "test", values: ["value"], outerType: "all", type: "any" },
      { field: "test", values: ["value"], outerType: "any", type: "all" }
    ]);
  });

  it("Will maintain separate Filter structures for different inner filter types", () => {
    expect(
      subject("test", "value", "all", "all", {
        initialFilters: [
          { field: "test", values: ["value"], outerType: "all", type: "any" }
        ]
      }).filters
    ).toEqual([
      { field: "test", values: ["value"], outerType: "all", type: "any" },
      { field: "test", values: ["value"], outerType: "all", type: "all" }
    ]);
  });

  it("Will add typed filters to the correct existing filter", () => {
    expect(
      subject("test", "value1", "any", "all", {
        initialFilters: [
          { field: "test", values: ["value"], outerType: "all", type: "all" },
          { field: "test", values: ["value"], outerType: "all", type: "any" },
          { field: "test", values: ["value"], outerType: "any", type: "all" },
          { field: "test", values: ["value"], outerType: "none", type: "all" }
        ]
      }).filters
    ).toEqual([
      { field: "test", values: ["value"], outerType: "all", type: "all" },
      { field: "test", values: ["value"], outerType: "any", type: "all" },
      { field: "test", values: ["value"], outerType: "none", type: "all" },
      {
        field: "test",
        values: ["value", "value1"],
        outerType: "all",
        type: "any"
      }
    ]);
  });
});
