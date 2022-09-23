import {
  onAutocompleteHook,
  onAutocompleteResultClickHook,
  onResultClickHook,
  onSearchHook
} from "./SearchDriver";
import {
  APIConnector,
  AutocompleteQueryConfig,
  QueryConfig,
  SearchQuery,
  AutocompleteSearchQuery,
  ResponseState,
  AutocompleteResponseState,
  Event,
  Plugin
} from "./types";

function wireUpEventHandler(
  handlerName: string,
  apiConnector: APIConnector,
  handlerParam
) {
  if (handlerParam) {
    // Passes a 'next' parameter which allows a handler to work as
    // middleware for a connector
    if (apiConnector) {
      const next = apiConnector[handlerName].bind(apiConnector);
      return (...params) => {
        return handlerParam(...params, next);
      };
    }
    return handlerParam;
  }
  if (apiConnector && apiConnector[handlerName])
    return apiConnector[handlerName].bind(apiConnector);
  return () => {
    throw `No ${handlerName} handler provided and no Connector provided. You must configure one or the other.`;
  };
}

/*
 * This class encapsulates the logic for Events. Events are events that occur
 * within Search UI that require integration with an external service to
 * either fetch / search for data, or notify analytics services of interesting
 * events that occur within a UI.
 *
 * Handlers for these events can either be passed directly, or by providing
 * an API Connector. The events that are passed directly can also be used
 * to override or proxy handlers provided by API Connectors.
 */

type EventOptions = {
  apiConnector?: APIConnector;
  onSearch?: onSearchHook;
  onAutocomplete?: onAutocompleteHook;
  onResultClick?: onResultClickHook;
  onAutocompleteResultClick?: onAutocompleteResultClickHook;
  plugins?: Plugin[];
};

class Events {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  public search: (
    query: SearchQuery,
    queryConfig: QueryConfig
  ) => Promise<ResponseState>;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  public autocomplete: (
    query: AutocompleteSearchQuery,
    queryConfig: AutocompleteQueryConfig
  ) => Promise<AutocompleteResponseState>;
  public resultClick: (resultParams: any) => void;
  public autocompleteResultClick: (resultParams: any) => void;
  private plugins: Plugin[];

  constructor({
    apiConnector,
    onSearch,
    onAutocomplete,
    onResultClick,
    onAutocompleteResultClick,
    plugins = []
  }: EventOptions = {}) {
    this.search = wireUpEventHandler("onSearch", apiConnector, onSearch);
    this.autocomplete = wireUpEventHandler(
      "onAutocomplete",
      apiConnector,
      onAutocomplete
    );
    this.resultClick = wireUpEventHandler(
      "onResultClick",
      apiConnector,
      onResultClick
    );
    this.autocompleteResultClick = wireUpEventHandler(
      "onAutocompleteResultClick",
      apiConnector,
      onAutocompleteResultClick
    );
    this.plugins = plugins;
  }

  public emit(event: Event) {
    this.plugins.forEach((middleware) => {
      middleware.subscribe(event);
    });
  }
}

export default Events;
