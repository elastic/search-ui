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

    driver.addFilter(name, value);
    return updatedStateAfterAction.state;
  }

  itFetchesResults(() => subject("field", "value"));

  itUpdatesURLState(URLManager, () => {
    subject("field", "value");
  });

  itResetsCurrent(() =>
    subject("field", "value", { initialState: { current: 2 } })
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
      { initialState }
    );
    expect({ resultsPerPage, sortField, sortDirection, searchTerm }).toEqual(
      initialState
    );
  });

  it("Adds a new filter", () => {
    expect(
      subject("test", "value", { initialFilters: [{ initial: ["value"] }] })
        .filters
    ).toEqual([{ initial: ["value"] }, { test: ["value"] }]);
  });

  it("Adds an additional filter", () => {
    expect(
      subject("test", "value2", {
        initialFilters: [{ initial: ["value"] }, { test: ["value"] }]
      }).filters
    ).toEqual([{ initial: ["value"] }, { test: ["value", "value2"] }]);
  });

  it("Won't add a duplicate filter", () => {
    expect(
      subject("test", "value", {
        initialFilters: [{ initial: ["value"] }, { test: ["value"] }]
      }).filters
    ).toEqual([{ initial: ["value"] }, { test: ["value"] }]);
  });

  it("Supports range filters", () => {
    expect(
      subject(
        "test",
        {
          from: 20,
          to: 100
        },
        { initialFilters: [{ initial: ["value"] }] }
      ).filters
    ).toEqual([{ initial: ["value"] }, { test: [{ from: 20, to: 100 }] }]);
  });

  it("Adds an additional range filter", () => {
    expect(
      subject(
        "test",
        { from: 5, to: 6 },
        {
          initialFilters: [
            { initial: [{ from: 20, to: 100 }] },
            { test: [{ from: 4, to: 5 }] }
          ]
        }
      ).filters
    ).toEqual([
      { initial: [{ from: 20, to: 100 }] },
      { test: [{ from: 4, to: 5 }, { from: 5, to: 6 }] }
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
        {
          initialFilters: [
            { initial: ["value"] },
            { test: [{ from: 20, to: 100 }] }
          ]
        }
      ).filters
    ).toEqual([{ initial: ["value"] }, { test: [{ from: 20, to: 100 }] }]);
  });
});
