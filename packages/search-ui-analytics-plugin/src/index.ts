import type { Event } from "@elastic/search-ui";

export type EventType = "search" | "click" | "pageview";

export type AnalyticsClient = {
  trackEvent: (eventType: EventType, payload: Record<string, any>) => void;
};

export interface AnalyticsPluginOptions {
  client?: AnalyticsClient;
}

export default function analyticsPlugin(options = { client: undefined }) {
  const client: AnalyticsClient =
    options.client ||
    (typeof window !== "undefined" && window["elasticAnalytics"]);
  if (!client) {
    throw new Error(
      "Analytics client not found. Please provide a client or install the Elastic Analytics library."
    );
  }

  return {
    subscribe: (event: Event) => {
      const eventTypeMap: Record<Event["type"], EventType> = {
        AutocompleteSuggestionSelected: "click",
        FacetFilterRemoved: "click",
        FacetFilterSelected: "click",
        ResultSelected: "click",
        SearchQuery: "search"
      };

      client.trackEvent(eventTypeMap[event.type], event);
    }
  };
}
