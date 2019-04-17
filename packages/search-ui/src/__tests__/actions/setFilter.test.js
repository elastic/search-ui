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

describe("#setFilter", () => {
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

    driver.setFilter(name, value, type);
    return updatedStateAfterAction.state;
  }

  itUpdatesURLState(URLManager, () => {
    subject(2);
  });

  itFetchesResults(() => subject("field", "value"));

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
      { initialState }
    );
    expect({ resultsPerPage, sortField, sortDirection, searchTerm }).toEqual(
      initialState
    );
  });

  it("Adds a new filter and removes old filters", () => {
    expect(
      subject("test", "value2", undefined, {
        initialFilters: [
          { field: "initial", values: ["value"], type: "all" },
          { field: "test", values: ["value1"], type: "all" }
        ]
      }).filters
    ).toEqual([
      { field: "initial", values: ["value"], type: "all" },
      { field: "test", values: ["value2"], type: "all" }
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

  it("Will remove the correct typed filter", () => {
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
      { field: "test", values: ["value1"], type: "any" }
    ]);
  });
});
