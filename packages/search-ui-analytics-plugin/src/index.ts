import {
  Event,
  BaseEvent,
  ResultSelectedEvent,
  SearchQueryEvent,
  FilterValueRange,
  FilterValue
} from "@elastic/search-ui";
import type {
  Tracker,
  TrackerEventType,
  EventInputProperties,
  SearchEventInputProperties,
  SearchClickEventInputProperties
} from "@elastic/behavioral-analytics-tracker-core";

export interface AnalyticsPluginOptions {
  client?: Pick<Tracker, "trackEvent">;
}

const transformSearchQueryEvent = (event: Omit<SearchQueryEvent, "type">) => {
  const transformFilterValues = (values: FilterValue[]): string[] => {
    const transformBasicValue = (value: string | boolean | number) =>
      value.toString();
    const transformRangeValue = (value: FilterValueRange) =>
      `${value.from || "*"}-${value.to || "*"}`;

    return values.reduce<string[]>((res, value) => {
      if (Array.isArray(value)) {
        return [...res, ...value.map(transformBasicValue)];
      }

      return [
        ...res,
        typeof value === "object"
          ? transformRangeValue(value)
          : transformBasicValue(value)
      ];
    }, []);
  };

  return {
    search: {
      query: event.query,
      filters: event.filters.reduce(
        (res, filter) => ({
          ...res,
          [filter.field]: transformFilterValues(filter.values)
        }),
        {}
      ),
      page: {
        current: event.currentPage,
        size: event.resultsPerPage
      },
      results: {
        items: [],
        total_results: event.totalResults
      },
      sort: event.sort
        ?.filter(
          (sort) => sort.direction === "desc" || sort.direction === "asc"
        )
        .map((sort) => ({
          name: sort.field,
          direction: sort.direction as "asc" | "desc"
        }))
    }
  };
};

type TrackerParams<
  T extends TrackerEventType,
  K extends EventInputProperties
> = [T, K];

const mapEventToTrackerParams: Record<
  ResultSelectedEvent["type"] | SearchQueryEvent["type"],
  (
    event: BaseEvent
  ) =>
    | TrackerParams<"search_click", SearchClickEventInputProperties>
    | TrackerParams<"search", SearchEventInputProperties>
> = {
  ResultSelected: (event: ResultSelectedEvent) => [
    "search_click",
    {
      ...transformSearchQueryEvent(event),
      document: { id: event.documentId, index: event.origin }
    }
  ],
  SearchQuery: (event: SearchQueryEvent) => [
    "search",
    transformSearchQueryEvent(event)
  ]
};

export default function AnalyticsPlugin(
  options: AnalyticsPluginOptions = { client: undefined }
) {
  const client: Tracker =
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
        mapEventToTrackerParams[event.type]?.(event) || [];

      if (!eventType || !payload) {
        return;
      }

      client.trackEvent(eventType, payload);
    }
  };
}
