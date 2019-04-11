import { getAutocompleteClickCalls, setupDriver } from "../../test/helpers";

describe("#trackAutocompleteClickThrough", () => {
  function subject({ initialState } = {}, documentId, tags) {
    const { driver, mockApiConnector, updatedStateAfterAction } = setupDriver({
      initialState
    });
    driver.setSearchTerm("search terms", {
      autocompleteResults: true
    });
    driver.trackAutocompleteClickThrough(documentId, tags);
    return { driver, mockApiConnector, updatedStateAfterAction };
  }

  it("Calls click on connector", () => {
    const { mockApiConnector } = subject();
    expect(getAutocompleteClickCalls(mockApiConnector)).toHaveLength(1);
  });

  it("Calls Connector 'autocompleteClick' with correct parameters", () => {
    const { mockApiConnector } = subject({}, 1, ["test"]);
    const [{ query, documentId, requestId, tags }] = getAutocompleteClickCalls(
      mockApiConnector
    )[0];
    expect(documentId).toEqual(1);
    expect(query).toEqual("search terms");
    expect(tags).toEqual(["test"]);
    expect(requestId).toEqual("6789");
  });
});
