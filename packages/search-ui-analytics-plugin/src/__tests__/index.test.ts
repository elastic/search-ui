import AnalyticsPlugin from "../index";

describe("analytics plugin", () => {
  it("should detect elastic analytics presence", () => {
    window["elasticAnalytics"] = jest.fn();
    expect(() => {
      AnalyticsPlugin();
    }).not.toThrow();
  });

  it("should not detect elastic analytics presence", () => {
    window["elasticAnalytics"] = undefined;
    expect(() => {
      AnalyticsPlugin();
    }).toThrow();
  });

  it("should allow elastic analytics to be passed in as argument", () => {
    window["elasticAnalytics"] = { trackEvent: jest.fn() };
    const internalClient = { trackEvent: jest.fn() };
    const eaPlugin = AnalyticsPlugin({
      client: internalClient
    });
    eaPlugin.subscribe({
      type: "SearchQuery",
      query: "test",
      totalResults: 0,
      filters: []
    });
    expect(window["elasticAnalytics"].trackEvent).not.toHaveBeenCalled();
    expect(internalClient.trackEvent).toHaveBeenCalled();
  });

  it("should dispatch event to elastic analytics client", () => {
    window["elasticAnalytics"] = { trackEvent: jest.fn() };
    const eaPlugin = AnalyticsPlugin();
    eaPlugin.subscribe({
      type: "SearchQuery",
      query: "test",
      totalResults: 0,
      filters: []
    });
    expect(window["elasticAnalytics"].trackEvent).toHaveBeenCalledWith(
      "search",
      {
        search: {
          filters: {},
          page: {
            current: undefined,
            size: undefined
          },
          results: {
            items: [],
            total_results: 0
          },
          sort: undefined,
          query: "test"
        }
      }
    );
  });
});
