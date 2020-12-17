# Contents

1. [Headless Core](#headless-core)
2. [Component Reference](#component-reference)
3. [Customization](#customization)
4. [Advanced Configuration](#advanced-configuration)
5. [Build Your Own Component](#build-your-own-component)
6. [Connectors and Handlers](#connectors-and-handlers)
7. [Performance](#performance)
8. [Debugging](#debugging)

# Headless Core

- [Headless Core Concepts](#headless-core-concepts)
- [Working with the Headless Core](#working-with-the-headless-core)
- [Headless Core Reference](#headless-core-reference)

## Headless Core Concepts

```
                                    |
    @elastic/react-search-ui        |   @elastic/search-ui
                                    |
                                    |
          SearchProvider <--------------- SearchDriver
              |     |               |          |
   State /    |     |               |          | State /
   Actions    |     |               |          | Actions
              |     |               |          |
        Components  |               |          |
              |     |               |          |
              v     v               |          v
------------------------------------+----------------------------
              |     |                          |
              v     v                          v
          Using     Headless Usage       Headless Usage outside
     Components     in React             of React
```

The core is a separate, vanilla JS library which can be used for any JavaScript based implementation.

> [@elastic/search-ui](https://github.com/elastic/search-ui/tree/master/packages/search-ui)

The Headless Core implements the functionality behind a search experience, but without its own view. It provides the underlying "state" and "actions" associated with that view. For instance, the core provides a `setSearchTerm` action, which can be used to save a `searchTerm` property in the state. Calling `setSearchTerm` using the value of an `<input>` will save the `searchTerm` to be used to build a query.

All of the Components in this library use the Headless Core under the hood. For instance, Search UI provides a `SearchBox` Component for collecting input from a user. But you are not restricted to using just that Component. Since Search UI lets you work directly with "state" and "actions", you could use any type of input you want! As long as your input or Component calls the Headless Core's `setSearchTerm` action, it will "just work". This gives you maximum flexibility over your experience if you need more than the Components in Search UI have to offer.

The `SearchProvider` is a React wrapper around the Headless Core, and makes state and actions available to Search UI
and in a React [Context](https://reactjs.org/docs/context.html), and also via a
[Render Prop](https://reactjs.org/docs/render-props.html).

It looks like this:

```jsx
<SearchProvider config={config}>
  <WithSearch>
    {/*WithSearch exposes the "Context"*/}
    {context => {
      // Context contains state, like "searchTerm"
      const searchTerm = context.searchTerm;
      // Context also contains actions, like "setSearchTerm"
      const setSearchTerm = context.setSearchTerm;
      return (
        <div className="App">
          {/*An out-of-the-box Component like SearchBox uses State and Actions under the hood*/}
          <SearchBox />
          {/*We could work directly with those State and Actions also */}
          <input value={searchTerm} onChange={setSearchTerm} />
        </div>
      );
    }}
  </WithSearch>
</SearchProvider>
```

## Working with the Headless Core

If you wish to work with Search UI outside of a particular Component, you'll work
directly with the core.

There are two methods for accessing the headless core directly, `withSearch` and
`WithSearch`. They use the [HOC](https://reactjs.org/docs/higher-order-components.html) and
[Render Props](https://reactjs.org/docs/render-props.html) patterns, respectively. The two methods
are similar, and choosing between the two is mostly personal preference.

Both methods expose a `mapContextToProps` function which allows you to pick which state and actions
from context you need to work with.

### mapContextToProps

`mapContextToProps` allows you to pick which state and actions
from Context you need to work with. `withSearch` and `WithSearch` both use [React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent),
and will only re-render when the picked state has changed.

| name    | type   | description         |
| ------- | ------ | ------------------- |
| context | Object | The current Context |
| props   | Object | The current props   |

ex.:

```jsx
// Selects `searchTerm` and `setSearchTerm` for use in Component
withSearch(({ searchTerm, setSearchTerm }) => ({
  searchTerm,
  setSearchTerm
}))(Component);

// Uses current `props` to conditionally modify context
withSearch(({ searchTerm }, { someProp }) => ({
  searchTerm: someProp ? "" : searchTerm
}))(Component);
```

### withSearch

This is the [HOC](https://reactjs.org/docs/higher-order-components.html) approach to working with the
core.

This is typically used for creating your own Components.

See [Build Your Own Component](#build-your-own-component).

### WithSearch

This is the [Render Props](https://reactjs.org/docs/render-props.html) approach to working with the core.

One use case for that would be to render a "loading" indicator any time the application is fetching data.

For example:

```jsx
<SearchProvider config={config}>
  <WithSearch mapContextToProps={({ isLoading }) => ({ isLoading })}>
    {({ isLoading }) => (
      <div className="App">
        {isLoading && <div>I'm loading now</div>}
        {!isLoading && (
          <Layout
            header={<SearchBox />}
            bodyContent={<Results titleField="title" urlField="nps_link" />}
          />
        )}
      </div>
    )}
  </WithSearch>
</SearchProvider>
```

### Combining Actions

There are certain cases where you may need to apply one or more actions at a time. Search UI intelligently
batches actions into a single API call.

For example, if you need to apply two filters at once, it is perfectly acceptable to write the following code:

```
addFilter("states", "Alaska", "any");
addFilter("world_heritage_site", "true");
```

This will only result in a single API call.

## Headless Core Reference

### SearchProvider

The `SearchProvider` is a top-level Component which is essentially a wrapper around the core.

It exposes the [State](#state) and [Actions](#actions) of the core in a [Context](#context).

Params:

| name     | type       | description                                                        |
| -------- | ---------- | ------------------------------------------------------------------ |
| config   | Object     | See the [Advanced Configuration](#advanced-configuration) section. |
| children | React Node |                                                                    |

### Context

The "Context" is a flattened object containing, as keys, all [State](#state) and [Actions](#actions).

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

### Actions

| method              | params                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | return | description                                                                                                                               |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `addFilter`         | `name` String - field name to filter on<br/>`value` [FilterValue](./packages/react-search-ui/src/types/FilterValue.js) to apply<br/>`filterType` String - type of filter to apply: "all", "any", or "none"                                                                                                                                                                                                                                                                                                                                                                                                  |        | Add a filter in addition to current filters values.                                                                                       |
| `setFilter`         | `name` String - field name to filter on<br/>`value` [FilterValue](./packages/react-search-ui/src/types/FilterValue.js) to apply<br/>`filterType` String - type of filter to apply: "all", "any", or "none"                                                                                                                                                                                                                                                                                                                                                                                                  |        | Set a filter value, replacing current filter values.                                                                                      |
| `removeFilter`      | `name` String - field to remove filters from<br/>`value` String - (Optional) Specify which filter value to remove<br/>`filterType` String - (Optional) Specify which filter type to remove: "all", "any", or "none"                                                                                                                                                                                                                                                                                                                                               |        | Removes filters or filter values.                                                                                                         |
| `reset`             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |        | Reset state to initial search state.                                                                                                      |
| `clearFilters`      | `except` Array[String] - List of field names that should NOT be cleared                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |        | Clear all filters.                                                                                                                        |
| `setCurrent`        | Integer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |        | Update the current page number. Used for paging.                                                                                          |
| `setResultsPerPage` | Integer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |        |                                                                                                                                           |
| `setSearchTerm`     | `searchTerm` String<br/> `options` Object<br/>`options.refresh` Boolean - Refresh search results on update. Default: `true`.<br/>`options.debounce` Number - Length to debounce any resulting queries.<br/>`options.shouldClearFilters` Boolean - Should existing filters be cleared? Default: `true`.<br/>`options.autocompleteSuggestions` Boolean - Fetch query suggestions for autocomplete on update, stored in `autocompletedSuggestions` state<br/>`options.autocompleteResults` Boolean - Fetch results on update, stored in `autocompletedResults` state |        |                                                                                                                                           |
| `setSort`           | `sortField` String - field to sort on<br/>`sortDirection` String - "asc" or "desc"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |        |                                                                                                                                           |
| `trackClickThrough` | `documentId` String - The document ID associated with the result that was clicked<br/>`tag` - Array[String] Optional tags which can be used to categorize this click event                                                                                                                                                                                                                                                                                                                                                                                        |        | Report a clickthrough event, which is when a user clicks on a result link.                                                                |
| `a11yNotify`        | `messageFunc` String - object key to run as function<br/>`messageArgs` Object - Arguments to pass to form your screen reader message string                                                                                                                                                                                                                                                                                                                                                                                                                       |        | Reads out a screen reader accessible notification. See `a11yNotificationMessages` under [Advanced Configuration](#advanced-configuration) |

### State

State can be divided up into a few different types.

1. Request State - State that is used as parameters on Search API calls.
2. Result State - State that represents a response from a Search API call.
3. Application State - The general state.

Request State and Result State will often have similar values. For instance, `searchTerm` and `resultSearchTerm`.
`searchTerm` is the current search term in the UI, and `resultSearchTerm` is the term associated with the current
`results`. This can be relevant in the UI, where you might not want the search term on the page to change until AFTER
a response is received, so you'd use the `resultSearchTerm` state.

#### Request State

State that is used as parameters on Search API calls.

Request state can be set by:

- Using actions, like `setSearchTerm`
- The `initialState` option.
- The URL query string, if `trackUrlState` is enabled.

| option                                            | type                                                            | required? | source                                 |
| ------------------------------------------------- | --------------------------------------------------------------- | --------- | -------------------------------------- |
| `current`                                         | Integer                                                         | optional  | Current page number                    |
| `filters`                                         | Array[[Filter](./packages/react-search-ui/src/types/Filter.js)] | optional  |                                        |
| <a name="resultsPerPageProp"></a>`resultsPerPage` | Integer                                                         | optional  | Number of results to show on each page |
| `searchTerm`                                      | String                                                          | optional  | Search terms to search for             |
| `sortDirection`                                   | String ["asc" \| "desc"]                                        | optional  | Direction to sort                      |
| `sortField`                                       | String                                                          | optional  | Name of field to sort on               |

#### Response State

State that represents a response from a Search API call.

It is not directly update-able.

It is updated indirectly by invoking an action which results in a new API request.

| field                               | type                                                                                   | description                                                                                                                                                                                                                                                               |
| ----------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autocompletedResults`              | Array[[Result](./packages/react-search-ui/src/types/Result.js)]                        | An array of results items fetched for an autocomplete dropdown.                                                                                                                                                                                                           |
| `autocompletedResultsRequestId`     | String                                                                                 | A unique ID for the current autocompleted search results.                                                                                                                                                                                                                 |
| `autocompletedSuggestions`          | Object[String, Array[[Suggestion](./packages/react-search-ui/src/types/Suggestion.js)] | A keyed object of query suggestions. It's keyed by type since multiple types of query suggestions can be set here.                                                                                                                                                        |
| `autocompletedSuggestionsRequestId` | String                                                                                 | A unique ID for the current autocompleted suggestion results.                                                                                                                                                                                                             |
| `facets`                            | Object[[Facet](./packages/react-search-ui/src/types/Facet.js)]                         | Will be populated if `facets` configured in [Advanced Configuration](#advanced-configuration).                                                                                                                                                                            |
| `rawResponse`                       | Object                                                                                 | The response object received from the API                                                                                                                                                                                                                                 |
| `requestId`                         | String                                                                                 | A unique ID for the current search results.                                                                                                                                                                                                                               |
| `results`                           | Array[[Result](./packages/react-search-ui/src/types/Result.js)]                        | An array of result items.                                                                                                                                                                                                                                                 |
| `resultSearchTerm`                  | String                                                                                 | As opposed the the `searchTerm` state, which is tied to the current search parameter, this is tied to the searchTerm for the current results. There will be a period of time in between when a request is started and finishes where the two pieces of state will differ. |
| `totalResults`                      | Integer                                                                                | Total number of results found for the current query.                                                                                                                                                                                                                      |

#### Application State

Application state is the general application state.

| field         | type    | description                                                                                                        |
| ------------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| `error`       | String  | Error message, if an error was thrown.                                                                             |
| `isLoading`   | boolean | Whether or not a search is currently being performed.                                                              |
| `wasSearched` | boolean | Has any query been performed since this driver was created? Can be useful for displaying initial states in the UI. |

# Component Reference

Note that all components in this library are Pure Components. Read more
about that [here](#performance).

The following Components are available:

- [SearchBox](#searchbox)
- [Results](#results)
- [Result](#result)
- [ResultsPerPage](#resultsperpage)
- [Facet](#facet)
- [Sorting](#sorting)
- [Paging](#paging)
- [PagingInfo](#paginginfo)
- [ErrorBoundary](#errorboundary)

## SearchBox

Input element which accepts search terms and triggers a new search query.

### Example

```jsx

import { SearchBox } from "@elastic/react-search-ui";

...

<SearchBox />
```

### Configuring search queries

The input from `SearchBox` will be used to trigger a new search query. That query can be further customized
in the `SearchProvider` configuration, using the `searchQuery` property. See the
[Advanced Configuration](#advanced-configuration) guide for more information.

### Example of passing custom props to text input element

```jsx
<SearchBox inputProps={{ placeholder: "custom placeholder" }} />
```

### Example of view customizations

You can customize the entire view. This is useful to use an entirely different
autocomplete library (we use [downshift](https://github.com/downshift-js/downshift)). But for making small
customizations, like simply hiding the search button, this is often overkill.

```jsx
<SearchBox
  view={({ onChange, value, onSubmit }) => (
    <form onSubmit={onSubmit}>
      <input value={value} onChange={e => onChange(e.currentTarget.value)} />
    </form>
  )}
/>
```

You can also just customize the input section of the search box. Useful for things
like hiding the submit button or rearranging dom structure:

```jsx
<SearchBox
  inputView={({ getAutocomplete, getInputProps, getButtonProps }) => (
    <>
      <div className="sui-search-box__wrapper">
        <input
          {...getInputProps({
            placeholder: "I am a custom placeholder"
          })}
        />
        {getAutocomplete()}
      </div>
      <input
        {...getButtonProps({
          "data-custom-attr": "some value"
        })}
      />
    </>
  )}
/>
```

Note that `getInputProps` and `getButtonProps` are
[prop getters](https://kentcdodds.com/blog/how-to-give-rendering-control-to-users-with-prop-getters).
They are meant return a props object to spread over their corresponding UI elements. This lets you arrange
elements however you'd like in the DOM. It also lets you pass additional properties. You should pass properties
through these functions, rather directly on elements, in order to not override base values. For instance,
adding a `className` through these functions will assure that the className is only appended, not overriding base class values on those values.

`getAutocomplete` is used to determine where the autocomplete dropdown will be shown.

Or you can also just customize the autocomplete dropdown:

```jsx
<SearchBox
  autocompleteView={({ autocompletedResults, getItemProps }) => (
    <div className="sui-search-box__autocomplete-container">
      {autocompletedResults.map((result, i) => (
        <div
          {...getItemProps({
            key: result.id.raw,
            item: result
          })}
        >
          Result {i}: {result.title.snippet}
        </div>
      ))}
    </div>
  )}
/>
```

### Example using autocomplete results

"Results" are search results. The default behavior for autocomplete
results is to link the user directly to a result when selected, which is why
a "titleField" and "urlField" are required for the default view.

```jsx
<SearchBox
  autocompleteResults={{
    titleField: "title",
    urlField: "nps_link"
  }}
/>
```

### Example using autocomplete suggestions

"Suggestions" are different than "results". Suggestions are suggested queries. Unlike an autocomplete result, a
suggestion does not go straight to a result page when selected. It acts as a regular search query and
refreshes the result set.

```jsx
<SearchBox autocompleteSuggestions={true} />
```

### Example using autocomplete suggestions and autocomplete results

The default view will show both results and suggestions, divided into
sections. Section titles can be added to help distinguish between the two.

```jsx
<SearchBox
  autocompleteResults={{
    sectionTitle: "Suggested Results",
    titleField: "title",
    urlField: "nps_link"
  }}
  autocompleteSuggestions={{
    sectionTitle: "Suggested Queries"
  }}
/>
```

### Configuring autocomplete queries

Autocomplete queries can be customized in the `SearchProvider` configuration, using the `autocompleteQuery` property.
See the [Advanced Configuration Guide](#advanced-configuration) for more information.

```jsx
<SearchProvider
    config={{
      ...
      autocompleteQuery: {
        // Customize the query for autocompleteResults
        results: {
          result_fields: {
            // Add snippet highlighting
            title: { snippet: { size: 100, fallback: true } },
            nps_link: { raw: {} }
          }
        },
        // Customize the query for autocompleteSuggestions
        suggestions: {
          types: {
            // Limit query to only suggest based on "title" field
            documents: { fields: ["title"] }
          },
          // Limit the number of suggestions returned from the server
          size: 4
        }
      }
    }}
>
    <SearchBox
      autocompleteResults={{
        sectionTitle: "Suggested Results",
        titleField: "title",
        urlField: "nps_link"
      }}
      autocompleteSuggestions={{
        sectionTitle: "Suggested Queries",
      }}
    />
</SearchProvider>
```

### Example using multiple types of autocomplete suggestions

"Suggestions" can be generated via multiple methods. They can be derived from
common terms and phrases inside of documents, or be "popular" queries
generated from actual search queries made by users. This will differ
depending on the particular Search API you are using.

**Note**: Elastic App Search currently only supports type "documents", and Elastic Site Search
does not support suggestions. This is purely illustrative in case a Connector is used that
does support multiple types.

```jsx
<SearchProvider
    config={{
      ...
      autocompleteQuery: {
        suggestions: {
          types: {
            documents: { },
            // FYI, this is not a supported suggestion type in any current connector, it's an example only
            popular_queries: { }
          }
        }
      }
    }}
>
    <SearchBox
      autocompleteSuggestions={{
        // Types used here need to match types requested from the server
        documents: {
          sectionTitle: "Suggested Queries",
        },
        popular_queries: {
          sectionTitle: "Popular Queries"
        }
      }}
    />
</SearchProvider>
```

### Example using autocomplete in a site header

This is an example from a [Gatsby](https://www.gatsbyjs.org/) site, which overrides "submit" to navigate a user to the search
page for suggestions, and maintaining the default behavior when selecting a result.

```jsx
<SearchBox
  autocompleteResults={{
    titleField: "title",
    urlField: "nps_link"
  }}
  autocompleteSuggestions={true}
  onSubmit={searchTerm => {
    navigate("/search?q=" + searchTerm);
  }}
  onSelectAutocomplete={(selection, {}, defaultOnSelectAutocomplete) => {
    if (selection.suggestion) {
      navigate("/search?q=" + selection.suggestion);
    } else {
      defaultOnSelectAutocomplete(selection);
    }
  }}
/>
```

### Properties

| Name                          | type                                                                         | Required? | Default                                                            | Options | Description                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| className                     | String                                                                       | no        |                                                                    |         |                                                                                                                                                                                                                                                                                                                                                              |
| shouldClearFilters            | Boolean                                                                      | no        | true                                                               |         | Should existing filters be cleared when a new search is performed?                                                                                                                                                                                                                                                                                           |
| inputProps                    | Object                                                                       | no        |                                                                    |         | Props for underlying 'input' element. I.e., `{ placeholder: "Enter Text"}`.                                                                                                                                                                                                                                                                                  |
| searchAsYouType               | Boolean                                                                      | no        | false                                                              |         | Executes a new search query with every key stroke. You can fine tune the number of queries made by adjusting the `debounceLength` parameter.                                                                                                                                                                                                                 |
| debounceLength                | Number                                                                       | no        | 200                                                                |         | When using `searchAsYouType`, it can be useful to "debounce" search requests to avoid creating an excessive number of requests. This controls the length to debounce / wait.                                                                                                                                                                                 |
| view                          | Render Function                                                              | no        | [SearchBox](packages/react-search-ui-views/src/SearchBox.js)       |         | Used to override the default view for this Component. See the [Customization: Component views and HTML](#component-views-and-html) section for more information.                                                                                                                                                                                             |
| autocompleteResults           | Boolean or [AutocompleteResultsOptions](#AutocompleteResultsOptions)         | Object    | no                                                                 |         | Configure and autocomplete search results. Boolean option is primarily available for implementing custom views.                                                                                                                                                                                                                                              |
| autocompleteSuggestions       | Boolean or [AutocompleteSuggestionsOptions](#AutocompleteSuggestionsOptions) | Object    | no                                                                 |         | Configure and autocomplete query suggestions. Boolean option is primarily available for implementing custom views. Configuration may or may not be keyed by "Suggestion Type", as APIs for suggestions may support may than 1 type of suggestion. If it is not keyed by Suggestion Type, then the configuration will be applied to the first type available. |
| autocompleteMinimumCharacters | Integer                                                                      | no        | 0                                                                  |         | Minimum number of characters before autocompleting.                                                                                                                                                                                                                                                                                                          |
| autocompleteView              | Render Function                                                              | no        | [Autocomplete](packages/react-search-ui-views/src/Autocomplete.js) |         | Provide a different view just for the autocomplete dropdown.                                                                                                                                                                                                                                                                                                 |
| inputView                     | Render Function                                                              | no        | [SearchInput](packages/react-search-ui-views/src/SearchInput.js)   |         | Provide a different view just for the input section.                                                                                                                                                                                                                                                                                                         |
| onSelectAutocomplete          | Function(selection. options, defaultOnSelectAutocomplete)                    | no        |                                                                    |         | Allows overriding behavior when selected, to avoid creating an entirely new view. In addition to the current `selection`, various helpers are passed as `options` to the second parameter. This third parameter is the default `onSelectAutocomplete`, which allows you to defer to the original behavior.                                                   |
| onSubmit                      | Function(searchTerm)                                                         | no        |                                                                    |         | Allows overriding behavior when submitted. Receives the search term from the search box.                                                                                                                                                                                                                                                                     |

#### AutocompleteResultsOptions

| Name                    | type          | Required? | Default | Options | Description                                               |
| ----------------------- | ------------- | --------- | ------- | ------- | --------------------------------------------------------- |
| linkTarget              | String        | no        | \_self  |         | Used to open links in a new tab.                          |
| sectionTitle            | String        | no        |         |         | Title to show in section within dropdown.                 |
| shouldTrackClickThrough | Boolean       | no        | true    |         | Only applies to Results, not Suggestions.                 |
| clickThroughTags        | Array[String] | no        |         |         | Tags to send to analytics API when tracking clickthrough. |
| titleField              | String        | yes       |         |         | Field within a Result to use as the "title".              |
| urlField                | String        | yes       |         |         | Field within a Result to use for linking.                 |

#### AutocompleteSuggestionsOptions

| Name         | type   | Required? | Default | Options | Description                              |
| ------------ | ------ | --------- | ------- | ------- | ---------------------------------------- |
| sectionTitle | String | no        |         |         | Title to show in section within dropdown |

---

## Results

Displays all search results.

### Example

```jsx

import { Results } from "@elastic/react-search-ui";

...

<Results titleField="title" urlField="nps_link" />
```

### Configuring search queries

Certain aspects of search results can be configured in `SearchProvider`, using the `searchQuery` configuration, such as
term highlighting and search fields. See the [Advanced Configuration](#advanced-configuration) guide
for more information.

### Properties

| Name                    | type            | Required? | Default                                                  | Options | Description                                                                                                                                          |
| ----------------------- | --------------- | --------- | -------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| className               | String          | no        |                                                          |         |                                                                                                                                                      |
| resultView              | Render Function | no        | [Result](packages/react-search-ui-views/src/Result.js)   |         | Used to override individual Result views. See the Customizing Component views and html section for more information.                                 |
| titleField              | String          | no        |                                                          |         | Name of field to use as the title from each result.                                                                                                  |
| shouldTrackClickThrough | Boolean         | no        | true                                                     |         | Whether or not to track a clickthrough event when clicked.                                                                                           |
| clickThroughTags        | Array[String]   | no        |                                                          |         | Tags to send to analytics API when tracking clickthrough.                                                                                            |
| urlField                | String          | no        |                                                          |         | Name of field to use as the href from each result.                                                                                                   |
| view                    | Render Function | no        | [Results](packages/react-search-ui-views/src/Results.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

---

## Result

Displays a search result.

### Example

```jsx

import { Result } from "@elastic/react-search-ui";

...

<SearchProvider config={config}>
  {({ results }) => {
    return (
      <div>
        {results.map(result => (
          <Result key={result.id.raw}
            result={result}
            titleField="title"
            urlField="nps_link"
          />
        ))}
      </div>
    );
  }}
</SearchProvider>
```

### Configuring search queries

Certain aspects of search results can be configured in `SearchProvider`, using the `searchQuery` configuration, such as
term highlighting and search fields. See the [Advanced Configuration](#advanced-configuration) guide
for more information.

### Properties

| Name                    | type                                                         | Required? | Default                                                | Options | Description                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------ | --------- | ------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| className               | String                                                       | no        |                                                        |         |                                                                                                                                                      |
| titleField              | String                                                       | no        |                                                        |         | Name of field to use as the title from each result.                                                                                                  |
| shouldTrackClickThrough | Boolean                                                      | no        | true                                                   |         | Whether or not to track a clickthrough event when clicked.                                                                                           |
| clickThroughTags        | Array[String]                                                | no        |                                                        |         | Tags to send to analytics API when tracking clickthrough.                                                                                            |
| urlField                | String                                                       | no        |                                                        |         | Name of field to use as the href from each result.                                                                                                   |
| view                    | Render Function                                              | no        | [Result](packages/react-search-ui-views/src/Result.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |
| result                  | [Result](packages/react-search-ui-views/src/types/Result.js) | no        |                                                        |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

---

## ResultsPerPage

Shows a dropdown for selecting the number of results to show per page.

Uses [20, 40, 60] as default options. You can use `options` prop to pass custom options.

**Note:** When passing custom options make sure one of the option values match
the current [`resultsPerPage`](#resultsPerPageProp) value, which is 20 by default.
To override `resultsPerPage` default value [refer to the custom options example](#Example-using-custom-options).

### Example

```jsx

import { ResultsPerPage } from "@elastic/react-search-ui";

...

<ResultsPerPage />
```

### Example using custom options

```jsx

import { SearchProvider, ResultsPerPage } from "@elastic/react-search-ui";

<SearchProvider
    config={
        ...
        initialState: {
            resultsPerPage: 5
        }
    }
>
    <ResultsPerPage options={[5, 10, 15]} />
</SearchProvider>
```

### Properties

| Name      | type            | Required? | Default                                                                | Options | Description                                                                                                                                          |
| --------- | --------------- | --------- | ---------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| className | String          | no        |                                                                        |         |                                                                                                                                                      |
| options   | Array[Number]   | no        | [20, 40, 60]                                                           |         | Dropdown options to select the number of results to show per page.                                                                                   |
| view      | Render Function | no        | [ResultsPerPage](packages/react-search-ui-views/src/ResultsPerPage.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

---

## Facet

Show a Facet filter for a particular field.

Must configure the corresponding field in the `SearchProvider` [facets](#advanced-configuration) object.

### Example

```jsx
import { Facet } from "@elastic/react-search-ui";
import { MultiCheckboxFacet } from "@elastic/react-search-ui-views";

...

<SearchProvider config={{
  ...otherConfig,
  searchQuery: {
    facets: {
     states: { type: "value", size: 30 }
    }
  }
}}>
  {() => (
    <Facet field="states" label="States" view={MultiCheckboxFacet} />
  )}
</SearchProvider>
```

### Example of an OR based Facet filter

Certain configuration of the `Facet` Component will require a "disjunctive" facet to work
correctly. "Disjunctive" facets are facets that do not change when a selection is made. Meaning, all available options
will remain as selectable options even after a selection is made.

```jsx
import { Facet } from "@elastic/react-search-ui";
import { MultiCheckboxFacet } from "@elastic/react-search-ui-views";

...

<SearchProvider config={{
  ...otherConfig,
  searchQuery: {
    disjunctiveFacets: ["states"],
    facets: {
     states: { type: "value", size: 30 }
    }
  }
}}>
  {() => (
    <Facet field="states" label="States" view={MultiCheckboxFacet} filterType="any" />
  )}
</SearchProvider>
```

### Properties

| Name         | type            | Required? | Default                                                                        | Options                                                                                                                                                                                                                          | Description                                                                                                                                                                                                                                                |
| ------------ | --------------- | --------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className    | String          | no        |                                                                                |                                                                                                                                                                                                                                  |                                                                                                                                                                                                                                                            |
| field        | String          | yes       |                                                                                |                                                                                                                                                                                                                                  | Field name corresponding to this filter. This requires that the corresponding field has been configured in `facets` on the top level Provider.                                                                                                             |
| filterType   | String          | no        | "all"                                                                          | "all", "any", "none"                                                                                                                                                                                                             | The type of filter to apply with the selected values. I.e., should "all" of the values match, or just "any" of the values, or "none" of the values. Note: See the example above which describes using "disjunctive" facets in conjunction with filterType. |
| label        | String          | yes       |                                                                                |                                                                                                                                                                                                                                  | A static label to show in the facet filter.                                                                                                                                                                                                                |
| show         | Number          | no        | 5                                                                              |                                                                                                                                                                                                                                  | The number of facet filter options to show before concatenating with a "more" link.                                                                                                                                                                        |
| view         | Render Function | no        | [MultiCheckboxFacet](packages/react-search-ui-views/src/MultiCheckboxFacet.js) | [SingleLinksFacet](packages/react-search-ui-views/src/SingleLinksFacet.js) <br/> [SingleSelectFacet](packages/react-search-ui-views/src/SingleSelectFacet.js) [BooleanFacet](packages/react-search-ui-views/src/BooleanFacet.js) | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information.                                                                                                       |
| isFilterable | Boolean         | no        | false                                                                          |                                                                                                                                                                                                                                  | Whether or not to show Facet quick filter.                                                                                                                                                                                                                 |

---

## Sorting

Shows a dropdown for selecting the current Sort.

### Example

```jsx

import { Sorting } from "@elastic/react-search-ui";

...

<Sorting
  sortOptions={[
    {
      name: "Relevance",
      value: "",
      direction: ""
    },
    {
      name: "Title",
      value: "title",
      direction: "asc"
    }
  ]}
/>
```

### Properties

| Name        | type                                                                  | Required? | Default                                                  | Options | Description                                                                                                                                          |
| ----------- | --------------------------------------------------------------------- | --------- | -------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| className   | String                                                                | no        |                                                          |         |                                                                                                                                                      |
| label       | Array[[SortOption](packages/react-search-ui/src/types/SortOption.js)] | no        |                                                          |         | A static label to show in the Sorting Component.                                                                                                     |
| sortOptions | Array[[SortOption](packages/react-search-ui/src/types/SortOption.js)] | yes       |                                                          |         |                                                                                                                                                      |
| view        | Render Function                                                       | no        | [Sorting](packages/react-search-ui-views/src/Sorting.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

---

## Paging

Navigate through pagination.

### Example

```jsx

import { Paging } from "@elastic/react-search-ui";

...

<Paging />
```

### Properties

| Name      | type            | Required? | Default                                                | Options | Description                                                                                                                                          |
| --------- | --------------- | --------- | ------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| className | String          | no        |                                                        |         |                                                                                                                                                      |
| view      | Render Function | no        | [Paging](packages/react-search-ui-views/src/Paging.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

---

## PagingInfo

Paging details, like "1 - 20 of 100 results".

### Example

```jsx

import { PagingInfo } from "@elastic/react-search-ui";

...

<PagingInfo />
```

### Properties

| Name      | type            | Required? | Default                                                        | Options | Description                                                                                                                                          |
| --------- | --------------- | --------- | -------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| className | String          | no        |                                                                |         |                                                                                                                                                      |
| view      | Render Function | no        | [PagingInfo](packages/react-search-ui-views/src/PagingInfo.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

---

## ErrorBoundary

Handle unexpected errors.

### Example

```jsx
import { ErrorBoundary } from "@elastic/react-search-ui";

...

<ErrorBoundary>
  <div>Some Content</div>
</ErrorBoundary>
```

### Properties

| Name      | type            | Required? | Default                                                              | Options | Description                                                                                                                                          |
| --------- | --------------- | --------- | -------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| className | String          | no        |                                                                      |         |                                                                                                                                                      |
| children  | React node      | yes       |                                                                      |         | Content to show if no error has occurred, will be replaced with error messaging if there was an error.                                               |
| view      | Render Function | no        | [ErrorBoundary](packages/react-search-ui-views/src/ErrorBoundary.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

# Customization

- [Custom Styles and Layout](#custom-styles-and-layout)
- [Component Views and HTML](#component-views-and-html)
- [Component Behavior](#component-behavior)

## Custom Styles and Layout

Styling is up to you.

You can choose use the out of the box styles, or customize them.

To provide custom styles:

1. Write your own styles that target the class names in the individual Components. Do **NOT** include `styles.css`.
2. Override the default styles. Include `styles.css`, and then overwrite with your own styles.

For layout, provide your own layout instead of using the `Layout` Component.

For views and HTML, see the next section.

## Component Views and HTML

All Components in this library can be customized by providing a `view` prop.

Each Component's `view` will have a custom signature.

This follows the [React Render Props](https://reactjs.org/docs/render-props.html) pattern.

The clearest way to determine a Component's `view` function signature is to
look at the corresponding view Component's source code in
[react-search-ui-views](packages/react-search-ui-views/). Each Component in that
library implements a `view` function for a Component in the React library, so it
serves as a great reference.

For example, if we were to customize the `PagingInfo` Component...

We'd look up the default view from the [Components Reference](#component-reference) section for the `PagingInfo` Component.

The corresponding view is [PagingInfo](packages/react-search-ui-views/src/PagingInfo.js) -- see how the naming matches up?

After viewing that Component's source, you'll see it accepts 4 props:

1. `end`
2. `searchTerm`
3. `start`
4. `totalResults`

In our case, we care about the `start` and `end` values.

We provide a view function that uses those two props:

```jsx
<PagingInfo
  view={({ start, end }) => (
    <div className="paging-info">
      <strong>
        {start} - {end}
      </strong>
    </div>
  )}
/>
```

We could also accomplish this with a functional Component:

```jsx
const PagingInfoView = ({ start, end }) => (
  <div className="paging-info">
    <strong>
      {start} - {end}
    </strong>
  </div>
);

return <PagingInfo view={PagingInfoView} />;
```

## Component Behavior

**It will be helpful to read the [Headless Core](#headless-core) section first.**

We have two primary recommendations for customizing Component behavior:

1. Override state and action props before they are passed to your Component, using the `mapContextToProps` param. This
   will override the default [mapContextToProps](#mapContextToProps) for the component.
2. Override props before they are passed to your Component's view.

### Override mapContextToProps

Every Component supports a `mapContextToProps` prop, which allows you to modify state and actions
before they are received by the Component.

**NOTE** This MUST be an immutable function. If you directly update the props or context, you will have major issues in your application.

A practical example might be putting a custom sort on your facet data.

This example orders a list of states by name:

```jsx
<Facet
  mapContextToProps={context => {
    if (!context.facets.states) return context;
    return {
      ...context,
      facets: {
        ...(context.facets || {}),
        states: context.facets.states.map(s => ({
          ...s,
          data: s.data.sort((a, b) => {
            if (a.value > b.value) return 1;
            if (a.value < b.value) return -1;
            return 0;
          })
        }))
      }
    };
  }}
  field="states"
  label="States"
  show={10}
/>
```

### Overriding view props

An example of this is modifying the `onChange` handler of the `Paging` Component
view. Hypothetically, you may need to know every time a user
pages past page 1, indicating that they are not finding what they need on the first page
of search results.

```jsx
import { Paging } from "@elastic/react-search-ui";
import { Paging as PagingView } from "@elastic/react-search-ui-views";

function reportChange(value) {
  // Some logic to report the change
}

<Paging
  view={props =>
    PagingView({
      ...props,
      onChange: value => {
        reportChange(value);
        return props.onChange(value);
      }
    })
  }
/>;
```

In this example, we did the following:

1. Looked up what the default view is for our Component in the
   [Component Reference](#component-reference) guide.
2. Imported that view as `PagingView`.
3. Passed an explicit `view` to our `Paging` Component, overriding
   the `onChange` prop with our own implementation, and ultimately rendering
   `PagingView` with the updated props.

# Advanced Configuration

All configuration for Search UI is provided in a single configuration object.

```jsx
const configurationOptions = {
  apiConnector: connector,
  searchQuery: {
    disjunctiveFacets: ["acres"],
    disjunctiveFacetsAnalyticsTags: ["Ignore"],
    search_fields: {
      title: {},
      description: {}
    },
    result_fields: {
      title: {
        snippet: {
          size: 100,
          fallback: true
        }
      },
      nps_link: {
        raw: {}
      },
      description: {
        snippet: {
          size: 100,
          fallback: true
        }
      }
    },
    facets: {
      states: { type: "value", size: 30 },
      acres: {
        type: "range",
        ranges: [
          { from: -1, name: "Any" },
          { from: 0, to: 1000, name: "Small" },
          { from: 1001, to: 100000, name: "Medium" },
          { from: 100001, name: "Large" }
        ]
      }
    }
  },
  hasA11yNotifications: true,
  a11yNotificationMessages: {
    searchResults: ({ start, end, totalResults, searchTerm }) =>
      `Searching for "${searchTerm}". Showing ${start} to ${end} results out of ${totalResults}.`
  },
  alwaysSearchOnInitialLoad: true
};

return (
  <SearchProvider config={configurationOptions}>
    {() => (
      <div className="App">
        <Layout
          header={<SearchBox />}
          bodyContent={<Results titleField="title" urlField="nps_link" />}
        />
      </div>
    )}
  </SearchProvider>
);
```

**It is helpful to [read the section on the headless core](#headless-core) first!**

| option                      | type                                                                    | required? | default | description                                                                                                                                                                                                                  |
| --------------------------- | ----------------------------------------------------------------------- | --------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiConnector`              | APIConnector                                                            | optional  |         | Instance of a Connector. For instance, [search-ui-app-search-connector](packages/search-ui-app-search-connector).                                                                                                            |
| `onSearch`                  | function                                                                | optional  |         | You may provide individual handlers instead of a Connector, override individual Connector handlers, or act as middleware to Connector methods. See [Connectors and Handlers](#connectors-and-handlers) for more information. |
| `onAutocomplete`            | function                                                                | optional  |         | You may provide individual handlers instead of a Connector, override individual Connector handlers, or act as middleware to Connector methods. See [Connectors and Handlers](#connectors-and-handlers) for more information. |
| `onResultClick`             | function                                                                | optional  |         | You may provide individual handlers instead of a Connector, override individual Connector handlers, or act as middleware to Connector methods. See [Connectors and Handlers](#connectors-and-handlers) for more information. |
| `onAutocompleteResultClick` | function                                                                | optional  |         | You may provide individual handlers instead of a Connector, override individual Connector handlers, or act as middleware to Connector methods. See [Connectors and Handlers](#connectors-and-handlers) for more information. |
| `autocompleteQuery`         | Object                                                                  | optional  | {}      | Configuration options for the main search query.                                                                                                                                                                             |
|                             | - `results` - [Query Config](#query-config)                             |           |         | Configuration options for results query, used by autocomplete.                                                                                                                                                               |
|                             | - `suggestions` - [Suggestions Query Config](#suggestions-query-config) |           |         | Configuration options for suggestions query, used by autocomplete.                                                                                                                                                           |
| `debug`                     | Boolean                                                                 | optional  | false   | Trace log actions and state changes.                                                                                                                                                                                         |
| `initialState`              | Object                                                                  | optional  |         | Set initial [State](#state) of the search. Any [Request State](#request-state) can be set here. This is useful for defaulting a search term, sort, etc.<br/><br/>Example:<br/>`{ searchTerm: "test", resultsPerPage: 40 }`   |
| `searchQuery`               | [Query Config](#query-config)                                           | optional  | {}      | Configuration options for the main search query.                                                                                                                                                                             |
| `trackUrlState`             | Boolean                                                                 | optional  | true    | By default, [Request State](#request-state) will be synced with the browser url. To turn this off, pass `false`.                                                                                                             |
| `urlPushDebounceLength`     | Integer                                                                 | optional  | 500     | The amount of time in milliseconds to debounce/delay updating the browser url after the UI update. This, for example, prevents excessive history entries while a user is still typing in a live search box.                  |
| `hasA11yNotifications`      | Boolean                                                                 | optional  | false   | Search UI will create a visually hidden live region to announce search results & other actions to screen reader users. This accessibility feature will be turned on by default in our 2.0 release.                           |
| `a11yNotificationMessages`  | Object                                                                  | optional  | {}      | You can override our default screen reader [messages](packages/search-ui/src/A11yNotifications.js#L49) (e.g. for localization), or create your own custom notification, by passing in your own key and message function(s).  |
| `alwaysSearchOnInitialLoad` | Boolean                                                                 | optional  | false   | If true, Search UI will always do an initial search, even when no inital Request State is set.                                                                                                                               |

## Query Config

Query configuration for Search UI largely follows the same API as the [App Search Search API](https://swiftype.com/documentation/app-search/api/search).

For example, if you add a `search_fields` configuration option, it will control which fields are actually returned from the API.

| option                             | type                     | required? | default | description                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------- | ------------------------ | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `facets`                           | Object                   | optional  |         | [App Search Facets API Reference](https://swiftype.com/documentation/app-search/api/search/facets). Tells Search UI to fetch facet data that can be used to build [Facet](#facet) Components. <br /><br />Example, using `states` field for faceting:<br/>`facets: {states: { type: "value", size: 30 }`                                                                                                                       |
| `disjunctiveFacets`                | Array[String]            | optional  |         | An array of field names. Every field listed here must have been configured in the `facets` field first. It denotes that a facet should be considered disjunctive. When returning counts for disjunctive facets, the counts will be returned as if no filter is applied on this field, even if one is applied. <br /><br />Example, specifying `states` field as disjunctive:<br/>`disjunctiveFacets: ['states']`               |
| `disjunctiveFacetsAnalyticsTags`   | Array[String]            | optional  |         | Used in conjunction with the `disjunctiveFacets` parameter. Adding `disjunctiveFacets` can cause additional API requests to be made to your API, which can create deceiving analytics. These queries will be tagged with "Facet-Only" by default. This field lets you specify a different tag for these. <br /><br />Example, use `junk` as a tag on all disjunctive API calls:<br/>`disjunctiveFacetsAnalyticsTags: ['junk']` |
| `conditionalFacets`                | Object[String, function] | optional  |         | This facet will only be fetched if the condition specified returns `true`, based on the currently applied filters. This is useful for creating hierarchical facets.<br/><br/>Example: don't return `states` facet data unless `parks` is a selected filter.<br/> `{ states: filters => isParkSelected(filters) }`                                                                                                              |
| `search_fields`                    | Object[String, Object]   | optional  |         | Fields which should be searched with search term.<br/><br/>[App Search search_fields API Reference](https://swiftype.com/documentation/app-search/api/search/search-fields)                                                                                                                                                                                                                                                    |
| `result_fields`                    | Object[String, Object]   | optional  |         | Fields which should be returned in results.<br/><br/>[App Search result_fields API Reference](https://swiftype.com/documentation/app-search/api/search/result-fields)                                                                                                                                                                                                                                                          |
| \* [Request State](#request-state) |                          | optional  |         | Any request state value can be provided here. If provided, it will ALWAYS override the value from state.                                                                                                                                                                                                                                                                                                                       |

## Suggestions Query Config

Suggestions Query configuration for Search UI largely follows the same API as the [App Search Search API](https://swiftype.com/documentation/app-search/api/query-suggestion).

Ex.

```
{
  "types": {
    "documents": {
      "fields": [
        "title",
        "states"
      ]
    }
  },
  "size": 4
}
```

| option  | type    | required? | source                                                                                       |
| ------- | ------- | --------- | -------------------------------------------------------------------------------------------- |
| `types` | Object  | required  | Object, keyed by "type" of query suggestion, with configuration for that type of suggestion. |
| `size`  | Integer | optional  | Number of suggestions to return.                                                             |

## API Config

Search UI makes all of the search API calls for your application.

You can control what these API calls look like with options such as `search_fields`, `result_fields`, and `facets`.

But there may be cases where certain API operations are not supported by Search UI.

For example, [App Search](https://www.elastic.co/cloud/app-search-service) supports a "grouping" feature, which Search UI does not support out of the box.

We can work around that by using the `beforeSearchCall` hook on the App Search Connector. This acts as a middleware
that gives you an opportunity to modify API requests and responses before they are made.

```js
const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  hostIdentifier: "host-2376rb",
  beforeSearchCall: (existingSearchOptions, next) =>
    next({
      ...existingSearchOptions,
      group: { field: "title" }
    })
});
```

# Build Your Own Component

**Learn about the [Headless Core](#headless-core) concepts first!**

---

We provide a variety of Components out of the box.

There might be cases where we do not have the Component you need.

In this case, we provide a [Higher Order Component](https://reactjs.org/docs/higher-order-components.html)
called [withSearch](./packages/react-search-ui/src/withSearch.js).

It gives you access to work directly with Search UI's [Headless Core](#headless-core).

This lets you create your own Components for Search UI.

Ex. Creating a Component for clearing all filters

```jsx
import React from "react";
import { withSearch } from "@elastic/react-search-ui";

function ClearFilters({ filters, clearFilters }) {
  return (
    <div>
      <button onClick={() => clearFilters()}>
        Clear {filters.length} Filters
      </button>
    </div>
  );
}

export default withSearch(({ filters, clearFilters }) => ({
  filters,
  clearFilters
}))(ClearFilters);
```

Note that `withSearch` accepts a `mapContextToProps` function as the first parameter. Read more about that
in the [mapContextToProps](#mapContextToProps) section.

Also note that all components created with `withSearch` will be Pure Components. Read more
about that [here](#performance).

# Connectors and Handlers

**Learn about the [Headless Core](#headless-core) concepts first!**

---

Search UI exposes a number of event hooks which need handlers to be implemented in order for Search UI
to function properly.

The easiest way to provide handlers for these events is via an out-of-the-box "Connector", which
provides pre-built handlers, which can then be configured for your particular use case.

While we do provide out-of-the-box Connectors, it is also possible to implement these handlers directly,
override Connector methods, or provide "middleware" to Connectors in order to further customize
how Search UI interacts with your services.

#### Event Handlers

| method                      | params                                                                  | return                            | description                                                                                                                                         |
| --------------------------- | ----------------------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onResultClick`             | `props` - Object                                                        |                                   | This method logs a click-through event to your APIs analytics service. This is triggered when a user clicks on a result on a result page.           |
|                             | - `query` - String                                                      |                                   | The query used to generate the current results.                                                                                                     |
|                             | - `documentId` - String                                                 |                                   | The id of the result that a user clicked.                                                                                                           |
|                             | - `requestId` - String                                                  |                                   | A unique id that ties the click to a particular search request.                                                                                     |
|                             | - `tags` - Array[String]                                                |                                   | Tags used for analytics.                                                                                                                            |
| `onSearch`                  | `state` - [Request State](#request-state)                               | [Response State](#response-state) |                                                                                                                                                     |
|                             | `queryConfig` - [Query Config](#query-config)                           |                                   |                                                                                                                                                     |
| `onAutocompleteResultClick` | `props` - Object                                                        |                                   | This method logs a click-through event to your APIs analytics service. This is triggered when a user clicks on a result in an autocomplete dropdown |
|                             | - `query` - String                                                      |                                   | The query used to generate the current results.                                                                                                     |
|                             | - `documentId` - String                                                 |                                   | The id of the result that a user clicked.                                                                                                           |
|                             | - `requestId` - String                                                  |                                   | A unique id that ties the click to a particular search request.                                                                                     |
|                             | - `tags` - Array[String]                                                |                                   | Tags used for analytics.                                                                                                                            |
| `onAutocomplete`            | `state` - [Request State](#request-state)                               | [Response State](#response-state) |                                                                                                                                                     |
|                             | `queryConfig` - Object                                                  |                                   |                                                                                                                                                     |
|                             | - `results` - [Query Config](#query-config)                             |                                   | If this is set, results should be returned for autocomplete.                                                                                        |
|                             | - `suggestions` - [Suggestions Query Config](#suggestions-query-config) |                                   | If this is set, query suggestions should be returned for autocomplete.                                                                              |

### Implementing Handlers without a Connector

If you are using an API for search that there is no Connector for, it is possible to simply provide
handler implementations directly on the `SearchProvider`.

```jsx
<SearchProvider
  config={{
    onSearch: async state => {
      const queryForOtherService = transformSearchUIStateToQuery(state);
      const otherServiceResponse = await callSomeOtherService(
        queryForOtherService
      );
      return transformOtherServiceResponseToSearchUIState(otherServiceResponse);
    }
  }}
/>
```

This makes Search UI useful for services like `elasticsearch` which do not have a Connector
available.

For a thorough example of this, see the demo in [examples/elasticsearch](examples/elasticsearch/README.md)

### Overriding Connector Handlers

Explicitly providing a Handler will override the Handler provided by the Connector.

```jsx
<SearchProvider
  config={{
    apiConnector: connector,
    onSearch: async (state, queryConfig) => {
      const queryForOtherService = transformSearchUIStateToQuery(
        state,
        queryConfig
      );
      const otherServiceResponse = await callSomeOtherService(
        queryForOtherService
      );
      return transformOtherServiceResponseToSearchUIState(otherServiceResponse);
    }
  }}
/>
```

### Using middleware in Connector Handlers

Handler implementations can also be used as middleware for Connectors by leveraging
the `next` function.

```jsx
<SearchProvider
  config={{
    apiConnector: connector,
    onSearch: (state, queryConfig, next) => {
      const updatedState = someStateTransformation(state);
      return next(updatedState, queryConfig);
    }
  }}
/>
```

### Build your own Connector

An example of a connector is the [Site Search API Connector](./packages/search-ui-site-search-connector/README.md).

A connector simply needs to implement the Event Handlers listed above. The handlers typically:

1. Convert the current [Request State](#request-state) and [Query Config](#query-config) into the search semantics of
   your particular Search API.
2. Convert the response from your particular Search API into [Response State](#response-state).

While some handlers are meant for fetching data and performing searches, other handlers are meant for recording
certain user events in analytics services, such as `onResultClick` or `onAutocompleteResultClick`.

#### Errors

For error handling, a method must throw any error with a "message" field populated for any unrecoverable error. This
includes things like 404s, 500s, etc.

# Performance

This library is optimized to avoid full sub-tree re-rendering, and so that components only re-render when state changes
that are relevant to those particular components occur.

In order to accomplish this, all components within
this library are "Pure Components". You can read more about the concept and potential pitfalls
of Pure Components in the React
[Optimizing Performance](https://reactjs.org/docs/optimizing-performance.html#avoid-reconciliation) guide.

The thing to be most cautious of is not to
[mutate state](https://reactjs.org/docs/optimizing-performance.html#the-power-of-not-mutating-data) that you will
pass as props to any of these components.

Example of what not to do:

```jsx
class SomeComponent extends React.Component {
  changeSorting = () => {
    const { options } = this.state;
    // Mutating an existing array in state rather than creating a new one is bad. Since Sorting component is "Pure"
    // it won't update after calling `setState` here.
    options.push("newOption");
    this.setState({ options });
  };

  render() {
    const { options } = this.state;
    return <Sorting options={options} />;
  }
}
```

Instead, do:

```jsx
// Create a new options array and copy the old values into that new array.
this.setState(prevState => ({ options: [...prevState.options, "newOption"] }));
```

If you ever need to debug performance related issues, see the instructions in the Optimizing Performance guide for
enabling the "Highlight Updates" feature in the
[React Developer tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi).

# Debugging

There is a `debug` flag available on the configuration for `SearchDriver` and `SearchProvider`.

```jsx
<SearchProvider config={
  debug: true
  //...
}>
```

Setting this to `true` will make the `searchUI` object available globally on window. This will allow you to
programmatically execute actions in the browser console which can be helpful for debugging.

```js
window.searchUI.addFilter("states", "California", "all");
```

This will also log actions and state updates as they occur to the console in the following form:

```
Search UI: Action {Action Name} {Action Parameters}
Search UI: State Update {State to update} {Full State after update}
```
