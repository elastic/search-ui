# `search-ui`

A "Headless Search UI". It handles all of the state management, API calls, and url management concerns of a search experience, and exposes that as a [state](packages/search-ui/README.md#state) object and a group of [actions](packages/search-ui/README.md#actions) to act on that state. It is built with plain old javascript, and serves as the base for our [React](packages/react-search-components) and [JQuery](packages/jquery-search-components) Framework Implementations.

## Usage

```shell
npm install --save import @elastic/search-ui
```

```js
import { SearchDriver } from "@elastic/search-ui";

const connector = new AppSearchAPIConnector({
  searchKey: "search-soaewu2ye6uc45dr8mcd54v8",
  engineName: "national-parks-demo",
  hostIdentifier: "host-2376rb"
});

const config = {
  apiConnector: connector,
  facetConfig: { states: { type: "value" } },
  searchOptions: {
    search_fields: { title: {} },
    result_fields: { title: { snippet: { size: 300, fallback: true } } }
  }
};

const driver = new SearchDriver(config);

driver.subscribeToStateChanges(state =>
  console.log(`Received ${state.totalResults} results for your search!`)
);

driver.getActions().setSearchTerm("canyon");

// Received 8 results for your search!
```

## SearchDriver Usage

### Methods

| method                    | params   | return                        | description                                                          |
| ------------------------- | -------- | ----------------------------- | -------------------------------------------------------------------- |
| `subscribeToStateChanges` | function |                               | Function to execute when state changes. ex.<br/><br/>`(state) => {}` |
| `getActions`              |          | Object of [Actions](#actions) | All available actions                                                |
| `getState`                |          | [State](#state)               | Current state                                                        |

### Actions <a id="actions"></a>

| method              | params                                                                                                                                                                     | return | description                                                                                 |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------- |
| `addFilter`         | `name` String - field name to filter on<br/>`value` String - field value to filter on                                                                                      |        | Add a filter in addition to current filters values                                          |
| `setFilter`         | `name` String - field name to filter on<br/>`value` String - field value to filter on                                                                                      |        | Set a filter value, replacing current filter values                                         |
| `removeFilter`      | `name` String - field name to filter on<br/>`value` String - field value to filter on                                                                                      |        | Remove a single filter value                                                                |
| `clearFilters`      |                                                                                                                                                                            |        | Clear all filters                                                                           |
| `setCurrent`        | Integer                                                                                                                                                                    |        |                                                                                             |
| `setResultsPerPage` | Integer                                                                                                                                                                    |        |                                                                                             |
| `setSearchTerm`     | String                                                                                                                                                                     |        |                                                                                             |
| `setSort`           | `sortField` String - field to sort on<br/>`sortDirection` String - "asc" or "desc"                                                                                         |        |                                                                                             |
| `trackClickThrough` | `documentId` String - The document ID associated with the result that was clicked<br/>`tag` - Array[String] Optional tags which can be used to categorize this click event |        | Report a click through event. A click through event is when a user clicks on a result link. |

### State <a id="state"></a>

All [Search Parameters](#searchparameters) can be found in state.

Additionally, the following can also be found:

| field              | type          | description                                                                                                                                                                                                                                                               |
| ------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `error`            | String        | Error message, if an error was thrown.                                                                                                                                                                                                                                    |
| `isLoading`        | boolean       | Whether or not a search is currently being performed                                                                                                                                                                                                                      |
| `facets`           | Object        | Follows the facet syntax in App Search responses                                                                                                                                                                                                                          |
| `requestId`        | String        | A unique ID for the current search results                                                                                                                                                                                                                                |
| `results`          | Array[Object] | An array of result items                                                                                                                                                                                                                                                  |
| `resultSearchTerm` | String        | As opposed the the `searchTerm` state, which is tied to the current search parameter, this is tied to the searchTerm for the current results. There will be a period of time in between when a request is started and finishes where the two pieces of state will differ. |
| `totalResults`     | Integer       | Total number of hits for the current query                                                                                                                                                                                                                                |
| `wasSearched`      | boolean       | Was a search performed yet since this driver was created. Can be useful for displaying initial states in the UI.                                                                                                                                                          |

### SearchDriver Configuration <a id="driverconfig"></a>

| option          | type                                   | required? | source                                                                                                                         |
| --------------- | -------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `apiConnector`  | APIConnector                           | required  | Instance of an API Connector. For instance, [search-ui-app-search-connector](../search-ui-app-search-connector).               |
| `facetConfig`   | [Facet Configuration](#facetconfig)    | optional  | Which values to provide Facet values for.                                                                                      |
| `initialState`  | [Search Parameters](#searchparameters) | optional  | Set initial state of the search. ex:<br/><br/>`{ searchTerm: "test", resultsPerPage: 40 }`                                     |
| `searchOptions` | Object                                 | optional  | Any additional, arbitrary search config to be passed to the Search API to further tune your queries. Ex, `result_fields`, etc. |
| `trackURLState` | boolean                                | optional  | By default, state will be synced with the browser url. To turn this off, pass `false`                                          |

### Facet Configuration <a id="facetconfig"></a>

The syntax for Facet configuration follows the App Search API syntax: https://swiftype.com/documentation/app-search/api/search/facets. In addition to the options provided by the API, the following per Facet configuration is also available:

| option        | type     | required? | source                                                                                                                                                                                                  |
| ------------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `conditional` | function | optional  | This facet will only be fetched if the condition specified returns `true`, based on the currently applied filters. This is useful for creating hierarchical facets.<br/><br/>`(filters) => return true` |
| `disjunctive` | boolean  | optional  | When returning counts for disjunctive facets, the counts will be returned as if no filter is applied on this field, even if one is applied. A common use case for this is tabbed filters.               |

### Search Parameters <a id="searchparameters"></a>

| option           | type                     | required? | source                                                                                                     |
| ---------------- | ------------------------ | --------- | ---------------------------------------------------------------------------------------------------------- |
| `current`        | Integer                  | optional  | current page number                                                                                        |
| `filters`        | Array[Object]            | optional  | Follows the filter syntax for App Search: https://swiftype.com/documentation/app-search/api/search/filters |
| `resultsPerPage` | Integer                  | optional  | Number of results to show on each page                                                                     |
| `searchTerm`     | String                   | optional  | String to search for                                                                                       |
| `sortDirection`  | String ["asc" \| "desc"] | optional  | Direction to sort                                                                                          |
| `sortField`      | String                   | optional  | Name of field to sort on                                                                                   |
