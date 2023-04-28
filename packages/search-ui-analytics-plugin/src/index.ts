import {
  Event,
  BaseEvent,
  ResultSelectedEvent,
  SearchQueryEvent
} from "@elastic/search-ui";

export type EventType = "search" | "search_click" | "page_view";

export type DocumentAttribute = {
  index: string;
  id: string;
};

export type PageEventAttribute = {
  referrer?: string;
  url: string;
  title?: string;
};

type SortAttribute = {
  name: string;
  direction?: "asc" | "desc";
};

export type ResultItemAttribute = {
  document: DocumentAttribute;
  page: {
    url: string;
  };
};

interface SearchEventAttribute {
  search: {
    query: string;
    filters?: Record<string, string | string[]>;
    search_application?: string;
    page?: {
      current: number;
      size: number;
    };
    sort?: SortAttribute | SortAttribute[];
    results?: {
      items: ResultItemAttribute[];
      total_results: number;
    };
  };
}

type SearchClickEventAttribute = SearchEventAttribute &
  ({ page: PageEventAttribute } | { document: DocumentAttribute });

export type AnalyticsClient = {
  trackEvent: (
    eventType: EventType,
    payload: SearchEventAttribute | SearchClickEventAttribute
  ) => void;
};

export interface AnalyticsPluginOptions {
  client?: AnalyticsClient;
}

const mapEventToTrackerParams: Record<
  ResultSelectedEvent["type"] | SearchQueryEvent["type"],
  (
    event: BaseEvent
  ) =>
    | ["search_click", SearchClickEventAttribute]
    | ["search", SearchEventAttribute]
> = {
  ResultSelected: (event: ResultSelectedEvent) => [
    "search_click",
    {
      document: { id: event.documentId, index: event.origin },
      search: {
        query: event.query,
        results: {
          items: [],
          total_results: event.totalResults
        },
        search_application: "search-ui"
      }
    }
  ],
  SearchQuery: (event: SearchQueryEvent) => [
    "search",
    {
      search: {
        query: event.query,
        page: {
          current: event.currentPage,
          size: event.resultsPerPage
        },
        results: {
          items: [],
          total_results: event.totalResults
        },
        search_application: "search-ui",
        sort: event.sort
          ?.filter(
            (sort) => sort.direction === "desc" || sort.direction === "asc"
          )
          .map((sort) => ({
            name: sort.field,
            direction: sort.direction as "asc" | "desc"
          }))
      }
    }
  ]
};

export default function AnalyticsPlugin(
  options: AnalyticsPluginOptions = { client: undefined }
) {
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
      const [eventType, payload] =
        mapEventToTrackerParams[event.type](event) || [];

      if (!eventType || !payload) {
        return;
      }

      client.trackEvent(eventType, payload);
    }
  };
}
