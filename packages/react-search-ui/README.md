# react-search-ui

Flexible React library for building search experiences.

This is the React Implementation of Search UI. For a more broad overview
of Search UI, see the [README](../../README.md) at the top.

## Usage

### Install

```sh
# Install React Search UI
npm install --save @elastic/react-search-ui

# Install a connector, like the Elastic App Search connector
npm install --save  @elastic/search-ui-app-search-connector
```

### Example

```jsx
import React from "react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import { SearchProvider, Results, SearchBox } from "@elastic/react-search-ui";
import { Body, Header } from "@elastic/react-search-components";

import "@elastic/react-search-components/lib/styles/styles.css";

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

export default function App() {
  return (
    <SearchProvider config={config}>
      {_ => (
        <div className="App">
          <Header>
            <SearchBox />
          </Header>
          <Body bodyContent={<Results />} />
        </div>
      )}
    </SearchProvider>
  );
}
```

TODO: Add Facets and to the main example

**SearchProvider**

The SearchProvider is the core engine behind Search UI. It provides [actions](../search-ui/README.md#actions)
and [state](../search-ui/README.md#state) in a React [context](https://reactjs.org/docs/context.html). If
you are familiar with Redux, you should recognize this model.

`SearchProvider` is essentially a wrapper around our [`search-ui`](../search-ui).

Params:

| name     | type                                          | description                                                                                                                                                                     |
| -------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| config   | [Config](../search-ui/README.md#driverconfig) |                                                                                                                                                                                 |
| children | function                                      | A render prop function that receives [state](../search-ui/README.md#state) and [actions](../search-ui/README.md#actions) in a flattened object<br/><br/>`state => return <div>` |

**Connectors**

Connectors are explained in the top level [README](../../README.md). The first
thing you'll need to do is configure a Connector, which lets Search UI make
all the appropriate API calls as a user interacts with your UI.

## Components

TODO List all available components here, along with their parameters

TODO Update after I add Facet

- ErrorBoundary
- Facets
- Paging
- PagingInfo
- Results
- ResultsPerPage
- SearchBox
- Sorting

## Customization

TODO: document withSearch

TODO: Use with Redux or React Router

TODO: Customize component view

TODO: Use, or don't use styles and layout
