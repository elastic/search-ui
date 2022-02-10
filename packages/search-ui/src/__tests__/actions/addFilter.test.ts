import { setupDriver, SubjectArguments } from "../../test/helpers";
import {
  itResetsCurrent,
  itFetchesResults,
  itUpdatesURLState
} from "../../test/sharedTests";
import { RequestState } from "../../types";

// We mock this so no state is actually written to the URL
jest.mock("../../URLManager");
import URLManager from "../../URLManager";
const MockedURLManager = jest.mocked(URLManager, true);

beforeEach(() => {
  MockedURLManager.mockClear();
});

describe("#addFilter", () => {
  function subject(
    name,
    value,
    type,
    {
      initialFilters = [],
      initialState = {
        filters: initialFilters,
        current: null
      }
    }: SubjectArguments = {}
  ) {
    const { driver, updatedStateAfterAction } = setupDriver({
      initialState
    });

    driver.addFilter(name, value, type);
    jest.runAllTimers();
    return updatedStateAfterAction.state;
  }

  itFetchesResults(() => subject("field", "value", undefined));

  itUpdatesURLState(URLManager, () => {
    subject("field", "value", undefined);
  });

  itResetsCurrent(() =>
    subject("field", "value", undefined, {
      initialState: { filters: [], current: 2 }
    })
  );

  it("Does not update other Search Parameter values", () => {
    const initialState = {
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc",
      sortList: [
        { direction: "asc", field: "name" },
        { direction: "desc", field: "title" }
      ],
      searchTerm: "test"
    } as RequestState;
    const { resultsPerPage, sortField, sortDirection, sortList, searchTerm } =
      subject("field", "value", undefined, { initialState });
    expect({
      resultsPerPage,
      sortField,
      sortDirection,
      sortList,
      searchTerm
    }).toEqual(initialState);
  });

  it("Adds a new filter", () => {
    expect(
      subject("test", "value", undefined, {
        initialFilters: [{ field: "initial", values: ["value"], type: "all" }]
      }).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all" },
      { field: "test", values: ["value"], type: "all" }
    ]);
  });

  it("Adds an additional filter", () => {
    expect(
      subject("test", "value2", undefined, {
        initialFilters: [
          { field: "initial", values: ["value"], type: "all" },
          { field: "test", values: ["value"], type: "all" }
        ]
      }).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all" },
      { field: "test", values: ["value", "value2"], type: "all" }
    ]);
  });

  it("Won't add a duplicate filter", () => {
    expect(
      subject("test", "value", undefined, {
        initialFilters: [
          { field: "initial", values: ["value"], type: "all" },
          { field: "test", values: ["value"], type: "all" }
        ]
      }).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all" },
      { field: "test", values: ["value"], type: "all" }
    ]);
  });

  it("Supports range filters", () => {
    expect(
      subject(
        "test",
        {
          name: "test",
          from: 20,
          to: 100
        },
        undefined,
        {
          initialFilters: [{ field: "initial", values: ["value"], type: "all" }]
        }
      ).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all" },
      {
        field: "test",
        values: [{ name: "test", from: 20, to: 100 }],
        type: "all"
      }
    ]);
  });

  it("Adds an additional range filter", () => {
    expect(
      subject("test", { name: "test2", from: 5, to: 6 }, undefined, {
        initialFilters: [
          {
            field: "initial",
            values: [{ name: "test", from: 20, to: 100 }],
            type: "all"
          },
          {
            field: "test",
            values: [{ name: "test", from: 4, to: 5 }],
            type: "all"
          }
        ]
      }).filters
    ).toEqual([
      {
        field: "initial",
        values: [{ name: "test", from: 20, to: 100 }],
        type: "all"
      },
      {
        field: "test",
        values: [
          { name: "test", from: 4, to: 5 },
          { name: "test2", from: 5, to: 6 }
        ],
        type: "all"
      }
    ]);
  });

  it("Won't add a duplicate range filter", () => {
    expect(
      subject(
        "test",
        {
          name: "test",
          from: 20,
          to: 100
        },
        undefined,
        {
          initialFilters: [
            { field: "initial", values: ["value"], type: "all" },
            {
              field: "test",
              values: [{ name: "test", from: 20, to: 100 }],
              type: "all"
            }
          ]
        }
      ).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all" },
      {
        field: "test",
        values: [{ name: "test", from: 20, to: 100 }],
        type: "all"
      }
    ]);
  });

  it("Adds an 'any' type filter", () => {
    expect(subject("test", "value", "any").filters).toEqual([
      { field: "test", values: ["value"], type: "any" }
    ]);
  });

  it("Adds a 'none' type filter", () => {
    expect(subject("test", "value", "none").filters).toEqual([
      { field: "test", values: ["value"], type: "none" }
    ]);
  });

  it("Will maintain separate Filter structures for different filter types", () => {
    expect(
      subject("test", "value", "any", {
        initialFilters: [{ field: "test", values: ["value"], type: "all" }]
      }).filters
    ).toEqual([
      { field: "test", values: ["value"], type: "all" },
      { field: "test", values: ["value"], type: "any" }
    ]);
  });

  it("Will add typed filters to the correct existing filter", () => {
    expect(
      subject("test", "value1", "any", {
        initialFilters: [
          { field: "test", values: ["value"], type: "all" },
          { field: "test", values: ["value"], type: "any" },
          { field: "test", values: ["value"], type: "none" }
        ]
      }).filters
    ).toEqual([
      { field: "test", values: ["value"], type: "all" },
      { field: "test", values: ["value"], type: "none" },
      { field: "test", values: ["value", "value1"], type: "any" }
    ]);
  });
});
