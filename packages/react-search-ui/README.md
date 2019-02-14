# Search UI: React Framework

**NOTE: This library is in an early Beta period, it is not yet recommended for production use**

Most search experiences follow similar patterns; search box, search results, paging, sorting, filters, url state, etc.
Search UI gives you a means of quickly implementing these patterns without re-inventing the wheel.

<img src="./resources/screenshot.png" width="600">

We understand that no two experiences are exactly the same. Because of this, we aim to provide a toolset that is
flexible enough to meet any demand, be it a completely out-of-the-box experience or a completely custom UI.

## Features

- **Out-of-the-box Components** - Create a UI in just a few lines of code.
- **Highly customizable** - Customize Component markup, styles, and behavior.
- **Headless Core** - Leverage our application logic and provide your own Components or view.
- **URL query string synchronization** - Searches, filtering, paging, etc. is all captured in the URL, which enables direct linking to results.
- **Compatible with any API** - Can be used with any web-based Search API,
  with pre-built Connectors for [Elastic Site Search](https://www.elastic.co/cloud/site-search-service) and [Elastic App Search](https://www.elastic.co/cloud/app-search-service).
- **Not just for React** - Underlying library, [search-ui](../search-ui/README.md), can be used used with any JavaScript library, or even vanilla
  JavaScript.

<a id="nav"></a>

## In this README

- [Basic Usage](#basic)
  - [Install](#install)
  - [Creating a simple UI](#simple-ui)
  - [Connectors](#connectors)
  - [SearchProvider](#basicsearchprovider)
  - [Styles and Layout](#layoutandstyles)
  - [Components](#components)
- [Advanced Usage](#advanced)
  - [The Headless Core](#core)
    - [SearchProvider](#advancedsearchprovider)
    - [Context](#context)
    - [Actions](#actions)
    - [State](#state)
  - [Configuring Search UI](#searchuiconfig)
    - [Configuration Options](#config)
  - [Customizing Styles and Layout](#ownlayoutandstyles)
  - [Customizing Component views and html](#customizeviews)
  - [Customizing Component behavior - mapContextToProps and mapViewProps](#customizebehavior)
  - [Working with Search UI outside of Components](#directsearchui)
  - [Creating your own Components](#customcomponents)
  - [Customizing API calls - additionalOptions](#apicalls)
  - [Creating your own Connector](#buildaconnector)

<a id="basic"></a>

## Basic Usage

[back](#nav)

<a id="install"></a>

### Install

[back](#nav)

```sh
# Install React Search UI
npm install --save @elastic/react-search-ui

# Install a Connector, like the Elastic's App Search Connector
npm install --save  @elastic/search-ui-app-search-connector
```

<a id="simple-ui"></a>

### Creating a simple UI

[back](#nav)

Search UI can be used to create experiences very quickly. Especially if you use the out-of-the-box
styles and layout. The following is a basic UI for an App Search engine.

```jsx
import React from "react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import { SearchProvider, Results, SearchBox } from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";

import "@elastic/react-search-ui-views/lib/styles/styles.css";

const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  hostIdentifier: "host-2376rb"
});

export default function App() {
  return (
    <SearchProvider
      config={{
        apiConnector: connector
      }}
    >
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
}
```

The following sections of the Basic Usage guide break down that
example into pieces and explore each piece in a bit more depth.

<a id="connectors"></a>

### Connectors

[back](#nav)

Search UI will handle making API calls for you. "Connectors" are modules
that tell Search UI how to connect and communicate with a particular API.

Search UI currently provides the following two Connectors:

- Elastic App Search: [search-ui-app-search-connector](packages/search-ui-app-search-connector)
- Elastic Site Search: [search-ui-site-search-connector](packages/search-ui-site-search-connector)

Our [simple UI](#simple-ui) above uses the Elastic App Search Connector:

```js
const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  hostIdentifier: "host-2376rb"
});
```

In addition to our out-of-the-box Connectors, Search UI can be
used to connect to any web-based Search API. Check out the [Creating your own Connector](#buildaconnector) section of the Advanced Usage guide for more information.

<a id="basicsearchprovider"></a>

### SearchProvider

[back](#nav)

As you'll see in the [Components](#components) section, Search UI provides an extensive library of
Components which you can use to build a search experience.
However, before you can start dropping in those Components, you'll first need to create a `SearchProvider`.

`SearchProvider` will tie all of your Components together so that they
work as a cohesive application. As users take actions using your Components,
like submitting a search box or applying a filter, `SearchProvider` will then
trigger API calls via the Connector you've configured to fetch Search Results.

The flow looks roughly like this:

```
Components -> SearchProvider -> Connector -> API
```

Example:

```jsx
<SearchProvider
  config={{
    apiConnector: connector
  }}
>
  {() => <div className="App">{/* Place Components here! */}</div>}
</SearchProvider>
```

For more details on `SearchProvider`, see the [SearchProvider](#advancedsearchprovider) section of the
Advanced Usage guide.

<a id="layoutandstyles"></a>

### Styles and Layout

[back](#nav)

Using the provided styles and layout can be a super effective way to get up and running fast,
as you can see in our [simple UI](#simple-ui) above.

The provided styles and layout can be found in the [react-search-ui-views](../react-search-ui-views)
package.

For basic styles, simply include:

```jsx
import "@elastic/react-search-ui-views/lib/styles/styles.css";
```

<a id="layoutcomponent"></a>

For a basic layout, which often helps quickly get a UI bootstrapped,
use the [Layout](../react-search-ui-views/src/layouts/Layout.js) Component.

```jsx
import { Layout } from "@elastic/react-search-ui-views";

<Layout header={<SearchBox />} bodyContent={<Results />} />;
```

For more information on customizing styles, see the [Customizing Styles and Layout](#ownlayoutandstyles)
section in the Advanced Usage guide.

<a id="components"></a>

### Components

[back](#nav)

Components are the building blocks you use to compose your search experience. These assume that you have configured a [SearchProvider](#basicsearchprovider) and are placing them as children of the SearchProvider.

```jsx
<SearchProvider
  config={{
    apiConnector: connector
  }}
>
  {() => (
    <div className="App">
      <Layout
        header={<SearchBox />}
        bodyContent={<Results titleField="title" urlField="nps_link" />}
      />
    </div>
  )}
</SearchProvider>
```

The following Components are available:

- [ErrorBoundary](#componenterrorboundary)
- [Facet](#componentfacet)
- [Paging](#componentpaging)
- [PagingInfo](#componentpaginginfo)
- [Results](#results)
- [ResultsPerPage](#componentresultsperpage)
- [SearchBox](#componentsearchbox)
- [Sorting](#componentsorting)

<a id="componenterrorboundary"></a>

#### ErrorBoundary

[back](#components)

Use this to handle unexpected errors. Any content passed to this Component will
be shown unless an unexpected error is thrown. it will then be replaced with an
error message.

Properties:

| Name     | type       | Required? | Default                                                        | Options | Description                                                                                                                                         |
| -------- | ---------- | --------- | -------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| children | React node | yes       |                                                                |         | Content to show if no error has occurred, will be replaced with error messaging if there was an error.                                              |
| view     | Component  | no        | [ErrorBoundary](../react-search-ui-views/src/ErrorBoundary.js) |         | Used to override the default view for this Component. See the [Customizing Component views and html](#customizeviews) section for more information. |

Example:

```jsx
import { ErrorBoundary } from "@elastic/react-search-ui";

...

<ErrorBoundary>
  <div>Some Content</div>
</ErrorBoundary>
```

<a id="componentfacet"></a>

#### Facet

[back](#components)

Show a Facet filter for a particular field. This requires that the
corresponding field has been configured in
[facets](#config) on the `SearchProvider`.

Properties:

| Name  | type      | Required? | Default                                                            | Options                                                                                                                                                               | Description                                                                                                                                         |
| ----- | --------- | --------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| field | String    | yes       |                                                                    |                                                                                                                                                                       | Field name corresponding to this filter. This requires that the corresponding field has been configured in `facets` on the top level Provider.      |
| label | String    | yes       |                                                                    |                                                                                                                                                                       | A static label to show in the facet filter.                                                                                                         |
| show  | Number    | no        | 10                                                                 |                                                                                                                                                                       | The number of facet filter options to show before concatenating with a "more" link.                                                                 |
| view  | Component | no        | [MultiValueFacet](../react-search-ui-views/src/MultiValueFacet.js) | [SingleValueLinksFacet](../react-search-ui-views/src/SingleValueLinksFacet.js) <br/> [SingleRangeSelectFacet](../react-search-ui-views/src/SingleRangeSelectFacet.js) | Used to override the default view for this Component. See the [Customizing Component views and html](#customizeviews) section for more information. |

Example:

```jsx
import { Facet } from "@elastic/react-search-ui";
import { MultiValueFacet } from "@elastic/react-search-ui-views";

...

<SearchProvider config={{
  ...otherConfig,
  facets: {
    states: { type: "value", size: 30 }
  }
}}>
  {() => (
    <Facet field="states" label="States" view={MultiValueFacet} />
  )}
</SearchProvider>
```

<a id="componentpaging"></a>

#### Paging

[back](#components)

Paging navigation.

Properties:

| Name | type      | Required? | Default                                          | Options | Description                                                                                                                                         |
| ---- | --------- | --------- | ------------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| view | Component | no        | [Paging](../react-search-ui-views/src/Paging.js) |         | Used to override the default view for this Component. See the [Customizing Component views and html](#customizeviews) section for more information. |

Example:

```jsx

import { Paging } from "@elastic/react-search-ui";

...

<Paging />
```

<a id="componentpaginginfo"></a>

#### PagingInfo

[back](#components)

Paging details, like "1 - 20 of 100 results".

Properties:

| Name | type      | Required? | Default                                                  | Options | Description                                                                                                                                         |
| ---- | --------- | --------- | -------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| view | Component | no        | [PagingInfo](../react-search-ui-views/src/PagingInfo.js) |         | Used to override the default view for this Component. See the [Customizing Component views and html](#customizeviews) section for more information. |

Example:

```jsx

import { PagingInfo } from "@elastic/react-search-ui";

...

<PagingInfo />
```

<a id="results"></a>

#### Results

[back](#components)

Shows all results. This is a convenience, you could also iterate over the
results yourself and render each result.

Properties:

| Name         | type      | Required? | Default                                            | Options | Description                                                                                                                                         |
| ------------ | --------- | --------- | -------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| renderResult | Component | no        | [Result](../react-search-ui-views/src/Result.js)   |         | Used to override individual Result views. See the Customizing Component views and html section for more information.                                |
| titleField   | String    | no        |                                                    |         | Name of field to use as the title from each result.                                                                                                 |
| urlField     | String    | no        |                                                    |         | Name of field to use as the href from each result.                                                                                                  |
| view         | Component | no        | [Results](../react-search-ui-views/src/Results.js) |         | Used to override the default view for this Component. See the [Customizing Component views and html](#customizeviews) section for more information. |

Example:

```jsx

import { Results } from "@elastic/react-search-ui";

...

<Results titleField="title" urlField="nps_link" />
```

<a id="componentresultsperpage"></a>

#### ResultsPerPage

[back](#components)

Shows a dropdown for selecting the number of results to show per page. Uses
20, 40, 60 as options.

Properties:

| Name | type      | Required? | Default                                                          | Options | Description                                                                                                                                         |
| ---- | --------- | --------- | ---------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| view | Component | no        | [ResultsPerPage](../react-search-ui-views/src/ResultsPerPage.js) |         | Used to override the default view for this Component. See the [Customizing Component views and html](#customizeviews) section for more information. |

Example:

```jsx

import { ResultsPerPage } from "@elastic/react-search-ui";

...

<ResultsPerPage />
```

<a id="componentsearchbox"></a>

#### SearchBox

Input element which accepts search terms from user and triggers a new search.

[back](#components)

Properties:

| Name            | type      | Required? | Default                                                | Options | Description                                                                                                                                                                  |
| --------------- | --------- | --------- | ------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| debounceLength  | Number    | no        | 200                                                    |         | When using `searchAsYouType`, it can be useful to "debounce" search requests to avoid creating an excessive number of requests. This controls the length to debounce / wait. |
| inputProps      | Object    | no        |                                                        |         | Props for underlying 'input' element. I.e., `{ placeholder: "Enter Text"}`                                                                                                   |
| searchAsYouType | Boolean   | no        | false                                                  |         | Executes a new search query with every key stroke. You can fine tune the number of queries made by adjusting the `debounceLength` parameter.                                 |
| view            | Component | no        | [SearchBox](../react-search-ui-views/src/SearchBox.js) |         | Used to override the default view for this Component. See the [Customizing Component views and html](#customizeviews) section for more information.                          |

Example:

```jsx

import { SearchBox } from "@elastic/react-search-ui";

...

<SearchBox inputProps={{ placeholder: "custom placeholder" }}/>
```

<a id="componentsorting"></a>

#### Sorting

Shows a dropdown for selecting the current Sort.

[back](#components)

Properties:

| Name | type                                           | Required? | Default                                            | Options | Description                                                                                                                                         |
| ---- | ---------------------------------------------- | --------- | -------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| view | Array[[SortOption](./src/types/SortOption.js)] | yes       |                                                    |         |                                                                                                                                                     |
| view | Component                                      | no        | [Sorting](../react-search-ui-views/src/Sorting.js) |         | Used to override the default view for this Component. See the [Customizing Component views and html](#customizeviews) section for more information. |

Example:

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

<a id="advanced"></a>

## Advanced Usage

[back](#nav)

<a id="core"></a>

### The Headless Core

[back](#nav)

NOTE: We refer to the Headless Core conceptually in this documentation. Physically, it is a separate library
which can be used for non-React implementations, [search-ui](../search-ui/README.md).

All of the [Components](#components) in this library use the the Headless Core under the hood. Using those
out-of-the-box Components is super convenient for building quick UIs, because it's all abstracted away from you; you
drop them in and "they just work".

However, it's totally acceptable, and encouraged even, to work directly with the Headless Core when the Components
we provide are not sufficient.

The Headless Core is managed by the `SearchProvider`, which provides a "Context", which is
comprised of "State" and "Actions"

- [SearchProvider](#advancedsearchprovider) - The top-level Component which manages the Headless Core and exposes
  the Context to your application.
- [State](#state) - The current state of your application, (so things like the current search term,
  selected filters, etc.).
- [Actions](#actions) - Functions that let you update the State (setSearchTerm, applyFilter, etc.).
- [Context](#context) - A flattened object containing, as keys, all State and Actions.

That effectively looks like this:

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

Some notes :

- If you are familiar with Redux, these follow the same pattern as State and Actions in Redux.
- Some other popular libraries, like [formik](https://github.com/jaredpalmer/formik), use a similar pattern. They
  provide a headless top-level Component which exposes State and Actions, and you can choose to work
  directly with those State and Actions, or drop in out-of-the-box Components.
- All of our [Components](#components) work with the Context directly, so there's plenty of examples
  of how to do this in our source code.

More information on working directly with the Headless Core can be found in the
[Working with Search UI outside of Components](#directsearchui) and [Creating your own Components](#customcomponents)
sections.

<a id="advancedsearchprovider"></a>

#### SearchProvider

[back](#nav)

The basics of `SearchProvider` are explained in the [SearchProvider](#basicsearchprovider) section of
the Basic Usage guide.

The `SearchProvider` is a top-level Component which is essentially a wrapper around [Headless Headless Core](#core), and
exposes the [State](#state) and [Actions](#actions) of the Headless Core in a [Context](#context).

Params:

| name     | type     | description                                                                                                                                                                                                                                    |
| -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| config   | Object   | See the [Configuration Options](#config) section.                                                                                                                                                                                              |
| children | function | A render prop function that accepts the [Context](#context) as a parameter. Read more about this render prop in the [Working with Search UI outside of Components](#searchproviderrenderprop) section. <br/><br/>`(context) => return <div />` |

<a id="context"></a>

#### Context

[back](#nav)

The "Context" is a flattened object containing, as keys, all [State](#state) and [Actions](#actions).
We refer to it as "Context" because it is implemented with a
[React Context](https://reactjs.org/docs/context.html).

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

<a id="actions"></a>

#### Actions

[back](#nav)

| method              | params                                                                                                                                                                                     | return | description                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | -------------------------------------------------------------------------- |
| `addFilter`         | `name` String - field name to filter on<br/>`value` String - field value to filter on                                                                                                      |        | Add a filter in addition to current filters values.                        |
| `setFilter`         | `name` String - field name to filter on<br/>`value` String - field value to filter on                                                                                                      |        | Set a filter value, replacing current filter values.                       |
| `removeFilter`      | `name` String - field name to filter on<br/>`value` String - field value to filter on                                                                                                      |        | Remove a single filter value.                                              |
| `reset`             |                                                                                                                                                                                            |        | Reset state to initial search state.                                       |
| `clearFilters`      |                                                                                                                                                                                            |        | Clear all filters.                                                         |
| `setCurrent`        | Integer                                                                                                                                                                                    |        | Update the current page number. Used for paging.                           |
| `setResultsPerPage` | Integer                                                                                                                                                                                    |        |                                                                            |
| `setSearchTerm`     | `searchTerm` String<br/> `options` Object<br/>`options.refresh` Boolean - Refresh search results on update. Default: `true`.<br/>`debounce` Number - Length to debounce if using `refresh` |        |                                                                            |
| `setSort`           | `sortField` String - field to sort on<br/>`sortDirection` String - "asc" or "desc"                                                                                                         |        |                                                                            |
| `trackClickThrough` | `documentId` String - The document ID associated with the result that was clicked<br/>`tag` - Array[String] Optional tags which can be used to categorize this click event                 |        | Report a clickthrough event, which is when a user clicks on a result link. |

<a id="state"></a>

#### State

[back](#nav)

State can be divided up into two types.

1. Request State - Reflects the state of the most recent request.
2. Result State - Result State is updated AFTER a response is received.

For this reason, there are often two versions of state. For instance, `searchTerm` and `resultSearchTerm`. This can
be relevant in the UI, where you might not want the search term on the page to change until AFTER a response is
received, so you'd use the `resultSearchTerm` state.

<a id="requeststate"></a>

_Request State_

Reflects the state of the most recent request. It is updated at the time a request is made. Request
state can be set by:

- Using actions, set `setSearchTerm`
- The `initialState` option in [Configuration](#config)
- The URL query string, if `trackUrlState` is enabled in [Configuration](#config)

| option           | type                     | required? | source                                                                                               |
| ---------------- | ------------------------ | --------- | ---------------------------------------------------------------------------------------------------- |
| `current`        | Integer                  | optional  | Current page number                                                                                  |
| `filters`        | Array[Object]            | optional  | [App Search Filters API Reference](https://swiftype.com/documentation/app-search/api/search/filters) |
| `resultsPerPage` | Integer                  | optional  | Number of results to show on each page                                                               |
| `searchTerm`     | String                   | optional  | Search terms to search for                                                                           |
| `sortDirection`  | String ["asc" \| "desc"] | optional  | Direction to sort                                                                                    |
| `sortField`      | String                   | optional  | Name of field to sort on                                                                             |

<a id="responsestate"></a>

_Response State_

Result State is updated AFTER an API response is received. It is not directly update-able, it
is updated indirectly by updating Request State resulting in a new API request.

| field              | type          | description                                                                                                                                                                                                                                                               |
| ------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `error`            | String        | Error message, if an error was thrown                                                                                                                                                                                                                                     |
| `isLoading`        | boolean       | Whether or not a search is currently being performed                                                                                                                                                                                                                      |
| `facets`           | Object        | Will be populated if `facets` configured in [Configuration](#configs)                                                                                                                                                                                                     |
| `requestId`        | String        | A unique ID for the current search results                                                                                                                                                                                                                                |
| `results`          | Array[Object] | An array of result items                                                                                                                                                                                                                                                  |
| `resultSearchTerm` | String        | As opposed the the `searchTerm` state, which is tied to the current search parameter, this is tied to the searchTerm for the current results. There will be a period of time in between when a request is started and finishes where the two pieces of state will differ. |
| `totalResults`     | Integer       | Total number of results found for the current query                                                                                                                                                                                                                       |
| `wasSearched`      | boolean       | Has any query been performed since this driver was created? Can be useful for displaying initial states in the UI.                                                                                                                                                        |

<a id="searchuiconfig"></a>

### Configuring Search UI

[back](#nav)

Configuration of Search UI is done through the [SearchProvider](#basicsearchprovider). The following
is an example of a more sophisticated configuration being passed to `SearchProvider`.

Example:

```jsx
const configurationOptions = {
  apiConnector: connector,
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

<a id="config"></a>

#### Configuration Options

[back](#nav)

All configuration for Search UI is provided in a single configuration object. Configuration is used to:

- Configure application behavior, like `trackUrlState`.
- Configure Search API calls, like `facets`, `result_fields`, and `search_fields`.

In regards to the latter, The configuration for Search UI largely follows the same API as the
[App Search Search API](https://swiftype.com/documentation/app-search/api/search).

For example, if you add a `search_fields` configuration option, it will control which
fields are actually returned from the API.

| option                           | type                     | required? | source                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------------- | ------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apiConnector`                   | APIConnector             | required  | Instance of an [Connector](#connectors). For instance, [search-ui-app-search-connector](../search-ui-app-search-connector).                                                                                                                                                                                                                                                                                                    |
| `facets`                         | Object                   | optional  | [App Search Facets API Reference](https://swiftype.com/documentation/app-search/api/search/facets). Tells Search UI to fetch facet data that can be used to build [Facet](#componentfacet) Components. <br /><br />Example, using `states` field for faceting:<br/>`facets: {states: { type: "value", size: 30 }`                                                                                                              |
| `disjunctiveFacets`              | Array[String]            | optional  | An array of field names. Every field listed here must have been configured in the `facets` field first. It denotes that a facet should be considered disjunctive. When returning counts for disjunctive facets, the counts will be returned as if no filter is applied on this field, even if one is applied. <br /><br />Example, specifying `states` field as disjunctive:<br/>`disjunctiveFacets: ['states']`               |
| `disjunctiveFacetsAnalyticsTags` | Array[String]            | optional  | Used in conjunction with the `disjunctiveFacets` parameter. Adding `disjunctiveFacets` can cause additional API requests to be made to your API, which can create deceiving analytics. These queries will be tagged with "Facet-Only" by default. This field lets you specify a different tag for these. <br /><br />Example, use `junk` as a tag on all disjunctive API calls:<br/>`disjunctiveFacetsAnalyticsTags: ['junk']` |
| `conditionalFacets`              | Object[String, function] | optional  | This facet will only be fetched if the condition specified returns `true`, based on the currently applied filters. This is useful for creating hierarchical facets.<br/><br/>Example: don't return `states` facet data unless `parks` is a selected filter.<br/> `{ states: filters => isParkSelected(filters) }`                                                                                                              |
| `initialState`                   | Object                   | optional  | Set initial [State](#state) of the search. Any [Request State](#requeststate) can be set here. This is useful for defaulting a search term, sort, etc.<br/><br/>Example:<br/>`{ searchTerm: "test", resultsPerPage: 40 }`                                                                                                                                                                                                      |
| `trackURLState`                  | boolean                  | optional  | By default, [Request State](#requeststate) will be synced with the browser url. To turn this off, pass `false`.                                                                                                                                                                                                                                                                                                                |
| `search_fields`                  | Object[String, Object]   | optional  | Fields which should be searched with search term.<br/><br/>[App Search search_fields API Reference](https://swiftype.com/documentation/app-search/api/search/search-fields)                                                                                                                                                                                                                                                    |
| `result_fields`                  | Object[String, Object]   | optional  | Fields which should be returned in results.<br/><br/>[App Search result_fields API Reference](https://swiftype.com/documentation/app-search/api/search/result-fields)                                                                                                                                                                                                                                                          |

<a id="ownlayoutandstyles"></a>

### Customizing Styles and Layout

[back](#nav)

The out-of-the-box styles and layout provided by Search UI are discussed in the
[Styles and Layout](#layoutandstyles) section of the Basic Usage guide. These are all optional;
you can choose not to use them, or customize them.

To provide custom styles:

- Option 1: Provide all of your own styles. To do this, simply write your own styles that target the class names
  in the individual Components, and do NOT include `styles.css`.
- Option 2: Override or customize the default styles. So include `styles.css`, and then write your own
  styles which override those styles.

For layout, simply provide your own layout instead of using the `Layout` Component.

If you still need more view customization, check out the section for [Customizing views and html](#customizeviews).

<a id="customizeviews"></a>

### Customizing Component views and html

[back](#nav)

All Components in this library can be customized by providing a `view` prop.
Each Component's `view` will have a custom signature.

NOTE: This follows the [Render Props](https://reactjs.org/docs/render-props.html) pattern.

The easiest way to determine a Component's `view` function signature is to
look at the corresponding view Component's source code in
[react-search-ui-views](../react-search-ui-views). Each Component in that
library implements a `view` function for a Component in this library, so it
serves as a great reference.

Ex. Customizing the `PagingInfo` Component.

First off, look up the default view from the [Components](#componentpaginginfo) section, for the
`PagingInfo` Components. You'll find that the corresponding view is
[PagingInfo](../react-search-ui-views/src/PagingInfo.js). (See how the naming matches up?).

After viewing that Component's source, you'll see it accepts 4 props:

1. `end`
2. `searchTerm`
3. `start`
4. `totalResults`

In our case, we may only care about the `start` and `end` values, so we simply provide a view function
that uses those two props.

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

You could also accomplish this with a functional Component:

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

<a id="customizebehavior"></a>

### Customizing Component behavior - mapContextToProps and mapViewProps

All [Components](#components) support two hooks for customizing their behavior.

- `mapContextToProps` - Lets you override the [Context](#context) before it is passed to your Component as
  props.
- `mapViewProps` - Lets you overrides view props before they are passed to the view.

NOTE: The follow the same patterns as `mapStateToProps` in [Redux](https://redux.js.org/).

These allow you to override, modify, or even add completely new props.

CAUTION: These **MUST** be immutable functions, if you directly update the props or context, you will have
major issues in your application.

To visualize these hooks a bit:

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

A practical example might be putting a custom sort on your facet data, This example orders
a list of states by name.

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

<a id="directsearchui"></a>

### Working with Search UI outside of Components

[back](#nav)

If you wish to work with Search UI outside of a particular [Component](#components), then you'll need to work
directly with [The Headless Core](#core).

There's 3 ways you can do this:

<a id="searchproviderrenderprop"></a>

#### 1. The Render Prop on SearchProvider

[back](#nav)

When you configure [SearchProvider](#advancedsearchprovider), you need to provide a function as the child of the provider. That function
is actually a [Render Prop](https://reactjs.org/docs/render-props.html) that exposes the [Context](#context) for you
to work with.

A good use case for that could be to render a "loading" indicator any time the application is fetching data. For example:

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

You could also use it to add a clear filters button, for example:

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

<a id="withsearch"></a>

#### 2. `withSearch`

This is typically used for creating your own Components. Read
more in the [Creating your own Components](#customcomponents) section.

<a id="searchconsumer"></a>

#### 3. With `SearchConsumer`

If you prefer a [Render Props](https://reactjs.org/docs/render-props.html) approach rather than
the [Higher Order Components](https://reactjs.org/docs/higher-order-components.html) approach of `withSearch`, you can use
`SearchConsumer`.

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

<a id="customcomponents"></a>

### Creating your own Components

[back](#nav)

We provide a variety of [Components](#components) out of the box. However, there will be cases
where you we don't have a Component you need.

In this case, we provide a [Higher Order Component](https://reactjs.org/docs/higher-order-components.html),
called [withSearch](./src/withSearch.js), which gives you access to work directly with Search UI's [Context](#context).
This let's you create your own Components for Search UI.

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

<a id="apicalls"></a>

### Customizing API calls - additionalOptions

[back](#nav)

As mentioned earlier, Search UI makes all of the API calls for your application. You
can control what these API calls look like to some degree with [Configuration](#config)
options like `search_fields`, `result_fields`, and `facets`.

There are cases where certain operations that your specific API supports are not supported
by Search UI. In this case, we provide a hook on our [Connectors](#connectors) called `additionalOptions`, so
that you can still use them.

For example, [App Search](https://www.elastic.co/cloud/app-search-service) supports a "grouping" feature,
which Search UI does not support out of the box. However, we can work around that by using the `additionalOptions`
hook on the particular Connector.

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

<a id="buildaconnector"></a>

### Creating your own Connector

[back](#nav)

The [Connectors](#connectors) section of the Basic Usage guide explain what exactly
a Connector is and lists our out-of-the-box Connectors.

It is also possible to create your own Connector if you don't see your service in the list above.
Connectors just need to implement a common interface that Search UI understands.

An example of this is the [Site Search API Connector](../search-ui-site-search-connector/README.md).

What you're effectively doing here is two things:

1. Converting the semantics of an App Search Search API request into the semantics of your particular Search API.
2. Converting the response from your particular Search API into the semantics of an App Search Search API response.

Why the App Search API Response format? Well, it just so happened to be the easiest format for us to work with
when building this library. It could change to some sort of neutral format in the future.

For the first part, check out the `click` and `search` methods below, which provide some more details on what the
App Search API request format looks like.

For the second part, see the [App Search API response example](#appsearchresponse) below. You basically need to
convert your data to this format and wrap it in a `ResultList` object, which is specified below.

<a id="connectorconfig"></a>

#### Configuration

Each Connector will need to be instantiated with its own set of properties. The only properties that Connectors
should have in common is an `additionalOptions` parameter.

| option              | type             | required? | source                                                                                                                                                                        |
| ------------------- | ---------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `additionalOptions` | Function(Object) | optional  | A hook that allows you to inject additional, API specific configuration. More information can be found in the [Customizing API calls - additionalOptions](#apicalls) section. |

<a id="connectormethods"></a>

#### Methods

| method   | params                   | return                    | description                                                                                                                                                                                                                                                                                                                                                 |
| -------- | ------------------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `click`  | `props` - Object         |                           | This method logs a click-through event to your APIs analytics service. This is triggered when a user clicks on a result on a result page.                                                                                                                                                                                                                   |
|          | - `documentId` - String  |                           | The id of the result that a user clicked.                                                                                                                                                                                                                                                                                                                   |
|          | - `requestId` - String   |                           | A unique id that ties the click to a particular search request.                                                                                                                                                                                                                                                                                             |
|          | - `tags` - Array[String] |                           | Tags used for analytics.                                                                                                                                                                                                                                                                                                                                    |
| `search` | `searchTerm` - String    | [ResultList](#resultlist) | The search string to query on.                                                                                                                                                                                                                                                                                                                              |
|          | `searchOptions` - Object |                           | `searchOptions` follow the format from App Search's [Search API](https://swiftype.com/documentation/app-search/api/search). The following properties are supported:<br/>- facets<br/>- filters<br/>- result_fields<br/>- search_fields<br/>- sorting <br/> <br/> Additionally, we will pass:<br/> - disjunctiveFacets<br />- disjunctiveFacetsAnalyticsTags |

<a id="resultlist"></a>

#### ResultList

A ResultList object wraps the `results` object from a [Response](#appsearchresponse).

| field        | type                             | description                                                                             |
| ------------ | -------------------------------- | --------------------------------------------------------------------------------------- |
| `rawResults` | Array[Object]                    | Raw `results` field from a [Response](#appsearchresponse).                              |
| `results`    | Array[[ResultItem](#resultItem)] | The `results` array, mapped to a list of [ResultItem](#resultItem)s.                    |
| `info`       | Object                           | All of the fields from a response other than `results`. This means `meta` and `facets`. |

<a id="resultItem"></a>

#### ResultItem

Each Result Item is a wrapped around an individual result, in the

| field        | type             | description                                                              |
| ------------ | ---------------- | ------------------------------------------------------------------------ |
| `data`       | Object           | Raw object from the `results` array on a [Response](#appsearchresponse). |
| `getRaw`     | Function(String) | Convenience function for getting `raw` field data.                       |
| `getSnippet` | Function(String) | Convenience function for getting `snippet` field data.                   |

<a id="appsearchresponse"></a>

#### Search API response example

More details can be found in the
[App Search Search API documentation](https://swiftype.com/documentation/app-search/api/search).

For `results`, each result can have one of two fields: `raw` and `snippet`. The
`raw` value is the raw from the server. Search UI considers this "unsafe" html,
so if it contains any sort of html, it will be escaped before rendering. `snippet`
values should contain a representation of the value that contains highlighted
values, using `em` tags. It is considered "safe", and will be rendered as
is to the DOM, without escaping. Be aware of that, as if your underlying
data is not "safe", it could be a potential XSS vulnerability.

More information on this can be found in the [Elastic App Search Sanitation Guide](https://swiftype.com/documentation/app-search/guides/sanitization).

Depending on the type of `facet` that is being used, `facet` could have a few different
response [formats](https://swiftype.com/documentation/app-search/api/search/facets).

```json
{
  "meta": {
    "page": {
      "current": 2,
      "total_pages": 3,
      "total_results": 41,
      "size": 15
    }
  },
  "facets": {
    "states": [
      {
        "type": "value",
        "data": [
          {
            "value": "California",
            "count": 8
          }
        ]
      }
    ]
  },
  "results": [
    {
      "nps_link": {
        "raw": "https://www.nps.gov/wrst/index.htm"
      },
      "title": {
        "raw": "Wrangell–St. Elias"
      },
      "date_established": {
        "raw": "1980-12-02T06:00:00+00:00"
      },
      "world_heritage_site": {
        "raw": "true"
      },
      "states": {
        "raw": ["Alaska"]
      },
      "description": {
        "raw": "An over 8 million acres (32,375 km2) plot of mountainous country—the largest National Park in the system—protects the convergence of the Alaska, Chugach, and Wrangell-Saint Elias Ranges, which include many of the continent's tallest mountains and volcanoes, including the 18,008-foot Mount Saint Elias. More than a quarter of the park is covered with glaciers, including the tidewater Hubbard Glacier, piedmont Malaspina Glacier, and valley Nabesna Glacier.",
        "snippet": "An over 8 <em>million</em> acres (32,375 km2) plot"
      },
      "visitors": {
        "raw": 79047
      },
      "id": {
        "raw": "park_wrangell–st.-elias"
      },
      "location": {
        "raw": "61,-142"
      },
      "square_km": {
        "raw": 33682.6
      },
      "acres": {
        "raw": 8323146.48
      }
    }
  ]
}
```
