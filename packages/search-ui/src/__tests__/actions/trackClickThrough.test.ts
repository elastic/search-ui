import { getClickCalls, setupDriver } from "../../test/helpers";

describe("#trackClickThrough", () => {
  function subject(
    { initialState }: { initialState? } = {},
    documentId?: string,
    tags?: string[]
  ) {
    const { driver, mockApiConnector } = setupDriver({ initialState });
    driver.state.results = [
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
    driver.state.current = 1;
    driver.trackClickThrough(documentId, tags);
    jest.runAllTimers();
    return { driver, mockApiConnector };
  }

  it("Calls click on connector", () => {
    const { mockApiConnector } = subject();
    expect(getClickCalls(mockApiConnector)).toHaveLength(1);
  });

  it("Calls Connector 'click' with correct parameters", () => {
    const { mockApiConnector } = subject(
      { initialState: { searchTerm: "search terms" } },
      "park_great-smoky-mountains",
      ["test"]
    );
    const [{ query, documentId, requestId, tags, result, page }] =
      getClickCalls(mockApiConnector)[0];
    expect(documentId).toEqual("park_great-smoky-mountains");
    expect(query).toEqual("search terms");
    expect(tags).toEqual(["test"]);
    expect(requestId).toEqual("12345");
    expect(result._meta.content_source_id).toEqual("621581b6174a804659f9dc16");
    expect(page).toBe(1);
  });
});
