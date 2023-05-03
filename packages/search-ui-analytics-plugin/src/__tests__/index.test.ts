import AnalyticsPlugin from "../index";

describe("analytics plugin", () => {
  it("should detect elastic analytics presence", () => {
    window["elasticAnalytics"] = jest.fn();
    expect(() => {
      AnalyticsPlugin();
    }).not.toThrowError();
  });

  it("should not detect elastic analytics presence", () => {
    window["elasticAnalytics"] = undefined;
    expect(() => {
      AnalyticsPlugin();
    }).toThrowError();
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
    expect(window["elasticAnalytics"].trackEvent).not.toBeCalled();
    expect(internalClient.trackEvent).toBeCalled();
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
    expect(window["elasticAnalytics"].trackEvent).toBeCalledWith("search", {
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
    });
  });
});
