import { AutocompleteSuggestion } from "../..";
import { setupDriver, mockPlugin } from "../../test/helpers";

describe("#trackAutocompleteSuggestionClickThrough", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function subject(
    { initialState }: { initialState? } = {},
    documentId?,
    tags?
  ) {
    const { driver, mockApiConnector, updatedStateAfterAction } = setupDriver({
      initialState
    });
    driver.setSearchTerm("terms", {
      autocompleteSuggestions: true
    });
    driver.state.autocompletedSuggestions = {
      test: [
        {
          suggestion: "test"
        }
      ]
    };
    driver.trackAutocompleteSuggestionClickThrough("search terms", 1, tags);
    return { driver, mockApiConnector, updatedStateAfterAction };
  }

  it("Calls events plugin with correct parameters", () => {
    subject();
    expect(mockPlugin.subscribe).toBeCalledWith({
      position: 1,
      query: "terms",
      suggestion: "search terms",
      tags: [],
      type: "AutocompleteSuggestionSelected"
    });
  });
});
