# Contents

1. [Headless Core](#headless-core)
2. [Component Reference](#component-reference)
3. [Customization](#customization)
4. [Advanced Configuration](#advanced-configuration)
5. [Build Your Own Component](#build-your-own-component)
6. [Build Your Own Connector](#build-your-own-connector)
7. [Search UI Contributor's Guide](#search-ui-contributors-guide)

# Headless Core

- [Headless Core Concepts](#headless-core-concepts)
- [Headless Core Application](#headless-core-application)

## Headless Core Concepts

The core is a separate library which can be used for any JavaScript based implementation.

> [The Search UI Core](https://github.com/elastic/search-ui/tree/master/packages/search-ui).

All of the components in this library use the headless core under the hood.

You can work directly with the core if you need more than the Components offer.

The Headless Core is managed by the `SearchProvider`, which provides a **"Context"**.

A **"Context"** is comprised of **"State"** and **"Actions"**:

- SearchProvider: The top-level Component which manages the core and exposes the Context to your application.
- Context: A flattened object containing, as keys, all State and Actions.
- State: The current state of your application. Current search terms, filters, etc.
- Actions: Functions that let you update the State: setSearchTerm, applyFilter, and so on.

It looks like this:

```jsx
<SearchProvider config={config}>
  {/*SearchProvider exposes the "Context"*/}
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
</SearchProvider>
```

If you are familiar with Redux or [formik](https://github.com/jaredpalmer/formik), it's the same State and Actions pattern.

All the default Components work with the Context directly. This means there are plenty of good examples in the source code!

### SearchProvider

The `SearchProvider` is a top-level Component which is essentially a wrapper around the core.

It exposes the [State](#state) and [Actions](#actions) of the core in a [Context](#context).

Params:

| name     | type     | description                                                                                                         |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| config   | Object   | See the [Configuration Options](#config) section.                                                                   |
| children | function | A render prop function that accepts the [Context](#context) as a parameter. <br/><br/>`(context) => return <div />` |

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

| method              | params                                                                                                                                                                                                                                                                                                                                                                                                                                                           | return | description                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| `addFilter`         | `name` String - field name to filter on<br/>`value` String - field value to filter on                                                                                                                                                                                                                                                                                                                                                                            |        | Add a filter in addition to current filters values.                        |
| `setFilter`         | `name` String - field name to filter on<br/>`value` String - field value to filter on                                                                                                                                                                                                                                                                                                                                                                            |        | Set a filter value, replacing current filter values.                       |
| `removeFilter`      | `name` String - field name to filter on<br/>`value` String - field value to filter on                                                                                                                                                                                                                                                                                                                                                                            |        | Remove a single filter value.                                              |
| `reset`             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |        | Reset state to initial search state.                                       |
| `clearFilters`      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |        | Clear all filters.                                                         |
| `setCurrent`        | Integer                                                                                                                                                                                                                                                                                                                                                                                                                                                          |        | Update the current page number. Used for paging.                           |
| `setResultsPerPage` | Integer                                                                                                                                                                                                                                                                                                                                                                                                                                                          |        |                                                                            |
| `setSearchTerm`     | `searchTerm` String<br/> `options` Object<br/>`options.refresh` Boolean - Refresh search results on update. Default: `true`.<br/>`options.debounce` Number - Length to debounce any resulting queries<br/>`options.autocompleteSuggestions` Boolean - Fetch query suggestions for autocomplete on update, stored in `autocompletedSuggestions` state<br/>`options.autocompleteResults` Boolean - Fetch results on update, stored in `autocompletedResults` state |        |                                                                            |
| `setSort`           | `sortField` String - field to sort on<br/>`sortDirection` String - "asc" or "desc"                                                                                                                                                                                                                                                                                                                                                                               |        |                                                                            |
| `trackClickThrough` | `documentId` String - The document ID associated with the result that was clicked<br/>`tag` - Array[String] Optional tags which can be used to categorize this click event                                                                                                                                                                                                                                                                                       |        | Report a clickthrough event, which is when a user clicks on a result link. |

### State

State can be divided up into two types.

1. Request State - Reflects the state of the most recent request.
2. Result State - Result State is updated AFTER a response is received.
3. Application State - The general state.

For this reason, there are often multiple versions of state. For instance, `searchTerm` and `resultSearchTerm`. This can be relevant in the UI, where you might not want the search term on the page to change until AFTER a response is received, so you'd use the `resultSearchTerm` state.

#### Request State

Reflects the state of the most recent request.

It is updated at the time a request is made.

Request state can be set by:

- Using actions, set `setSearchTerm`
- The `initialState` option.
- The URL query string, if `trackUrlState` is enabled.

| option           | type                                   | required? | source                                 |
| ---------------- | -------------------------------------- | --------- | -------------------------------------- |
| `current`        | Integer                                | optional  | Current page number                    |
| `filters`        | Array[[Filter](./src/types/Filter.js)] | optional  |                                        |
| `resultsPerPage` | Integer                                | optional  | Number of results to show on each page |
| `searchTerm`     | String                                 | optional  | Search terms to search for             |
| `sortDirection`  | String ["asc" \| "desc"]               | optional  | Direction to sort                      |
| `sortField`      | String                                 | optional  | Name of field to sort on               |

#### Response State

Response State is updated AFTER an API response is received.

It is not directly update-able.

It is updated indirectly by invoking an action which results in a new API request.

| field                               | type                                                                                                                                      | description                                                                                                                                                                                                                                                               |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autocompletedResults`              | Array[[Result](https://github.com/elastic/search-ui/blob/master/packages/react-search-ui/src/types/Result.js)]                            | An array of results items fetched for an autocomplete dropdown.                                                                                                                                                                                                           |
| `autocompletedResultsRequestId`     | String                                                                                                                                    | A unique ID for the current autocompleted search results                                                                                                                                                                                                                  |
| `autocompletedSuggestions`          | Object[String, Array[[Suggestion](<(https://github.com/elastic/search-ui/blob/master/packages/react-search-ui/src/types/Suggestion.js)>)] | A keyed object of query suggestions. It's keyed by type since multiple types of query suggestions can be set here.                                                                                                                                                        |
| `autocompletedSuggestionsRequestId` | String                                                                                                                                    | A unique ID for the current autocompleted suggestion results                                                                                                                                                                                                              |
| `facets`                            | Object[[Facet](https://github.com/elastic/search-ui/blob/master/packages/react-search-ui/src/types/Facet.js)]                             | Will be populated if `facets` configured in [Advanced Configuration](#advanced-configuration)                                                                                                                                                                             |
| `requestId`                         | String                                                                                                                                    | A unique ID for the current search results                                                                                                                                                                                                                                |
| `results`                           | Array[[Result](https://github.com/elastic/search-ui/blob/master/packages/react-search-ui/src/types/Result.js)]                            | An array of result items                                                                                                                                                                                                                                                  |
| `resultSearchTerm`                  | String                                                                                                                                    | As opposed the the `searchTerm` state, which is tied to the current search parameter, this is tied to the searchTerm for the current results. There will be a period of time in between when a request is started and finishes where the two pieces of state will differ. |
| `totalResults`                      | Integer                                                                                                                                   | Total number of results found for the current query                                                                                                                                                                                                                       |

#### Application State

Application state is the general application state.

| field         | type    | description                                                                                                        |
| ------------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| `error`       | String  | Error message, if an error was thrown                                                                              |
| `isLoading`   | boolean | Whether or not a search is currently being performed                                                               |
| `wasSearched` | boolean | Has any query been performed since this driver was created? Can be useful for displaying initial states in the UI. |

## Headless Core Application

If you wish to work with Search UI outside of a particular Component, you'll work
directly with the core.

There's 3 ways you can do this:

### 1. The Render Prop on SearchProvider

When you configure `SearchProvider`, you need to provide a function as the child of the provider.

That function is actually a [Render Prop](https://reactjs.org/docs/render-props.html) that exposes the Context for you to work with.

A good use case for that could be to render a "loading" indicator any time the application is fetching data.

For example:

```jsx
<SearchProvider config={config}>
  {{isLoading} => (
    <div className="App">
      {isLoading && <div>I'm loading now</div>}
      {!isLoading && <Layout
        header={<SearchBox />}
        bodyContent={<Results titleField="title" urlField="nps_link" />}
      />}
    </div>
  )}
</SearchProvider>
```

You could also use it to add a clear filters button:

```jsx
<SearchProvider config={config}>
  {({ isLoading, clearFilters }) => (
    <div className="App">
      {isLoading && <div>I'm loading now</div>}
      {!isLoading && (
        <Layout
          header={
            <div>
              <SearchBox />
              <button onClick={clearFilters}>Clear</button>
            </div>
          }
          bodyContent={<Results titleField="title" urlField="nps_link" />}
        />
      )}
    </div>
  )}
</SearchProvider>
```

### 2. `withSearch`

This is typically used for creating your own Components.

See [Build Your Own Component](#build-your-own-component).

### 3. With `SearchConsumer`

If you prefer a [Render Props](https://reactjs.org/docs/render-props.html) approach rather than
the [Higher Order Components](https://reactjs.org/docs/higher-order-components.html) approach of `withSearch`, you can use `SearchConsumer`.

```jsx
import { SearchConsumer } from "@elastic/react-search-ui";
```

```jsx
<SearchConsumer>
  {{ isLoading } => (
    <div>isLoading</div>
  )}
</SearchConsumer>
```

# Component Reference

The following Components are available:

- [SearchBox](#searchbox)
- [Results](#results)
- [ResultsPerPage](#resultsperpage)
- [Facet](#facet)
- [Sorting](#sorting)
- [Paging](#paging)
- [PagingInfo](#paginginfo)
- [ErrorBoundary](#errorboundary)

## SearchBox

Input element which accepts search terms and triggers a new search.

### Example

```jsx

import { SearchBox } from "@elastic/react-search-ui";

...

<SearchBox inputProps={{ placeholder: "custom placeholder" }}/>
```

### Example using Autocompleted Results

```jsx

import { SearchBox } from "@elastic/react-search-ui";

...

<SearchBox
  autocompleteResults={{
    titleField: "title",
    urlField: "nps_link"
  }}
/>
```

### Example using Autocompleted Suggestions

```jsx

import { SearchBox } from "@elastic/react-search-ui";

...

<SearchBox
  autocompleteSuggestions={true}
/>
```

### Example using multiple types of Autocompleted Suggestions

```jsx

import { SearchBox } from "@elastic/react-search-ui";

...

<SearchBox
  autocompleteSuggestions={{
    documents: {
      sectionTitle: "Suggested Queries"
    },
    popular_queries: {
      sectionTitle: "Popular Queries"
    }
  }}
/>
```

### Example using Autocompleted Suggestions and Autocompleted Results

```jsx

import { SearchBox } from "@elastic/react-search-ui";

...

<SearchBox
  autocompleteMinimumCharacters={3}
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

### Properties

| Name                          | type                                                                         | Required? | Default                                                            | Options | Description                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| inputProps                    | Object                                                                       | no        |                                                                    |         | Props for underlying 'input' element. I.e., `{ placeholder: "Enter Text"}`                                                                                                                                                                                                                                                                                   |
| searchAsYouType               | Boolean                                                                      | no        | false                                                              |         | Executes a new search query with every key stroke. You can fine tune the number of queries made by adjusting the `debounceLength` parameter.                                                                                                                                                                                                                 |
| debounceLength                | Number                                                                       | no        | 200                                                                |         | When using `searchAsYouType`, it can be useful to "debounce" search requests to avoid creating an excessive number of requests. This controls the length to debounce / wait.                                                                                                                                                                                 |
| view                          | Component                                                                    | no        | [SearchBox](packages/react-search-ui-views/src/SearchBox.js)       |         | Used to override the default view for this Component. See the [Customization: Component views and HTML](#component-views-and-html) section for more information.                                                                                                                                                                                             |
| autocompleteResults           | Boolean or [AutocompleteResultsOptions](#AutocompleteResultsOptions)         | Object    | no                                                                 |         | Configure and autocomplete search results. Boolean option is primarily available for implementing custom views.                                                                                                                                                                                                                                              |
| autocompleteSuggestions       | Boolean or [AutocompleteSuggestionsOptions](#AutocompleteSuggestionsOptions) | Object    | no                                                                 |         | Configure and autocomplete query suggestions. Boolean option is primarily available for implementing custom views. Configuration may or may not be keyed by "Suggestion Type", as APIs for suggestions may support may than 1 type of suggestion. If it is not keyed by Suggestion Type, then the configuration will be applied to the first type available. |
| autocompleteMinimumCharacters | Integer                                                                      | no        | 0                                                                  |         | Minimum number of characters before autocompleting.                                                                                                                                                                                                                                                                                                          |
| autocompleteView              | Render Function                                                              | no        | [Autocomplete](packages/react-search-ui-views/src/Autocomplete.js) |         | Provide a different view just for the autocomplete dropdown.                                                                                                                                                                                                                                                                                                 |
| onSelectAutocomplete          | Function(selection. options, defaultOnSelectAutocomplete)                    | no        |                                                                    |         | Allows overriding behavior when selected, to avoid creating an entirely new view. In addition to the current `selection`, various helpers are passed as `options` to the second parameter. This third parameter is the default `onSelectAutocomplete`, which allows you to defer to the original behavior.                                                   |

#### AutocompleteResultsOptions

| Name                    | type          | Required? | Default | Options | Description                                              |
| ----------------------- | ------------- | --------- | ------- | ------- | -------------------------------------------------------- |
| linkTarget              | String        | no        | \_self  |         | Used to open links in a new tab                          |
| sectionTitle            | String        | no        |         |         | Title to show in section within dropdown                 |
| shouldTrackClickThrough | Boolean       | no        | true    |         | Only applies to Results, not Suggestions                 |
| clickThroughTags        | Array[String] | no        |         |         | Tags to send to analytics API when tracking clickthrough |
| titleField              | String        | yes       |         |         | Field within a Result to use as the "title"              |
| urlField                | String        | yes       |         |         | Field within a Result to use for linking                 |

#### AutocompleteSuggestionsOptions

| Name         | type   | Required? | Default | Options | Description                              |
| ------------ | ------ | --------- | ------- | ------- | ---------------------------------------- |
| sectionTitle | String | no        |         |         | Title to show in section within dropdown |

---

## Results

Displays all search results.

You can also iterate over the results yourself and render each result.

### Example

```jsx

import { Results } from "@elastic/react-search-ui";

...

<Results titleField="title" urlField="nps_link" />
```

### Properties

| Name         | type      | Required? | Default                                                  | Options | Description                                                                                                                                          |
| ------------ | --------- | --------- | -------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| renderResult | Component | no        | [Result](packages/react-search-ui-views/src/Result.js)   |         | Used to override individual Result views. See the Customizing Component views and html section for more information.                                 |
| titleField   | String    | no        |                                                          |         | Name of field to use as the title from each result.                                                                                                  |
| urlField     | String    | no        |                                                          |         | Name of field to use as the href from each result.                                                                                                   |
| view         | Component | no        | [Results](packages/react-search-ui-views/src/Results.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

---

## ResultsPerPage

Shows a dropdown for selecting the number of results to show per page.

Uses 20, 40, 60 as options.

### Example

```jsx

import { ResultsPerPage } from "@elastic/react-search-ui";

...

<ResultsPerPage />
```

### Properties

| Name | type      | Required? | Default                                                                | Options | Description                                                                                                                                          |
| ---- | --------- | --------- | ---------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| view | Component | no        | [ResultsPerPage](packages/react-search-ui-views/src/ResultsPerPage.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

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

### Properties

| Name  | type      | Required? | Default                                                                        | Options                                                                                                                                                       | Description                                                                                                                                          |
| ----- | --------- | --------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| field | String    | yes       |                                                                                |                                                                                                                                                               | Field name corresponding to this filter. This requires that the corresponding field has been configured in `facets` on the top level Provider.       |
| label | String    | yes       |                                                                                |                                                                                                                                                               | A static label to show in the facet filter.                                                                                                          |
| show  | Number    | no        | 10                                                                             |                                                                                                                                                               | The number of facet filter options to show before concatenating with a "more" link.                                                                  |
| view  | Component | no        | [MultiCheckboxFacet](packages/react-search-ui-views/src/MultiCheckboxFacet.js) | [SingleLinksFacet](packages/react-search-ui-views/src/SingleLinksFacet.js) <br/> [SingleSelectFacet](packages/react-search-ui-views/src/SingleSelectFacet.js) | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

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

| Name | type                                                                  | Required? | Default                                                  | Options | Description                                                                                                                                          |
| ---- | --------------------------------------------------------------------- | --------- | -------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| view | Array[[SortOption](packages/react-search-ui/src/types/SortOption.js)] | yes       |                                                          |         |                                                                                                                                                      |
| view | Component                                                             | no        | [Sorting](packages/react-search-ui-views/src/Sorting.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

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

| Name | type      | Required? | Default                                                | Options | Description                                                                                                                                          |
| ---- | --------- | --------- | ------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| view | Component | no        | [Paging](packages/react-search-ui-views/src/Paging.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

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

| Name | type      | Required? | Default                                                        | Options | Description                                                                                                                                          |
| ---- | --------- | --------- | -------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| view | Component | no        | [PagingInfo](packages/react-search-ui-views/src/PagingInfo.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

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

| Name     | type       | Required? | Default                                                              | Options | Description                                                                                                                                          |
| -------- | ---------- | --------- | -------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| children | React node | yes       |                                                                      |         | Content to show if no error has occurred, will be replaced with error messaging if there was an error.                                               |
| view     | Component  | no        | [ErrorBoundary](packages/react-search-ui-views/src/ErrorBoundary.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

# Customization

- [Custom Styles and Layout](#custom-styles-and-layout)
- [Component Views and HTML](#component-views-and-html)
- [Component Behaviour](#component-behaviour)

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

All Components support two hooks for customizing their behavior.

1. `mapContextToProps` - Override the Context before it is passed to your Component as
   props.
2. `mapViewProps` - Lets you overrides view props before they are passed to the view.

These allow you to override, modify, or even add completely new props.

- These follow the same patterns as `mapStateToProps` in [Redux](https://redux.js.org/).
- These **MUST** be immutable functions, if you directly update the props or context, you will have major issues in your application.

To visualize these hooks:

```
Search UI
  |
  | { searchTerm, setSearchTerm } <- This is the "Context"
  v
  // Updates the searchTerm before passing it to the SearchBox Component
  mapContextToProps( context => { ...context, searchTerm: "new search terms" } )
  |
  |
  v
SearchBox
  |
  | { isFocused, inputProps, onChange, onSubmit, value } <- View props
  v
  // Modify the onChange handler so that it logs events.
  mapViewProps( props => { ...props, onChange: e => { console.log(e); onChange(e) } })
  |
  |
  v
view (SearchBox or custom view)
```

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
  }
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

| option              | type                                                                    | required? | default | description                                                                                                                                                                                                                                              |
| ------------------- | ----------------------------------------------------------------------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiConnector`      | APIConnector                                                            | required  |         | Instance of a Connector. For instance, [search-ui-app-search-connector](packages/search-ui-app-search-connector).                                                                                                                                        |
| `autocompleteQuery` | Object                                                                  | optional  |         | Configuration options for the main search query.                                                                                                                                                                                                         |
|                     | - `results` - [Query Config](#query-config)                             |           |         | Configuration options for results query, used by autocomplete.                                                                                                                                                                                           |
|                     | - `suggestions` - [Suggestions Query Config](#suggestions-query-config) |           |         | Configuration options for suggestions query, used by autocomplete.                                                                                                                                                                                       |
| `debug`             | Boolean                                                                 | optional  | false   | Trace log actions and state changes.                                                                                                                                                                                                                     |
| `initialState`      | Object                                                                  | optional  |         | Set initial [State](#headless-core#state) of the search. Any [Request State](#headless-core#1-request-state) can be set here. This is useful for defaulting a search term, sort, etc.<br/><br/>Example:<br/>`{ searchTerm: "test", resultsPerPage: 40 }` |
| `searchQuery`       | [Query Config](#query-config)                                           | optional  |         | Configuration options for the main search query.                                                                                                                                                                                                         |
| `trackURLState`     | boolean                                                                 | optional  |         | By default, [Request State](#headless-core#1-request-state) will be synced with the browser url. To turn this off, pass `false`.                                                                                                                         |

## Query Config

Query configuration for Search UI largely follows the same API as the [App Search Search API](https://swiftype.com/documentation/app-search/api/search).

For example, if you add a `search_fields` configuration option, it will control which fields are actually returned from the API.

| option                             | type                     | required? | default | description                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------- | ------------------------ | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `facets`                           | Object                   | optional  |         | [App Search Facets API Reference](https://swiftype.com/documentation/app-search/api/search/facets). Tells Search UI to fetch facet data that can be used to build [Facet](#componentfacet) Components. <br /><br />Example, using `states` field for faceting:<br/>`facets: {states: { type: "value", size: 30 }`                                                                                                              |
| `disjunctiveFacets`                | Array[String]            | optional  |         | An array of field names. Every field listed here must have been configured in the `facets` field first. It denotes that a facet should be considered disjunctive. When returning counts for disjunctive facets, the counts will be returned as if no filter is applied on this field, even if one is applied. <br /><br />Example, specifying `states` field as disjunctive:<br/>`disjunctiveFacets: ['states']`               |
| `disjunctiveFacetsAnalyticsTags`   | Array[String]            | optional  |         | Used in conjunction with the `disjunctiveFacets` parameter. Adding `disjunctiveFacets` can cause additional API requests to be made to your API, which can create deceiving analytics. These queries will be tagged with "Facet-Only" by default. This field lets you specify a different tag for these. <br /><br />Example, use `junk` as a tag on all disjunctive API calls:<br/>`disjunctiveFacetsAnalyticsTags: ['junk']` |
| `conditionalFacets`                | Object[String, function] | optional  |         | This facet will only be fetched if the condition specified returns `true`, based on the currently applied filters. This is useful for creating hierarchical facets.<br/><br/>Example: don't return `states` facet data unless `parks` is a selected filter.<br/> `{ states: filters => isParkSelected(filters) }`                                                                                                              |
| `search_fields`                    | Object[String, Object]   | optional  |         | Fields which should be searched with search term.<br/><br/>[App Search search_fields API Reference](https://swiftype.com/documentation/app-search/api/search/search-fields)                                                                                                                                                                                                                                                    |
| `result_fields`                    | Object[String, Object]   | optional  |         | Fields which should be returned in results.<br/><br/>[App Search result_fields API Reference](https://swiftype.com/documentation/app-search/api/search/result-fields)                                                                                                                                                                                                                                                          |
| \* [Request State](#request_state) |                          | optional  |         | Any request state value can be provided here. If provided, it will ALWAYS override the value from state.                                                                                                                                                                                                                                                                                                                       |

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

We can work around that by using the `additionalOptions` hook on the particular Connector.

```js
const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  hostIdentifier: "host-2376rb",
  additionalOptions: existingSearchOptions => {
    const additionalSearchOptions = {
      group: { field: "title" }
    };
    return additionalSearchOptions;
  }
});
```

# Build Your Own Component

**Learn about the [Headless Core](#headless-core) concepts first!**

---

We provide a variety of Components out of the box.

There might be cases where we do not have the Component you need.

In this case, we provide a [Higher Order Component](https://reactjs.org/docs/higher-order-components.html)
called [withSearch](./src/withSearch.js).

It gives you access to work directly with Search UI's [Context](#headless-core#headless-core-concepts).

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

export default withSearch(ClearFilters);
```

## Build Your Own Connector

**Learn about the [Headless Core](#headless-core) concepts first!**

---

While we do provide out-of-the-box Connectors, it is also possible to create
your own Connector if you don't see your service in the list above. Connectors
just need to implement a common interface that Search UI understands.

An example of this is the [Site Search API Connector](../search-ui-site-search-connector/README.md).

What you're effectively doing here is two things:

1. Converting the current [Request State](#request-state) and [Query Config](#query-config) into the search semantics of
   your particular Search API.
2. Converting the response from your particular Search API into [Response State](#response-state).

<a id="connectorconfig"></a>

#### Configuration

Each Connector will need to be instantiated with its own set of properties. The only properties that Connectors
need to have in common is an `additionalOptions` parameter.

| option              | type             | required? | source                                                                                                                                                                        |
| ------------------- | ---------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `additionalOptions` | Function(Object) | optional  | A hook that allows you to inject additional, API specific configuration. More information can be found in the [Customizing API calls - additionalOptions](#apicalls) section. |

<a id="connectormethods"></a>

#### Methods

| method              | params                                                                  | return                            | description                                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `click`             | `props` - Object                                                        |                                   | This method logs a click-through event to your APIs analytics service. This is triggered when a user clicks on a result on a result page.           |
|                     | - `documentId` - String                                                 |                                   | The id of the result that a user clicked.                                                                                                           |
|                     | - `requestId` - String                                                  |                                   | A unique id that ties the click to a particular search request.                                                                                     |
|                     | - `tags` - Array[String]                                                |                                   | Tags used for analytics.                                                                                                                            |
| `search`            | `state` - [Request State](#request-state)                               | [Response State](#response-state) |                                                                                                                                                     |
|                     | `queryConfig` - [Query Config](#query-config)                           |                                   |                                                                                                                                                     |
| `autocompleteClick` | `props` - Object                                                        |                                   | This method logs a click-through event to your APIs analytics service. This is triggered when a user clicks on a result in an autocomplete dropdown |
|                     | - `documentId` - String                                                 |                                   | The id of the result that a user clicked.                                                                                                           |
|                     | - `requestId` - String                                                  |                                   | A unique id that ties the click to a particular search request.                                                                                     |
|                     | - `tags` - Array[String]                                                |                                   | Tags used for analytics.                                                                                                                            |
| `autocomplete`      | `state` - [Request State](#request-state)                               | [Response State](#response-state) |                                                                                                                                                     |
|                     | `queryConfig` - Object                                                  |                                   |                                                                                                                                                     |
|                     | - `results` - [Query Config](#query-config)                             |                                   | If this is set, results should be returned for autocomplete.                                                                                        |
|                     | - `suggestions` - [Suggestions Query Config](#suggestions-query-config) |                                   | If this is set, query suggestions should be returned for autocomplete.                                                                              |

#### Errors

For error handling, a method must throw any error with a "message" field populated for any unrecoverable error. This
includes things like 404s, 500s, etc.

# Search UI Contributor's Guide

How to build and contribute to Search UI.

### Requirements

Node: 8.10
NPM: 6.4

### Mono-repo explanation

This repository is maintained as a Monorepo using [Lerna](https://lernajs.io/).

Lerna configuration is contained in `lerna.json`.

- `/packages` - Contains publishable search-ui npm packages.
- `/examples` - Contains non-publishable examples of search-ui usage. They are declared
  as "packages" in `lerna.json` so that `npx lerna bootstrap` will automatically wire up the
  examples to local dependencies.

Because all examples are declared as "private", when running lerna commands other than bootstrap, (like `publish` and `test`), the `--no-private` flag should be appended.

Dependencies are declared in a package.json hierarchy.

- `/package.json` - Dependencies for repo tooling, like `husky` and `lerna`.
- `/packages/package.json` - Common dev dependencies for all Search UI npm packages. Any dev Common dev dependencies for al that does not need to be called directly in a package level npm command
  can be declared here.
- /`packages/{package_name}/package.json` - Package specific dependencies.

Note that we do not encourage "hoisting" dependencies through lerna. This WILL
cause the examples applications to error out from dependency version conflicts.

### Building

For all projects, run from project root. For single project, run from
package root.

```shell
# Build
npm run build

# Watch for changes and re-build
npm run watch
```

### Testing

For all projects, run from project root. For single project, run from
package root.

All packages:

```shell
# from project root
npm run test
```

### Sandbox

The [sandbox](examples/sandbox/README.md) app can be used as a local development aid.

### Publishing

Always publish from a version branch, do not publish from master.

Publish new version
(Example, publish 0.6.0)

1. Create new version branch `git checkout -b v0.6`.
2. Run `npx lerna changed` to see which projects will be published.
3. Update `CHANGELOG` files to include version `v0.6.0` for the projects that will be published.
   NOTE: Lerna does NOT update `package-lock.json` file, so at this point you'll have
   to manually edit the `package-lock.json` for each updated package to update
   `0.5.0` to `0.6.0` at the top of the file.
4. Run `npx lerna version 0.6.0 --exact`.
5. Verify correct tags and commits have been created.
6. Run `npx lerna publish from-git`.
7. Verify `0.6.0` has been published to npm.
8. PR these release changes back into master.
9. Create release in Github.

Publish patch version
(Example, publish 0.6.1)

1. PR changes into `v0.6` branch.
2. Run `npx lerna changed` to see which projects will be published.
3. Update `CHANGELOG` files to include version `0.6.1` for the projects that will be published.
   NOTE: Lerna does NOT update `package-lock.json` file, so at this point you'll have
   to manually edit the `package-lock.json` for each updated package to update
   `0.6.0` to `0.6.1` at the top of the file.
4. Run `npx lerna version 0.6.1 --exact`.
5. Verify correct tags and commits have been created.
6. Run `npx lerna publish from-git`.
7. Verify `0.6.1` has been published to npm.
8. Make sure changed are also committed back to master.
9. Create release in Github.
