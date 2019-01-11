# Search UI

**NOTE: This library is in an early Beta period, it is not yet recommended for production use**

Most search experiences follow similar patterns; search box, search results, paging, sorting, filters, url state, etc.
Search UI gives you a means of quickly implementing these patterns without re-inventing the wheel.

<img src="./resources/screenshot.png" width="400">

We understand that no two experiences are exactly the same. Because of this, we aim to provide a toolset that is
flexible enough to meet any demand, be it a completely out of the box experience or a completely custom UI.

## Features

- A Component-based library to quickly compose search experiences.
- Full state management solution with optional URL synchronization.
- Out of the box styles and layouts for building quick UIs.
- Full control over the view -- styles and layouts are optional, and all markup is override-able.
- API Connectors so that Search UI can be used with any web-based Search API.
- API Connectors for Elastic's [Site Search](https://www.elastic.co/cloud/site-search-service) and
  [App Search](https://www.elastic.co/cloud/app-search-service) services.
- Built on top of a ["Headless" version of Search UI](../search-ui/README.md), which can be used with any JavaScript library, or even vanilla
  JavaScript.

<a id="nav"></a>

## In this README

- [Install](#install)
- [Creating a simple UI](#simple-ui)
- [Configuring Search UI](#searchuiconfig)
- [Components](#components)
- [Using the default styles and layout](#layoutandstyles)
- [Using your own styles and layout](#ownlayoutandstyles)
- [Customizing component views and html](#customizeviews)
- [Customizing component behavior - mapContextToProps and mapViewProps](#customizebehavior)
- [Working with Search UI outside of Components](#directsearchui)
  - [Actions](#actions)
  - [State](#state)
- [Creating your own components](#customcomponents)
- [Customizing API calls - additionalOptions](#apicalls)
- [Connectors](#connectors)
  - [Use existing Connectors to connect to Elastic's App Search or Site Search APIs](#existingconnectors)
  - [Create your own connector to connect to some other API](#buildaconnector)

<a id="install"></a>

## Install

[back](#nav)

```sh
# Install React Search UI
npm install --save @elastic/react-search-ui

# Install a connector, like the Elastic's App Search connector
npm install --save  @elastic/search-ui-app-search-connector
```

<a id="simple-ui"></a>

## Creating a simple UI

[back](#nav)

Search UI can be used to create experiences very quickly. Especially if you use the out of the box
styles and layout. The following is a very simplistic UI for an App Search engine.

```jsx
import React from "react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import { SearchProvider, Results, SearchBox } from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";

import "@elastic/react-search-ui-views/lib/styles/styles.css";

const connector = new AppSearchAPIConnector({
  searchKey: "search-soaewu2ye6uc45dr8mcd54v8",
  engineName: "national-parks-demo",
  hostIdentifier: "host-2376rb"
});

const config = {
  apiConnector: connector
};

export default function App() {
  return (
    <SearchProvider config={config}>
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

<a id="searchuiconfig"></a>

## Configuring Search UI

[back](#nav)

Search UI is configured via the `SearchProvider`.

Example:

```jsx
const config = {
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
  <SearchProvider config={config}>
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

<a id="searchprovider"></a>

### SearchProvider

`SearchProvider` is what connects Search UI to your components. Components you place
within `SearchProvider` will be connected to your search experience. It translates the actions users take within
your search experience into calls to your configured Search API.

Params:

| name     | type     | description                                                                                                                                                                                                                                                                                                                                                                                            |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| config   | Object   | [Search UI Configuration](#config)                                                                                                                                                                                                                                                                                                                                                                     |
| children | function | A render prop function that receives [state](#state) and [actions](#actions) in a flattened object. These are primarily available if you'd like to work directly with state or actions outside of a component. See the [Working with Search UI outside of Components](#searchproviderrenderprop) section for more information. <br/><br/>`({someState, someOtherState, someAction}) => return <div />` |

<a id="config"></a>

### Search UI Configuration

All configuration for Search UI is provided in a single configuration object. Configuration is used to:

- Configure application behavior, like `trackUrlState`.
- Configure Search API calls, like `facets`, `result_fields`, and `search_fields`.

For the latter, this means that often times you will need to add configuration to Search UI before using
a particular component. For example, to use a [Facet](#componentfacet) component to show facet filters, you would first need
to provide `facets` configuration. By configuring facets, you're asking for facet details to be returned on your API
calls. These can then be consumed by the `Facet` component to show facet filters.

Note that this is not the only way to customize API calls. Check out the [Customizing API calls - additionalOptions](#apicalls) for some
more details.

For this reason, the configuration for Search UI largely follows the same API as the
[App Search Search API](https://swiftype.com/documentation/app-search/api/search).

| option                           | type                     | required? | source                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------------- | ------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apiConnector`                   | APIConnector             | required  | Instance of an [API Connector](#connectors). For instance, [search-ui-app-search-connector](../search-ui-app-search-connector).                                                                                                                                                                                                                                                                                                |
| `facets`                         | Object                   | optional  | [Reference](https://swiftype.com/documentation/app-search/api/search/facets). Tells Search UI to fetch facet data that can be used to build `Facet` components. <br /><br />Example, using `states` field for faceting:<br/>`facets: {states: { type: "value", size: 30 }`                                                                                                                                                     |
| `disjunctiveFacets`              | Array[String]            | optional  | An array of field names. Every field listed here must have been configured in the `facets` field first. It denotes that a facet should be considered disjunctive. When returning counts for disjunctive facets, the counts will be returned as if no filter is applied on this field, even if one is applied. <br /><br />Example, specifying `states` field as disjunctive:<br/>`disjunctiveFacets: ['states']`               |
| `disjunctiveFacetsAnalyticsTags` | Array[String]            | optional  | Used in conjunction with the `disjunctiveFacets` parameter. Adding `disjunctiveFacets` can cause additional API requests to be made to your API, which can create deceiving analytics. These queries will be tagged with "Facet-Only" by default. This field lets you specify a different tag for these. <br /><br />Example, use `junk` as a tag on all disjunctive API calls:<br/>`disjunctiveFacetsAnalyticsTags: ['junk']` |
| `conditionalFacets`              | Object[String, function] | optional  | This facet will only be fetched if the condition specified returns `true`, based on the currently applied filters. This is useful for creating hierarchical facets.<br/><br/>Example: don't return `states` facet data unless `parks` is a selected filter.<br/> `{ states: filters => isParkSelected(filters) }`                                                                                                              |
| `initialState`                   | Object                   | optional  | Set initial state of the search. Any [Request State](#requeststate) can be set here. This is useful for defaulting a search term, sort, etc.<br/><br/>Example:<br/>`{ searchTerm: "test", resultsPerPage: 40 }`                                                                                                                                                                                                                |
| `trackURLState`                  | boolean                  | optional  | By default, state will be synced with the browser url. To turn this off, pass `false`                                                                                                                                                                                                                                                                                                                                          |
| `search_fields`                  | Object[String, Object]   | optional  | Fields which should be searched with search term. [Reference](https://swiftype.com/documentation/app-search/api/search/search-fields)                                                                                                                                                                                                                                                                                          |
| `result_fields`                  | boolean                  | optional  | Fields which should be returned in results. [Reference](https://swiftype.com/documentation/app-search/api/search/result-fields)                                                                                                                                                                                                                                                                                                |

<a id="components"></a>

## Components

[back](#nav)

The following components are available:

- [ErrorBoundary](#componenterrorboundary)
- [Facet](#componentfacet)
- [Paging](#componentpaging)
- [PagingInfo](#componentpaginginfo)
- [Results](#results)
- [ResultsPerPage](#componentresultsperpage)
- [SearchBox](#componentsearchbox)
- [Sorting](#componentsorting)
- [Layout](#layoutcomponent)

<a id="componenterrorboundary"></a>

### ErrorBoundary

Use this to handle unexpected errors. Any content passed to this component will
be shown unless an unexpected Error is thrown. it will then replaced with an
error message.

Properties:

| Name     | type       | Required? | Default                                                        | Options | Description                                                                                                                                          |
| -------- | ---------- | --------- | -------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| children | React node | yes       |                                                                |         | Markup to show if no error has occurred, will be replaced with error messaging if there was an error.                                                |
| view     | Component  | no        | [ErrorBoundary](../react-search-ui-views/src/ErrorBoundary.js) |         | Used to override the default view for this Component. See the [Customizing component views and html](#customizeviews") section for more information. |

Example:

```jsx
import { ErrorBoundary } from "@elastic/react-search-ui";

...

<ErrorBoundary>
  <div>Some Content</div>
</ErrorBoundary>
```

<a id="componentfacet"></a>

### Facet

Show a Facet filter for a particular field. This requires that the
corresponding field has been configured in
[facets](../search-ui/README.md#driverconfig) on the top level Provider.

Properties:

| Name  | type      | Required? | Default | Options                                                                                                                                                                                                                                        | Description                                                                                                                                    |
| ----- | --------- | --------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| field | String    | yes       |         |                                                                                                                                                                                                                                                | Field name corresponding to this filter. This requires that the corresponding field has been configured in `facets` on the top level Provider. |
| label | String    | yes       |         |                                                                                                                                                                                                                                                | A static label to show in the facet filter.                                                                                                    |
| show  | Number    | no        | 10      |                                                                                                                                                                                                                                                | The number of facet filter options to show before concatenating with a "more" link.                                                            |
| view  | Component | yes       |         | [SingleValueLinksFacet](../react-search-ui-views/src/SingleValueLinksFacet.js) <br/> [SingleRangeSelectFacet](../react-search-ui-views/src/SingleRangeSelectFacet.js) <br/> [MultiValueFacet](../react-search-ui-views/src/MultiValueFacet.js) | The view for this component. See the [Customizing component views and html](#customizeviews") section for more information.                    |

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

### Paging

Paging navigation.

Properties:

| Name | type      | Required? | Default                                          | Options | Description                                                                                                                                          |
| ---- | --------- | --------- | ------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| view | Component | no        | [Paging](../react-search-ui-views/src/Paging.js) |         | Used to override the default view for this Component. See the [Customizing component views and html](#customizeviews") section for more information. |

Example:

```jsx

import { Paging } from "@elastic/react-search-ui";

...

<Paging />
```

<a id="componentpaginginfo"></a>

### PagingInfo

Paging details, like "1 - 20 of 100 results".

Properties:

| Name | type      | Required? | Default                                                  | Options | Description                                                                                                                                          |
| ---- | --------- | --------- | -------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| view | Component | no        | [PagingInfo](../react-search-ui-views/src/PagingInfo.js) |         | Used to override the default view for this Component. See the [Customizing component views and html](#customizeviews") section for more information. |

Example:

```jsx

import { PagingInfo } from "@elastic/react-search-ui";

...

<PagingInfo />
```

<a id="results"></a>

### Results

Shows all results. This is a convenience, you could also iterate over the
results yourself and render each result.

Properties:

| Name         | type      | Required? | Default                                            | Options | Description                                                                                                                                          |
| ------------ | --------- | --------- | -------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| renderResult | Component | no        | [Result](../react-search-ui-views/src/Result.js)   |         | Used to override individual Result views.                                                                                                            |
| titleField   | String    | no        |                                                    |         | Name of field to use as the title from each result.                                                                                                  |
| urlField     | String    | no        |                                                    |         | Name of field to use as the href from each result.                                                                                                   |
| view         | Component | no        | [Results](../react-search-ui-views/src/Results.js) |         | Used to override the default view for this Component. See the [Customizing component views and html](#customizeviews") section for more information. |

Example:

```jsx

import { Results } from "@elastic/react-search-ui";

...

<Results titleField="title" urlField="nps_link" />
```

<a id="componentresultsperpage"></a>

### ResultsPerPage

Shows a selector for selecting the number of results to show per page. Uses
20, 40, 60 as options.

Properties:

| Name | type      | Required? | Default                                                          | Options | Description                                                                                                                                          |
| ---- | --------- | --------- | ---------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| view | Component | no        | [ResultsPerPage](../react-search-ui-views/src/ResultsPerPage.js) |         | Used to override the default view for this Component. See the [Customizing component views and html](#customizeviews") section for more information. |

Example:

```jsx

import { ResultsPerPage } from "@elastic/react-search-ui";

...

<ResultsPerPage />
```

<a id="componentsearchbox"></a>

### SearchBox

Properties:

| Name       | type      | Required? | Default                                                | Options | Description                                                                                                                                          |
| ---------- | --------- | --------- | ------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| inputProps | Object    | no        |                                                        |         | Props for underlying 'input' element. I.e., `{ placeholder: "Enter Text"}`                                                                           |
| view       | Component | no        | [SearchBox](../react-search-ui-views/src/SearchBox.js) |         | Used to override the default view for this Component. See the [Customizing component views and html](#customizeviews") section for more information. |

Example:

```jsx

import { SearchBox } from "@elastic/react-search-ui";

...

<SearchBox inputProps={{ placeholder: "custom placeholder" }}/>
```

<a id="componentsorting"></a>

### Sorting

Properties:

| Name | type                                           | Required? | Default                                            | Options | Description                                                                                                                                          |
| ---- | ---------------------------------------------- | --------- | -------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| view | Array[[SortOption](./src/types/SortOption.js)] | yes       |                                                    |         |                                                                                                                                                      |
| view | Component                                      | no        | [Sorting](../react-search-ui-views/src/Sorting.js) |         | Used to override the default view for this Component. See the [Customizing component views and html](#customizeviews") section for more information. |

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

<a id="layoutandstyles"></a>

## Using the default styles and layout

[back](#nav)

Default styles and layout can a super effective way to get up and running fast,
as you can see in the [Creating a simple UI](#simple-ui) section. For some implementations,
these styles may be all you need. These are all optional, so you're not stuck with them, but they are here
if you need them. If these are not sufficient, check out [Using your own styles and layout](#ownlayoutandstyles).

The default styles and layout can be found in the [react-search-ui-views](../react-search-ui-views)
module.

For basic styles, simply include:

```jsx
import "@elastic/react-search-ui-views/lib/styles/styles.css";
```

<a id="layoutcomponent"></a>

For a basic layout, which often helps quickly get a UI bootstrapped,
use the [Layout](../react-search-ui-views/src/layouts/Layout.js) component.

```jsx
import { Layout } from "@elastic/react-search-ui-views";

<Layout header={<SearchBox />} bodyContent={<Results />} />;
```

<a id="ownlayoutandstyles"></a>

## Using your own styles and layout

[back](#nav)

As noted in the [Using the default styles and layout](#layoutandstyles) section, all out of the box
styles and layout are optional.

To provide custom styles:

- Option 1: Provide all of your own styles. To do this, simply write your own styles that target the class names
  in the individual components, and do NOT include `styles.css`.
- Option 2: Override or customize the default styles. So include `styles.css`, and then write your own
  styles which override those styles.

For layout, simply provide your own layout instead of using the `Layout` component.

If you still need more view customization, check out the section for [Customizing views and html](#customizeviews).

<a id="customizeviews"></a>

## Customizing component views and html

[back](#nav)

All components in this library can be customized by providing a `view` prop.
Each component's `view` will have a custom signature.

(Note, if you're familiar with the [Render Props](https://reactjs.org/docs/render-props.html) pattern, that is all these are)

The easiest way to determine a component's `view` function signature is to
look at the corresponding view components in
[react-search-ui-views](../react-search-ui-views). Each component in that
library implements a `view` function for a component in this library, so it
serves as a great reference.

Ex. Customizing the `PagingInfo` component.

First off, look up the default view from the [Components](#componentpaginginfo) section, for the
`PagingInfo` components. You'll find that the corresponding view is the
[PagingInfo](../react-search-ui-views/src/PagingInfo.js). (See how the naming matches up?).

After viewing that component's source, you'll see it accepts 4 props:

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

You could also accomplish this with a functional component:

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

## Customizing component behavior - mapContextToProps and mapViewProps

All components support two hooks for customizing their behavior.

- mapContextToProps - Lets you override the state and actions (i.e., context) before they are passed to your Component as
  props.
- mapViewProps - Lets you overrides the props before they are passed to the view.

(If you are familiar with [Redux](https://redux.js.org/), these follow the same pattern as `mapStateToProps`)

These allow you override, modify, or even add completely new props.

CAUTION: These **MUST** be immutable functions, if you directly update the props or context, you will have
major issues in your application.

To visualize these hooks a bit:

```
Search UI
  |
  | { searchTerm, setSearchTerm } <- This is the "context"
  v
  // Updates the searchTerm before passing it to the SearchBox component
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

As a reminder, the "context" is a flatted object of all [State](#state) and [Actions](#actions).

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

## Working with Search UI outside of Components

[back](#nav)

If you're not working with an existing component, so you're either building your own
component (see [Creating your own components](#customcomponents)) or just wish to do something with Search UI outside of a particular component,
then you'll need to know about 2 things: state and actions.

- "State" - The current state of your application, (so things like the current search term, selected filters, etc.)
- "Actions" - Function that let you update the state (setSearchTerm, applyFilter, etc.)

Search UI provides these state and actions, and components simply read from the state when rendering, and call actions
when a user interacts with the search experience.

It's totally possible to use state and actions directly, outside of components. Here's how you'd do that:

<a id="searchproviderrenderprop"></a>

### 1. render prop on SearchProvider

[back](#nav)

When you configure a SearchProvider, you need to provide a function as the child of the provider. That function
is actually a [Render Prop](https://reactjs.org/docs/render-props.html) that exposes all state and actions to you.

For comparison, this is the same pattern used by the popular [formik](https://github.com/jaredpalmer/formik) library.

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

### 2. `withSearch` HOC when [Creating your own components](#customcomponents)

<a id="searchconsumer"></a>

### 3. With `SearchConsumer`

If you prefer a render props approach to the HOC approach of `withSearch`, you can use
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

<a id="actions"></a>

### Actions

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

<a id="state"></a>

### State

State can be divided up into two types.

1. Request state - Reflects the state of the most recent request. It is updated at the time a request is made.
2. Result state - Result state is updated AFTER a response is received.

For this reason, there are often two versions of state. For instance, `searchTerm` and `resultSearchTerm`. This can
be relevant in the UI, where you might not want the search term on the page to change until AFTER a response is
received, so you'd use the `resultSearchTerm` state.

<a id="requeststate"></a>

_Request State_

| option           | type                     | required? | source                                                                        |
| ---------------- | ------------------------ | --------- | ----------------------------------------------------------------------------- |
| `current`        | Integer                  | optional  | current page number                                                           |
| `filters`        | Array[Object]            | optional  | [Reference](https://swiftype.com/documentation/app-search/api/search/filters) |
| `resultsPerPage` | Integer                  | optional  | Number of results to show on each page                                        |
| `searchTerm`     | String                   | optional  | String to search for                                                          |
| `sortDirection`  | String ["asc" \| "desc"] | optional  | Direction to sort                                                             |
| `sortField`      | String                   | optional  | Name of field to sort on                                                      |

<a id="responsestate"></a>

_Response State_

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

<a id="customcomponents"></a>

## Creating your own components

[back](#nav)

We provide a fair variety of components out of the box. However, there most
certainly will be cases where you find we simply don't have a component you
need, or, the components we provide need extensive customization in order
to work properly.

In this case, we provide a [Higher Order Component](https://reactjs.org/docs/higher-order-components.html), [withSearch](./src/withSearch.js), which gives
you access to the applications core state and actions (See [Working with Search UI outside of Components - state and actions](#directsearchui)), which allows you to create your own
components, connected to Search UI.

Ex. Creating a component for clearing all filters

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

## Customizing API calls - additionalOptions

[back](#nav)

Search UI is translates user actions into Search API calls. Those calls are initiated by Search UI
when a user takes an action based on the current application state, and converted to API specific
calls by connectors. There are cases where certain operations that your specific API supports are not supported
by Search UI. In this case, we provide a hook on connectors called `additionalOptions`.

For example, [App Search](https://www.elastic.co/cloud/app-search-service) supports a "grouping" feature,
which Search UI does not support out of the box. However, we can work around that by using the `additionalOptions`
hook on the particular connector.

```js
const connector = new AppSearchAPIConnector({
  searchKey: "search-soaewu2ye6uc45dr8mcd54v8",
  engineName: "national-parks-demo",
  hostIdentifier: "host-2376rb",
  additionalOptions: existingSearchOptions => {
    const additionalSearchOptions = {
      group: { field: "title" }
    };
    return additionalSearchOptions;
  }
});
```

<a id="connectors"></a>

## Connectors

<a id="existingconnectors"></a>

[back](#nav)

### Use existing Connectors to connect to Elastic's App Search or Site Search APIs

Search UI can be used with any Search API. We provide connectors for some popular Search APIs to make this easier.

- [search-ui-app-search-connector](packages/search-ui-app-search-connector)
- [search-ui-site-search-connector](packages/search-ui-site-search-connector)

<a id="buildaconnector"></a>

### Create your own connector to connect to some other API

It is also possible to create your own connector if you don't see your service in the list above.
Connectors just need to implement a common interface that Search UI understands.

An example of this is the [Site Search API connector](../search-ui-site-search-connector/README.md).

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

### Configuration

Each connector will need to be instantiated with its own set of properties. The only properties that connectors
should have in common is an `additionalOptions` parameter.

| option              | type             | required? | source                                                                                                                                                                        |
| ------------------- | ---------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `additionalOptions` | Function(Object) | optional  | A hook that allows you to inject additional, API specific configuration. More information can be found in the [Customizing API calls - additionalOptions](#apicalls) section. |

<a id="connectormethods"></a>

### Methods

| method   | params                   | return                    | description                                                                                                                                                                                                                                                                                                                                                 |
| -------- | ------------------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `click`  | `props` - Object         |                           | This method logs a click-through event to your APIs analytics service. This is triggered when a user clicks on a result on a result page.                                                                                                                                                                                                                   |
|          | - `documentId` - String  |                           | The id of the result that a user clicked.                                                                                                                                                                                                                                                                                                                   |
|          | - `requestId` - String   |                           | A unique id that ties the click to a particular search request.                                                                                                                                                                                                                                                                                             |
|          | - `tags` - Array[String] |                           | Tags used for analytics.                                                                                                                                                                                                                                                                                                                                    |
| `search` | `searchTerm` - String    | [ResultList](#resultlist) | The search string to query on.                                                                                                                                                                                                                                                                                                                              |
|          | `searchOptions` - Object |                           | `searchOptions` follow the format from App Search's [Search API](https://swiftype.com/documentation/app-search/api/search). The following properties are supported:<br/>- facets<br/>- filters<br/>- result_fields<br/>- search_fields<br/>- sorting <br/> <br/> Additionally, we will pass:<br/> - disjunctiveFacets<br />- disjunctiveFacetsAnalyticsTags |

<a id="resultlist"></a>

### ResultList

A ResultList object wraps the `results` object from a [Response](#appsearchresponse).

| field        | type                             | description                                                                             |
| ------------ | -------------------------------- | --------------------------------------------------------------------------------------- |
| `rawResults` | Array[Object]                    | Raw `results` field from a [Response](#appsearchresponse).                              |
| `results`    | Array[[ResultItem](#resultItem)] | The `results` array, mapped to a list of [ResultItem](#resultItem)s.                    |
| `info`       | Object                           | All of the fields from a response other than `results`. This means `meta` and `facets`. |

<a id="resultItem"></a>

### ResultItem

Each Result Item is a wrapped around an individual result, in the

| field        | type             | description                                                              |
| ------------ | ---------------- | ------------------------------------------------------------------------ |
| `data`       | Object           | Raw object from the `results` array on a [Response](#appsearchresponse). |
| `getRaw`     | Function(String) | Convenience function for getting `raw` field data.                       |
| `getSnippet` | Function(String) | Convenience function for getting `snippet` field data.                   |

<a id="appsearchresponse"></a>

## Search API response example

More details [here](https://swiftype.com/documentation/app-search/api/search).

For `results`, each result can have one of two fields: `raw` and `snippet`. The
`raw` value is the raw from the server. Search UI considers this "unsafe" html,
so if it contains any sort of html, it will be escaped before rendering. `snippet`
values should contain a representation of the value that contains highlighted
values, using `em` tags. It is considered "safe", and will be rendered as
is to the dom, without escaping. Be aware of that, as if your underlying
data is not "safe", it could be a potential XSS vulnerability.

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
