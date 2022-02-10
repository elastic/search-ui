import {
  getAutocompleteCalls,
  setupDriver,
  SubjectArguments
} from "../../test/helpers";
import {
  itResetsCurrent,
  itResetsFilters,
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

describe("#setSearchTerm", () => {
  function subject(
    term,
    {
      autocompleteResults,
      autocompleteSuggestions,
      refresh,
      initialState = {},
      shouldClearFilters
    }: SubjectArguments = {}
  ) {
    const { driver, stateAfterCreation, updatedStateAfterAction } = setupDriver(
      { initialState }
    );
    driver.setSearchTerm(term, {
      autocompleteResults,
      autocompleteSuggestions,
      refresh,
      shouldClearFilters
    });

    jest.runAllTimers();

    return {
      state: updatedStateAfterAction.state,
      stateAfterCreation: stateAfterCreation
    };
  }

  it("Updates searchTerm in state", () => {
    expect(subject("test").state.searchTerm).toEqual("test");
  });

  it("Updates resultSearchTerm in state", () => {
    expect(subject("test").state.resultSearchTerm).toEqual("test");
  });

  itResetsCurrent(
    () => subject("test", { initialState: { current: 2 } }).state
  );

  itResetsFilters(
    () =>
      subject("test", {
        initialState: {
          filters: [
            {
              field: "filter1",
              values: ["value1"],
              type: "all"
            }
          ]
        }
      }).state
  );

  it("Does not update filters when 'shouldClearFilters' is set to false", () => {
    const state = subject("test", {
      initialState: {
        filters: [
          {
            field: "filter1",
            values: ["value1"],
            type: "all"
          }
        ]
      },
      shouldClearFilters: false
    }).state;
    expect(state.filters).toEqual([
      {
        field: "filter1",
        values: ["value1"],
        type: "all"
      }
    ]);
  });

  it("Does not update other Search Parameter values", () => {
    const initialState: RequestState = {
      resultsPerPage: 60,
      sortField: "name",
      sortDirection: "asc",
      sortList: [
        { direction: "asc", field: "name" },
        { direction: "desc", field: "title" }
      ]
    };
    const { resultsPerPage, sortField, sortDirection, sortList } = subject(
      "test",
      {
        initialState
      }
    ).state;

    expect({ resultsPerPage, sortField, sortDirection, sortList }).toEqual(
      initialState
    );
  });

  itFetchesResults(() => subject("term").state);

  itUpdatesURLState(MockedURLManager, () => {
    subject("term");
  });

  it("Does not update URL state when 'refresh' is set to false", () => {
    subject("term", { refresh: false });
    expect(
      (MockedURLManager.mock.instances[0].pushStateToURL as jest.Mock).mock
        .calls
    ).toHaveLength(0);
  });

  it("Does not fetch results when 'refresh' is set to false", () => {
    expect(subject("term", { refresh: false }).state.wasSearched).toBe(false);
  });

  it("Will debounce the request state update if a debounce is specified", () => {
    const { driver, updatedStateAfterAction } = setupDriver({
      initialState: {
        searchTerm: "park",
        current: 2
      }
    });
    jest.runAllTimers();
    driver.setSearchTerm("term", { debounce: 1000 });
    expect(updatedStateAfterAction.state.current).toBe(2);
    jest.advanceTimersByTime(500);
    expect(updatedStateAfterAction.state.current).toBe(2);
    jest.advanceTimersByTime(500);
    expect(updatedStateAfterAction.state.current).toBe(1);
  });

  it("Will not debounce the request state update if no debounce is specified", () => {
    const { driver, updatedStateAfterAction } = setupDriver({
      initialState: {
        searchTerm: "park",
        current: 2
      }
    });
    jest.runAllTimers();
    expect(updatedStateAfterAction.state.current).toBe(2);
    driver.setSearchTerm("term");
    expect(updatedStateAfterAction.state.current).toBe(1);
  });

  describe("when autocompleteResults is true", () => {
    it("updates autocompletedResults", () => {
      expect(
        subject("term", { autocompleteResults: true, refresh: false }).state
          .autocompletedResults
      ).toEqual([{}, {}]);
    });

    it("Will not debounce requests if there is no debounce specified", () => {
      const { driver, mockApiConnector } = setupDriver();
      driver.setSearchTerm("term", {
        autocompleteResults: true,
        refresh: false
      });
      driver.setSearchTerm("term", {
        autocompleteResults: true,
        refresh: false
      });
      driver.setSearchTerm("term", {
        autocompleteResults: true,
        refresh: false
      });
      expect(getAutocompleteCalls(mockApiConnector)).toHaveLength(3);
    });

    it("Will debounce requests", () => {
      const { driver, mockApiConnector } = setupDriver();
      driver.setSearchTerm("term", {
        autocompleteResults: true,
        debounce: 10,
        refresh: false
      });
      driver.setSearchTerm("term", {
        autocompleteResults: true,
        debounce: 10,
        refresh: false
      });
      driver.setSearchTerm("term", {
        autocompleteResults: true,
        debounce: 10,
        refresh: false
      });
      jest.runAllTimers();
      expect(getAutocompleteCalls(mockApiConnector)).toHaveLength(1);
    });

    describe("and autocompleteMinimumCharacters is set and less than requirement", () => {
      it("will not trigger", () => {
        const { driver, mockApiConnector } = setupDriver();
        driver.setSearchTerm("term", {
          autocompleteMinimumCharacters: 5,
          autocompleteResults: true,
          refresh: false
        });
        expect(getAutocompleteCalls(mockApiConnector)).toHaveLength(0);
      });
    });

    describe("and autocompleteMinimumCharacters is set and greater than requirement", () => {
      it("will not trigger", () => {
        const { driver, mockApiConnector } = setupDriver();
        driver.setSearchTerm("term", {
          autocompleteMinimumCharacters: 2,
          autocompleteResults: true,
          refresh: false
        });
        expect(getAutocompleteCalls(mockApiConnector)).toHaveLength(1);
      });
    });
  });

  describe("when autocompleteSuggestions is true", () => {
    it("updates autocompletedSuggestions", () => {
      expect(
        subject("term", { autocompleteSuggestions: true, refresh: false }).state
          .autocompletedSuggestions
      ).toEqual({
        documents: [
          { suggestion: "carlsbad" },
          { suggestion: "carlsbad caverns" },
          { suggestion: "carolina" }
        ]
      });
    });

    it("Will not debounce requests if there is no debounce specified", () => {
      const { driver, mockApiConnector } = setupDriver();
      driver.setSearchTerm("term", {
        autocompleteSuggestions: true,
        refresh: false
      });
      driver.setSearchTerm("term", {
        autocompleteSuggestions: true,
        refresh: false
      });
      driver.setSearchTerm("term", {
        autocompleteSuggestions: true,
        refresh: false
      });
      jest.runAllTimers();
      expect(getAutocompleteCalls(mockApiConnector)).toHaveLength(3);
    });

    it("Will debounce requests", () => {
      const { driver, mockApiConnector } = setupDriver();
      driver.setSearchTerm("term", {
        autocompleteSuggestions: true,
        debounce: 10,
        refresh: false
      });
      driver.setSearchTerm("term", {
        autocompleteSuggestions: true,
        debounce: 10,
        refresh: false
      });
      driver.setSearchTerm("term", {
        autocompleteSuggestions: true,
        debounce: 10,
        refresh: false
      });
      jest.runAllTimers();
      expect(getAutocompleteCalls(mockApiConnector)).toHaveLength(1);
    });

    describe("and autocompleteMinimumCharacters is set and less than requirement", () => {
      it("will not trigger", () => {
        const { driver, mockApiConnector } = setupDriver();
        driver.setSearchTerm("term", {
          autocompleteMinimumCharacters: 5,
          autocompleteSuggestions: true,
          refresh: false
        });
        expect(getAutocompleteCalls(mockApiConnector)).toHaveLength(0);
      });
    });

    describe("and autocompleteMinimumCharacters is set and greater than requirement", () => {
      it("will not trigger", () => {
        const { driver, mockApiConnector } = setupDriver();
        driver.setSearchTerm("term", {
          autocompleteMinimumCharacters: 2,
          autocompleteSuggestions: true,
          refresh: false
        });
        expect(getAutocompleteCalls(mockApiConnector)).toHaveLength(1);
      });
    });
  });

  describe("when autocompleteResults is false", () => {
    it("doesn't update autocompletedResults", () => {
      expect(
        subject("term", { autocompleteResults: false }).state
          .autocompletedResults
      ).toEqual([]);
    });
  });

  describe("when autocompleteSuggestions is false", () => {
    it("doesn't update autocompletedSuggestions", () => {
      expect(
        subject("term", { autocompleteSuggestions: false }).state
          .autocompletedSuggestions
      ).toEqual({});
    });
  });
});
