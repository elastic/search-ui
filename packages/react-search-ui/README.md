# react-search-ui

A React library for building search experiences.

This is the React Implementation of Search UI. For a more broad overview
of Search UI, see the [README](../../README.md) at the top.

## Install

```sh
# Install React Search UI
npm install --save @elastic/react-search-ui

# Install a connector, like the Elastic App Search connector
npm install --save  @elastic/search-ui-app-search-connector
```

## Example

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
          <Layout header={<SearchBox />} bodyContent={<Results />} />
        </div>
      )}
    </SearchProvider>
  );
}
```

### SearchProvider <a id="searchprovider"></a>

The SearchProvider is the core engine behind Search UI. It provides [actions](../search-ui/README.md#actions)
and [state](../search-ui/README.md#state) in a React [Context](https://reactjs.org/docs/context.html). If
you are familiar with Redux, you should recognize this model.

`SearchProvider` is essentially a wrapper around our [`search-ui`](../search-ui).

Params:

| name     | type                                          | description                                                                                                                                                                                                           |
| -------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| config   | [Config](../search-ui/README.md#driverconfig) |                                                                                                                                                                                                                       |
| children | function                                      | A render prop function that receives [state](../search-ui/README.md#state) and [actions](../search-ui/README.md#actions) in a flattened object<br/><br/>`({someState, someOtherState, someAction}) => return <div />` |

### Connectors

Connectors are explained in the top level [README](../../README.md). The first
thing you'll need to do is configure a Connector, which lets Search UI make
all the appropriate API calls as a user interacts with your UI.

### Components<a id="components"></a>

- [ErrorBoundary](#c_errorboundary)
- [Facet](#c_facet)
- [Paging](#c_paging)
- [PagingInfo](#c_paginginfo)
- [Results](#results)
- [ResultsPerPage](#c_resultsperpage)
- [SearchBox](#c_searchbox)
- [Sorting](#c_sorting)

#### ErrorBoundary<a id="c_errorboundary"></a>

Use this to handle unexpected errors. Any content passed to this component will
be shown unless an unexpected Error is thrown. it will then replaced with an
error message.

Properties:

| Name     | type       | Required? | Default                                                        | Options | Description                                                                                           |
| -------- | ---------- | --------- | -------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------- |
| children | React node | yes       |                                                                |         | Markup to show if no error has occurred, will be replaced with error messaging if there was an error. |
| view     | Component  | no        | [ErrorBoundary](../react-search-ui-views/src/ErrorBoundary.js) |         | Used to override the default view for this Component.                                                 |

Example:

```jsx
import { ErrorBoundary } from "@elastic/react-search-ui";

...

<ErrorBoundary>
  <div>Some Content</div>
</ErrorBoundary>
```

#### Facet<a id="c_facet"></a>

Show a Facet filter for a particular field. This requires that the
corresponding field has been configured in
[facets](../search-ui/README.md#driverconfig) on the top level Provider.

Properties:

| Name  | type      | Required? | Default | Options                                                                                                                                                                                                                                        | Description                                                                                                                                    |
| ----- | --------- | --------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| field | String    | yes       |         |                                                                                                                                                                                                                                                | Field name corresponding to this filter. This requires that the corresponding field has been configured in `facets` on the top level Provider. |
| label | String    | yes       |         |                                                                                                                                                                                                                                                | A static label to show in the facet filter.                                                                                                    |
| show  | Number    | no        | 10      |                                                                                                                                                                                                                                                | The number of facet filter options to show before concatenating with a "more" link.                                                            |
| view  | Component | yes       |         | [SingleValueLinksFacet](../react-search-ui-views/src/SingleValueLinksFacet.js) <br/> [SingleRangeSelectFacet](../react-search-ui-views/src/SingleRangeSelectFacet.js) <br/> [MultiValueFacet](../react-search-ui-views/src/MultiValueFacet.js) | The view for this component.                                                                                                                   |

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

#### Paging<a id="c_paging"></a>

Paging navigation.

Properties:

| Name | type      | Required? | Default                                          | Options | Description                                           |
| ---- | --------- | --------- | ------------------------------------------------ | ------- | ----------------------------------------------------- |
| view | Component | no        | [Paging](../react-search-ui-views/src/Paging.js) |         | Used to override the default view for this Component. |

Example:

```jsx

import { Paging } from "@elastic/react-search-ui";

...

<Paging />
```

#### PagingInfo<a id="c_paginginfo"></a>

Paging details, like "1 - 20 of 100 results".

Properties:

| Name | type      | Required? | Default                                                  | Options | Description                                           |
| ---- | --------- | --------- | -------------------------------------------------------- | ------- | ----------------------------------------------------- |
| view | Component | no        | [PagingInfo](../react-search-ui-views/src/PagingInfo.js) |         | Used to override the default view for this Component. |

Example:

```jsx

