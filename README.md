# Search UI

A flexible collection of JavaScript libraries for building search experiences.

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

This is the top level workspace for all Search UI libraries. You won't find any code here; to find individual libraries, look in the [packages](packages) directory.

## What Search UI Provides

- Component-based libraries to quickly compose search experiences
- Full state management with optional URL synchronization
- API Connectors so that you can use this with any Search API
- Optional layers of abstraction that let you customize and integrate at a level that suits your needs

## Quick Start

Pick an [Implementation](#implementation), and a [Connector](#connectors), then get to work:

```sh
npm install --save @elastic/react-search-ui @elastic/search-ui-app-search-connector
```

```jsx
import React from "react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import { SearchProvider, Results, SearchBox } from "@elastic/react-search-ui";

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
          <SearchBox />
          <Results />
        </div>
      )}
    </SearchProvider>
  );
}
```

## Libraries

### The main Framework Implementations <a id="implementation"></a>

These are our full featured, framework specific libraries.

- [react-search-ui](packages/react-search-ui)
- [jquery-search-ui](packages/jquery-search-ui)

### The core

Both `react-search-ui` and `jquery-search-ui` are built on top of `search-ui`. If you're
using some other framework, or just want a lower-level API, you can still leverage
the core `search-ui` library to build a great search experience.

- [search-ui](packages/search-ui)

### The Service Connectors <a id="connectors"></a>

Search UI can be used on top of any search API ... as long as there is a connector
for it. We provide the following:

- [search-ui-app-search-connector](packages/search-ui-app-search-connector)
- [search-ui-site-search-connector](packages/search-ui-site-search-connector)
- [search-ui-elasticsearch-connector](packages/search-ui-elasticsearch-connector)

We also provide our views in standalone libraries. You'll find our component
markup and CSS here. If you'd like to simply leverage some out of the box styles
in your own app, feel free to use them.

- [React](packages/react-search-components)
- [JQuery](packages/jquery-search-components)

## A bit more about the technical design

```
  +--------------------+
  | Search Service API | (elasticsearch, etc.)
  +--------------------+
      ^
      |
      |
  +-------------------+
  | Service Connector | (search-ui-elasticsearch-connector, etc.)
  +-------------------+
      ^ (common connector interface)
      |
      |
    (State manager)       (Syncs state with URL)
  +--------------+        +--------------+
  | Search UI    | <----> | URL Manager  |
  +--------------+        +--------------+
      |
      | (actions / state)
      v
  +-----------------+
  | Implementation  | (react-search-ui, etc.)
  +-----------------+
      |
      v
  +------------+
  | Components | (react-search-components, etc.)
  +------------+
```

### Search UI

At the heart of the library is [search-ui](packages/search-ui), which we refer to as a "Headless Search Experience". It handles all of the state management concerns of a search experience, and simply exposes that state as a `state` objects and a group of `actions` to act on that state. If you've used Redux before, you will feel right at home using `search-ui`. It is built with plain old javascript, and serves as the base for our Framework Implementations, but can also be used independently if you are using another framework, or just vanilla JavaScript.

### Framework Integrations

Our integrations provide first class support for [React](packages/react-search-components) and [JQuery](packages/jquery-search-components). They provide out of the box components that you can use to
easily compose a search experience.

### Service Connectors

[search-ui](packages/search-ui) expects an API to be available for searching. We'd like to be able to use this
library with any number of APIs, including Elastic's [Site Search](https://www.elastic.co/cloud/site-search-service), [App Search](https://www.elastic.co/cloud/app-search-service), and [elasticsearch](https://www.elastic.co/products/elasticsearch). We provide connectors for [each](packages/search-ui-site-search-connector) of [those](packages/search-ui-app-search-connector) [services](packages/search-ui-elasticsearch-connector).

### Components

Our Framework Integrations are technically "Headless". They provide no view of their own,
they use views and styles provided by our component libraries.

## Development

### Setup

```shell
git clone git@github.com:elastic/search-ui.git
npm install
npx lerna bootstrap
```

### Testing

All packages:

```shell
# from project root
npm run test
```

Single package:

```shell
# from inside a package
npm run test
```

### Building

All packages:

```shell
# from project root
npm run build
```

Single package:

```shell
# from inside a package
npm run build
```
