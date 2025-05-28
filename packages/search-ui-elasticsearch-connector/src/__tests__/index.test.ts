import ElasticsearchAPIConnector from "../index";

describe("elasticsearch connector interface", () => {
  it("should throw an exception when host or cloud not specified", () => {
    expect(() => {
      new ElasticsearchAPIConnector({
        index: "test"
      });
    }).toThrow(
      "Either host or cloud configuration or custom apiClient must be provided"
    );
  });
});