import { PagingInfo } from "@elastic/react-search-ui";

...

<PagingInfo />
```

#### Results<a id="results"></a>

Shows all results. This is a convenience, you could also iterate over the
results yourself and render each result.

Properties:

| Name         | type      | Required? | Default                                            | Options | Description                                           |
| ------------ | --------- | --------- | -------------------------------------------------- | ------- | ----------------------------------------------------- |
| renderResult | Component | no        | [Result](../react-search-ui-views/src/Result.js)   |         | Used to override individual Result views.             |
| titleField   | String    | no        |                                                    |         | Name of field to use as the title from each result.   |
| urlField     | String    | no        |                                                    |         | Name of field to use as the href from each result.    |
| view         | Component | no        | [Results](../react-search-ui-views/src/Results.js) |         | Used to override the default view for this Component. |

Example:

```jsx

import { Results } from "@elastic/react-search-ui";

...

<Results titleField="title" urlField="nps_link" />
```

#### ResultsPerPage<a id="c_resultsperpage"></a>

Shows a selector for selecting the number of results to show per page. Uses
20, 40, 60 as options.

Properties:

| Name | type      | Required? | Default                                                          | Options | Description                                           |
| ---- | --------- | --------- | ---------------------------------------------------------------- | ------- | ----------------------------------------------------- |
| view | Component | no        | [ResultsPerPage](../react-search-ui-views/src/ResultsPerPage.js) |         | Used to override the default view for this Component. |

Example:

```jsx

import { ResultsPerPage } from "@elastic/react-search-ui";

...

<ResultsPerPage />
```

#### SearchBox<a id="c_searchbox"></a>

Properties:

| Name       | type      | Required? | Default                                                | Options | Description                                                                |
| ---------- | --------- | --------- | ------------------------------------------------------ | ------- | -------------------------------------------------------------------------- |
| inputProps | Object    | no        |                                                        |         | Props for underlying 'input' element. I.e., `{ placeholder: "Enter Text"}` |
| view       | Component | no        | [SearchBox](../react-search-ui-views/src/SearchBox.js) |         | Used to override the default view for this Component.                      |

Example:

```jsx

import { SearchBox } from "@elastic/react-search-ui";

...

<SearchBox inputProps={{ placeholder: "custom placeholder" }}/>
```

#### Sorting<a id="c_sorting"></a>

Properties:

| Name | type                                           | Required? | Default                                            | Options | Description                                           |
| ---- | ---------------------------------------------- | --------- | -------------------------------------------------- | ------- | ----------------------------------------------------- |
| view | Array[[SortOption](./src/types/SortOption.js)] | yes       |                                                    |         |                                                       |
| view | Component                                      | no        | [Sorting](../react-search-ui-views/src/Sorting.js) |         | Used to override the default view for this Component. |

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

### Using the default styles and layout

Styles and layout can be found in the [react-search-ui-views](../react-search-ui-views)
module.

For basic styles, simply include:

```jsx
import "@elastic/react-search-ui-views/lib/styles/styles.css";
```

For a basic layout, which often helps quickly get a UI bootstrapped,
use the [Layout](../react-search-ui-views/src/layouts/Layout.js) component.

```jsx
import { Layout } from "@elastic/react-search-ui-views";

<Layout header={<SearchBox />} bodyContent={<Results />} />;
```

### Customizing styles

The simplest way to customize the components in the library is to provide
your own stylesheet. You can reference individual component source files
for their relevant class names.

### Customizing markup

All components in this library can be customized by providing a `view` prop.
Each components `view` will have a custom signature.

The easiest way to determine a components `view` function signature is to
look at the corresponding view components in
[react-search-ui-views](../react-search-ui-views). Each component in that
library implements a `view` function for a component in this library, so it
serves as a great reference.

Ex. Customizing the `PagingInfo` component

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

### Customizing data

You may wish to manipulate data from a component before rendering it. We provide
a hook for that, called `mapContextToProps`. `mapContextToProps` is a function
that accepts the current state of the application, and allows you to manipulate
that state before it is passed into your component.

It's important that the function you provide is **immutable**. If you mutate
the context state here, it will break your application.

Ex. Ordering Facet options:

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

### Creating new components

We provide a fair variety of components out of the box. However, there most
certainly be cases where you might find we simply don't have a component you
need, or, the components we provide need extensive customization in order
to work properly.

In this case, we provide a Higher Order Component, `withSearch`, which gives
you access to the applications core [state](../search-ui/README.md#state) and
[actions](../search-ui/README.md#actions), which allows you to create your own
component, connected to the Search UI.

Ex. A component for clearing all filters

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
