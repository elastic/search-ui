import ElasticsearchAPIConnector from "../index";

describe("elasticsearch connector interface", () => {
  it("should throw an exception when host or cloud not specified", () => {
    expect(() => {
      new ElasticsearchAPIConnector({
        index: "test"
      });
    }).toThrowError("Either host or cloud configuration must be provided");
  });
});
