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

### Components

For a list of available components, check out the [containers](./src/containers)
directory.

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
