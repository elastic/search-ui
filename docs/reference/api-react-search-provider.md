---
navigation_title: "React API"
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/api-react-search-provider.html
---

# SearchProvider [api-react-search-provider]

The `SearchProvider` is a React wrapper around the Headless Core, and makes state and actions available to Search UI and in a React [Context](https://reactjs.org/docs/context.html), and also via a [Render Prop](https://reactjs.org/docs/render-props.html).

It looks like this:

```jsx
import { SearchProvider, SearchBox } from "@elastic/react-search-ui";
import ElasticSearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const connector = new ElasticSearchAPIConnector({
  host: "https://search-ui-sandbox.es.us-central1.gcp.cloud.es.io:9243",
  index: "national-parks",
  apiKey: "SlUzdWE0QUJmN3VmYVF2Q0F6c0I6TklyWHFIZ3lTbHF6Yzc2eEtyeWFNdw=="
});

const configurationOptions = {
  apiConnector: connector,
  searchQuery: { ... },
  autocompleteQuery: { ... },
  hasA11yNotifications: true,
  a11yNotificationMessages: {
    searchResults: ({ start, end, totalResults, searchTerm }) =>
      `Searching for "${searchTerm}". Showing ${start} to ${end} results out of ${totalResults}.`
  },
  alwaysSearchOnInitialLoad: true
};

const App = () => (
  <SearchProvider config={configurationOptions}>
    <div className="App">
      <SearchBox />
    </div>
  </SearchProvider>
);
```

| option                      | type                                                                                                        | description                                                                                                                                                                                                                 |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiConnector`              | APIConnector                                                                                                | Instance of a Connector. See Connectors API section.                                                                                                                                                                        |
| `onSearch`                  | function                                                                                                    | You may provide individual handlers instead of a Connector, override individual Connector handlers, or act as middleware to Connector methods.                                                                              |
| `onAutocomplete`            | function                                                                                                    | You may provide individual handlers instead of a Connector, override individual Connector handlers, or act as middleware to Connector methods.                                                                              |
| `onResultClick`             | function                                                                                                    | You may provide individual handlers instead of a Connector, override individual Connector handlers, or act as middleware to Connector methods.                                                                              |
| `onAutocompleteResultClick` | function                                                                                                    | You may provide individual handlers instead of a Connector, override individual Connector handlers, or act as middleware to Connector methods.                                                                              |
| `autocompleteQuery`         | [Autocomplete Query Config](/reference/api-core-configuration.md#api-core-configuration-autocomplete-query) | Configuration options for the autocomplete query.                                                                                                                                                                           |
| `debug`                     | Boolean                                                                                                     | Trace log actions and state changes. Default is false.                                                                                                                                                                      |
| `initialState`              | Object                                                                                                      | Set inital state of Search UI. See [Initial State](#api-react-search-provider-initial-state) for more information.                                                                                                          |
| `searchQuery`               | [Search Query Config](/reference/api-core-configuration.md#api-core-configuration-autocomplete-query)       | Configuration options for the main search query.                                                                                                                                                                            |
| `trackUrlState`             | Boolean                                                                                                     | By default, [Request State](/reference/api-core-state.md#api-core-state-request-state) will be synced with the browser url. To turn this off, pass `false`.                                                                 |
| `urlPushDebounceLength`     | Integer                                                                                                     | The amount of time in milliseconds to debounce/delay updating the browser url after the UI update. This, for example, prevents excessive history entries while a user is still typing in a live search box. Default is 500. |
| `hasA11yNotifications`      | Boolean                                                                                                     | Search UI will create a visually hidden live region to announce search results & other actions to screen reader users. This accessibility feature will be turned on by default in our 2.0 release. Default is false.        |
| `a11yNotificationMessages`  | Object                                                                                                      | You can override our default screen reader packages/search-ui/src/A11yNotifications.js#L49[messages] (e.g. for localization), or create your own custom notification, by passing in your own key and message function(s).   |
| `alwaysSearchOnInitialLoad` | Boolean                                                                                                     | If true, Search UI will always do an initial search, even when no inital Request State is set.                                                                                                                              |

## Context [api-react-search-provider-context]

The "Context" is a flattened object containing, as keys, all [State](/reference/api-core-state.md) and [Actions](/reference/api-core-actions.md).

We refer to it as "Context" because it is implemented with a [React Context](https://reactjs.org/docs/context.html).

ex.

```js
{
  resultsPerPage: 10, // Request State
  setResultsPerPage: () => {}, // Action
  current: 1, // Request State
  setCurrent: () => {}, // Action
  error: '', // Response State
  isLoading: false, // Response State
  totalResults: 1000, // Response State
  ...
}
```

## Initial State [api-react-search-provider-initial-state]

This is useful for defaulting a search term, sort, etc.

Example

```js
  initialState: { searchTerm: "test", resultsPerPage: 40 }
```

See [Request State](/reference/api-core-state.md) for more properties that can be set in initial state.
