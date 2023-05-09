import {
  getAutocompleteClickCalls,
  setupDriver,
  mockPlugin
} from "../../test/helpers";

describe("#trackAutocompleteClickThrough", () => {
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
    driver.setSearchTerm("search terms", {
      autocompleteResults: true
    });
    driver.state.autocompletedResults = [
      {
        _meta: {
          last_updated: "2022-02-23T00:40:10+00:00",
          source: "custom",
          content_source_id: "621581b6174a804659f9dc16",
          id: "park_great-smoky-mountains",
          score: 2.057784
        },
        last_updated: {
          raw: "2022-02-23T00:40:10+00:00"
        }
      }
    ];
    driver.trackAutocompleteClickThrough(documentId, tags);
    return { driver, mockApiConnector, updatedStateAfterAction };
  }

  it("Calls click on connector", () => {
    const { mockApiConnector } = subject();
    expect(getAutocompleteClickCalls(mockApiConnector)).toHaveLength(1);
  });

  it("Calls Connector 'autocompleteClick' with correct parameters", () => {
    const { mockApiConnector } = subject({}, "park_great-smoky-mountains", [
      "test"
    ]);
    const [{ query, documentId, requestId, tags, result }] =
      getAutocompleteClickCalls(mockApiConnector)[0];
    expect(documentId).toEqual("park_great-smoky-mountains");
    expect(query).toEqual("search terms");
    expect(tags).toEqual(["test"]);
    expect(requestId).toEqual("6789");
    expect(result._meta.content_source_id).toEqual("621581b6174a804659f9dc16");
    expect(mockPlugin.subscribe).toBeCalledWith({
      currentPage: 1,
      documentId: "park_great-smoky-mountains",
      filters: [],
      origin: "autocomplete",
      position: 0,
      query: "search terms",
      resultsPerPage: 20,
      tags: ["test"],
      totalResults: 0,
      type: "ResultSelected"
    });
  });
});
