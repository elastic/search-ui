import { setupDriver } from "../../test/helpers";
import { itResetsCurrent, itFetchesResults } from "../../test/sharedTests";

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
          { initial: ["value"] },
          { test: ["anotherValue", "value", "someOtherValue"] }
        ]
      }).filters
    ).toEqual([
      { initial: ["value"] },
      { test: ["anotherValue", "someOtherValue"] }
    ]);
  });

  it("Removes all filters", () => {
    expect(
      subject("test", undefined, {
        initialFilters: [
          { initial: ["value"] },
          { test: ["anotherValue", "value", "someOtherValue"] }
        ]
      }).filters
    ).toEqual([{ initial: ["value"] }]);
  });

  it("Removes all filters when last value", () => {
    expect(
      subject("test", "value", {
        initialFilters: [{ initial: ["value"] }, { test: ["value"] }]
      }).filters
    ).toEqual([{ initial: ["value"] }]);
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
            { initial: [{ from: 20, to: 100 }] },
            { test: ["anotherValue", { from: 20, to: 100 }, "someOtherValue"] }
          ]
        }
      ).filters
    ).toEqual([
      { initial: [{ from: 20, to: 100 }] },
      { test: ["anotherValue", "someOtherValue"] }
    ]);
  });
});
