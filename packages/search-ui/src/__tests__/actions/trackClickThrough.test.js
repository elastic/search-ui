import { getClickCalls, setupDriver } from "../../test/helpers";

describe("#trackClickThrough", () => {
  function subject(
    { initialState, alwaysSearchOnInitialLoad } = {},
    documentId,
    tags
  ) {
    const { driver, mockApiConnector } = setupDriver({
      initialState,
      alwaysSearchOnInitialLoad
    });
    driver.trackClickThrough(documentId, tags);
    return { driver, mockApiConnector };
  }

  it("Calls click on connector", () => {
    const { mockApiConnector } = subject();
    expect(getClickCalls(mockApiConnector)).toHaveLength(1);
  });

  it("Calls Connector 'click' with correct parameters", () => {
    const { mockApiConnector } = subject(
      {
        initialState: { searchTerm: "search terms" },
        alwaysSearchOnInitialLoad: true
      },
      1,
      ["test"]
    );
    const [{ query, documentId, requestId, tags }] = getClickCalls(
      mockApiConnector
    )[0];
    expect(documentId).toEqual(1);
    expect(query).toEqual("search terms");
    expect(tags).toEqual(["test"]);
    expect(requestId).toEqual("12345");
  });
});
