import { setupDriver, SubjectArguments, mockPlugin } from "../../test/helpers";
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function subject(
    {
      name,
      value,
      type,
      persistent
    }: { name?; value?; type?; persistent?: boolean },
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

    driver.addFilter(name, value, type, persistent);
    jest.runAllTimers();
    return updatedStateAfterAction.state;
  }

  itFetchesResults(() =>
    subject({ name: "field", value: "value", type: undefined })
  );

  itUpdatesURLState(URLManager, () => {
    subject({ name: "field", value: "value", type: undefined });
  });

  itResetsCurrent(() =>
    subject(
      { name: "field", value: "value", type: undefined },
      {
        initialState: { filters: [], current: 2 }
      }
    )
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
      subject(
        { name: "field", value: "value", type: undefined },
        { initialState }
      );
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
      subject(
        { name: "test", value: "value", type: undefined },
        {
          initialFilters: [{ field: "initial", values: ["value"], type: "all" }]
        }
      ).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all" },
      { field: "test", values: ["value"], type: "all" }
    ]);
    expect(mockPlugin.subscribe).toHaveBeenCalledWith({
      field: "test",
      query: "",
      type: "FacetFilterSelected",
      value: "value"
    });
  });

  it("Adds an additional filter", () => {
    expect(
      subject(
        { name: "test", value: "value2", type: undefined },
        {
          initialFilters: [
            { field: "initial", values: ["value"], type: "all" },
            { field: "test", values: ["value"], type: "all" }
          ]
        }
      ).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all" },
      { field: "test", values: ["value", "value2"], type: "all" }
    ]);

    expect(mockPlugin.subscribe).toHaveBeenCalledWith({
      field: "test",
      query: "",
      type: "FacetFilterSelected",
      value: "value,value2"
    });
  });

  it("Won't add a duplicate filter", () => {
    expect(
      subject(
        { name: "test", value: "value", type: undefined },
        {
          initialFilters: [
            { field: "initial", values: ["value"], type: "all" },
            { field: "test", values: ["value"], type: "all" }
          ]
        }
      ).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all" },
      { field: "test", values: ["value"], type: "all" }
    ]);
  });

  it("Supports range filters", () => {
    expect(
      subject(
        {
          name: "test",
          value: {
            name: "test",
            from: 20,
            to: 100
          },
          type: undefined
        },
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
      subject(
        { name: "test", value: { name: "test2", from: 5, to: 6 } },
        {
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
        }
      ).filters
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
    expect(mockPlugin.subscribe).toHaveBeenCalledWith({
      field: "test",
      query: "",
      type: "FacetFilterSelected",
      value: "test,test2"
    });
  });

  it("Won't add a duplicate range filter", () => {
    expect(
      subject(
        {
          name: "test",
          value: {
            name: "test",
            from: 20,
            to: 100
          },
          type: undefined
        },
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
    expect(
      subject({ name: "test", value: "value", type: "any" }).filters
    ).toEqual([{ field: "test", values: ["value"], type: "any" }]);
  });

  it("Adds a 'none' type filter", () => {
    expect(
      subject({ name: "test", value: "value", type: "none" }).filters
    ).toEqual([{ field: "test", values: ["value"], type: "none" }]);
  });

  it("Will maintain separate Filter structures for different filter types", () => {
    expect(
      subject(
        { name: "test", value: "value", type: "any" },
        {
          initialFilters: [{ field: "test", values: ["value"], type: "all" }]
        }
      ).filters
    ).toEqual([
      { field: "test", values: ["value"], type: "all" },
      { field: "test", values: ["value"], type: "any" }
    ]);
  });

  it("Will add typed filters to the correct existing filter", () => {
    expect(
      subject(
        { name: "test", value: "value1", type: "any" },
        {
          initialFilters: [
            { field: "test", values: ["value"], type: "all" },
            { field: "test", values: ["value"], type: "any" },
            { field: "test", values: ["value"], type: "none" }
          ]
        }
      ).filters
    ).toEqual([
      { field: "test", values: ["value"], type: "all" },
      { field: "test", values: ["value"], type: "none" },
      { field: "test", values: ["value", "value1"], type: "any" }
    ]);
  });

  it("Will add a persistent filter", () => {
    expect(
      subject(
        {
          name: "test",
          value: "value",
          type: "any",
          persistent: true
        },
        {
          initialFilters: [{ field: "test", values: ["value"], type: "all" }]
        }
      ).filters
    ).toEqual([
      { field: "test", values: ["value"], type: "all" },
      { field: "test", values: ["value"], type: "any", persistent: true }
    ]);
  });
});
