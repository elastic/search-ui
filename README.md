<p align="center"><a href="https://circleci.com/gh/elastic/search-ui/tree/master"><img src="https://circleci.com/gh/elastic/search-ui/tree/master.svg?style=svg&circle-token=c637bc2af60035a1f4cb5367071999ced238be76" alt="CircleCI buidl"></a>
<img src="https://img.shields.io/badge/version-beta-red.svg" alt="BETA" />
<a href="https://gitter.im/elastic-search-ui/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge"><img src="https://badges.gitter.im/elastic-search-ui/community.svg" alt="Gitter" /></a></p>

> Libraries for the fast development of modern, engaging search experiences. :tada:

## Contents

- [About Search UI](#about-search-ui-rocket)
- [Getting started](#getting-started-)
- [Configuration](#configuration)
- [Customization](#customization)
- [FAQ](#faq-)
- [Contribute](#contribute-)
- [License](#license-)

---

## About Search UI :rocket:

Search UI allows you to quickly implement search experiences without re-inventing the wheel.

It supports **[React](https://reactjs.org)** and **works with any search API**.

### Features :+1:

- **You know, for search**: Maintained by [Elastic](https://elastic.co), the team behind Elasticsearch.
- **Speedy Implementation** - Build search with a search box, results view, sorting, and more, with a few lines of code.
- **Customizable** - Tune the Components, markup, styles, and behaviors to your liking.
- **Smart URLs** - Searches, paging, filtering, and more, are captured in the URL for direct result linking.
- **Headless** - Leverage our application logic, provide your own Components or views.
- **Flexible** - Not just for React. Use with any JavaScript library, even vanilla JavaScript.

<img src="packages/react-search-ui/resources/screenshot.png" width="600">

## Getting started 🐣

**Looking for a great search API?** [Elastic App Search](https://www.elastic.co/cloud/app-search-service) has a slick dashboard, powerful features, and leading relevance.

Install the **React Search UI** and the **App Search** connector.

```sh
# Install React Search UI and a Connector, like the Elastic App Search Connector
npm install --save @elastic/react-search-ui @elastic/search-ui-app-search-connector
```

_Note: The Search UI is in beta. We do not recommend production use._

## Creating a Search UI

<a id="search-ui"></a>

Use out of the box components, styles, and layouts to build a search experience quickly.

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

Or go headless:

```jsx
<SearchProvider config={config}>
  {({ searchTerm, setSearchTerm, results }) => {
    return (
      <div>
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {results.map(r => (
          <div key={r.id.raw}>{r.title.raw}</div>
        ))}
      </div>
    );
  }}
</SearchProvider>
```

A search UI is made up of four key areas, which you can expand and customize:

1. [Connectors](#1-connectors)
2. [SearchProvider](#2-searchprovider)
3. [Components](#3-components)
4. [Styles and Layout](#4-styles-and-layout)

---

### 1. Connectors

Connectors are modules that tell Search UI how to connect and communicate with a particular API.

Search UI currently provides two Connectors:

1. **Elastic App Search**: [search-ui-app-search-connector](packages/search-ui-app-search-connector)
2. **Elastic Site Search**: [search-ui-site-search-connector](packages/search-ui-site-search-connector)

The [example search UI](#search-ui) above uses the Elastic App Search Connector:

```js
const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  hostIdentifier: "host-2376rb"
});
```

Search UI can connect to **any** web based Search API. Read [the advanced README](./ADVANCED.md#build-your-own-connector) for more information.

### 2. SearchProvider

The `SearchProvider` object will tie all of your Components together so that they work as a cohesive application.

It's where you configure your UI, acting as the state manager between "State" and "Actions".

The overall flow is like this:

```
Components -> SearchProvider -> Connector -> Search API (App Search)
```

1. A user takes an action - like submitting a search box or applying a filter - using a Component.

2. `SearchProvider` will trigger an API call via the Connector you've configured to fetch search results.

`SearchProvider` is lightweight:

```jsx
<SearchProvider
  config={{
    apiConnector: connector
  }}
>
  {() => <div className="App">{/* Place Components here! */}</div>}
</SearchProvider>
```

But it's deeply configurable.

Read the [Advanced Configuration Guide](./ADVANCED.md#advanced-configuration).

### 3. Components

Components are the building blocks from which craft your search experience.

Each Component - like `SearchBox` and `Results` - is a child of the `SearchProvider` object:

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

- SearchBox
- Results
- ResultsPerPage
- Facet
- Sorting
- Paging
- PagingInfo
- ErrorBoundary

Read the [Component Reference](./ADVANCED.md#component-reference) for a breakdown.

### 4. Styles and Layout

For basic styles, include:

```jsx
import "@elastic/react-search-ui-views/lib/styles/styles.css";
```

For a basic layout, which helps quickly get a UI bootstrapped, use the [Layout](packages/react-search-ui-views/src/layouts/Layout.js) Component.

```jsx
import { Layout } from "@elastic/react-search-ui-views";

<Layout header={<SearchBox />} bodyContent={<Results />} />;
```

The provided styles and layout can be found in the [react-search-ui-views](packages/react-search-ui-views) package.

Read the [Customization guide](./ADVANCED.md#customization) for more details.

## FAQ 🔮

### Where can I learn more?

The [Advanced README](./ADVANCED.md) contains several useful guides. :sunglasses:

### Is Search UI only for React?

Nope. Search UI is "headless".

You can write support for it into any JavaScript framework. You can even use vanilla JavaScript.

[Read the Headless Core Guide](./ADVANCED.md#customization) for more information.

### Can I build my own Components?

Yes! Absolutely.

Check out the [Build Your Own Component Guide](./ADVANCED.md#build-your-own-component).

### Does Search UI only work with App Search?

Nope! We do have two first party connectors: Site Search and App Search.

But Search UI is headless. You can use _any_ search API.

Read the [Build Your Own Connector Guide](./ADVANCED.md#build-your-own-connector) to learn more.

### Where do I report issues with the Search UI?

If something is not working as expected, please open an [issue](https://github.com/elastic/search-ui/issues/new).

### Where can I go to get help?

Connect with the community and maintainers directly on [Gitter](https://gitter.im/elastic-search-ui/community).

If you are using an Elastic product as your connector, try the Elastic community...

- [Elastic App Search discuss forums](https://discuss.elastic.co/c/app-search)
- [Elastic Site search discuss forums](https://discuss.elastic.co/c/site-search)

## Contribute 🚀

We welcome contributors to the project. Before you begin, a couple notes...

- Read the [Search UI Contributor's Guide](./ADVANCED.md#search-ui-contributors-guide).
- Prior to opening a pull request, please create an issue to [discuss the scope of your proposal](https://github.com/elastic/search-ui/issues).
- Please write simple code and concise documentation, when appropriate.

## License 📗

[Apache-2.0](https://github.com/elastic/search-ui/blob/master/LICENSE) © [Elastic](https://github.com/elastic)

Thank you to all the [contributors](https://github.com/elastic/search-ui/graphs/contributors)!
