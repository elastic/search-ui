import { getAutocompleteClickCalls, setupDriver } from "../../test/helpers";

describe("#trackAutocompleteClickThrough", () => {
  function subject({ initialState } = {}, documentId, tags) {
    const { driver, mockApiConnector } = setupDriver({ initialState });
    driver.trackAutocompleteClickThrough(documentId, tags);
    return { driver, mockApiConnector };
  }

  it("Calls click on connector", () => {
    const { mockApiConnector } = subject();
    expect(getAutocompleteClickCalls(mockApiConnector)).toHaveLength(1);
  });

  it("Calls Connector 'autocompleteClick' with correct parameters", () => {
    const { mockApiConnector } = subject(
      { initialState: { searchTerm: "search terms" } },
      1,
      ["test"]
    );
    const [{ query, documentId, requestId, tags }] = getAutocompleteClickCalls(
      mockApiConnector
    )[0];
    expect(documentId).toEqual(1);
    expect(query).toEqual("search terms");
    expect(tags).toEqual(["test"]);
    expect(requestId).toEqual("12345");
  });
});
