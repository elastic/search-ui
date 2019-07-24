<p align="center"><a href="https://circleci.com/gh/elastic/search-ui/tree/master"><img src="https://circleci.com/gh/elastic/search-ui/tree/master.svg?style=svg&circle-token=c637bc2af60035a1f4cb5367071999ced238be76" alt="CircleCI buidl"></a>
<a href="https://gitter.im/elastic-search-ui/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge"><img src="https://badges.gitter.im/elastic-search-ui/community.svg" alt="Gitter" /></a></p>

> Libraries for the fast development of modern, engaging search experiences. :tada:

## Contents

- [About Search UI](#about-search-ui-rocket)
- [Getting started](#getting-started-)
- [Creating a search experience](#creating-a-search-experience)
- [FAQ](#faq-)
- [Contribute](#contribute-)
- [License](#license-)

---

## About Search UI :rocket:

A **[React](https://reactjs.org)** library that allows you to quickly implement search experiences without re-inventing the wheel.

Use it with [**Elastic App Search**](https://www.elastic.co/cloud/app-search-service?ultron=searchui-repo&blade=readme&hulk=product) or
[**Elastic Site Search**](https://www.elastic.co/cloud/site-search-service?ultron=searchui-repo&blade=readme&hulk=product) to have a
search experience up and running in minutes.

### Features :+1:

- **You know, for search** - Maintained by [Elastic](https://elastic.co), the team behind Elasticsearch.
- **Speedy Implementation** - Build a complete search experience with a few lines of code.
- **Customizable** - Tune the components, markup, styles, and behaviors to your liking.
- **Smart URLs** - Searches, paging, filtering, and more, are captured in the URL for direct result linking.
- **Headless** - Leverage our application logic, provide your own components or views.
- **Flexible front-end** - Not just for React. Use with any JavaScript library, even vanilla JavaScript.
- **Flexible back-end** - Not just for Elastic App Search. Use with any backend.

<img src="packages/react-search-ui/resources/screenshot.png" width="600">

### Live Demo

Checkout the [live demo of Search UI](https://search-ui-stable.netlify.com).

[![Edit search-ui-national-parks-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/national-parks-example-kdyms?fontsize=14)

## Getting started 🐣

Install **React Search UI** and the **App Search** connector.

```sh
# Install React Search UI and a Connector, like the Elastic App Search Connector
npm install --save @elastic/react-search-ui @elastic/search-ui-app-search-connector
```

## Creating a search experience

<a id="search-ui"></a>

Use out of the box components, styles, and layouts to build a search experience in a matter of minutes.

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
      <div className="App">
        <Layout
          header={<SearchBox />}
          bodyContent={<Results titleField="title" urlField="nps_link" />}
        />
      </div>
    </SearchProvider>
  );
}
```

Or go "headless", and take complete control over the look and feel of your search experience.

```jsx
<SearchProvider config={config}>
  <WithSearch
    mapContextToProps={({ searchTerm, setSearchTerm, results }) => ({
      searchTerm,
      setSearchTerm,
      results
    })}
  >
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
  </WithSearch>
</SearchProvider>
```

A search experience built with Search UI is composed of the following layers:

1. [A Search API](#1-search-api)
2. [A Connector](#2-connectors)
3. [A SearchProvider](#3-searchprovider)
4. [Components](#4-components)
5. [Styles and Layout](#5-styles-and-layout)

```
Styles and Layout -> Components -> SearchProvider -> Connector -> Search API
```

---

### 1. Search API

A Search API is any API that you use to search data.

We recommend [**Elastic App Search**](https://www.elastic.co/cloud/app-search-service?ultron=searchui-repo&blade=readme&hulk=product).

It has Elasticsearch at its core, offering refined search UIs, robust documentation, and accessible dashboard tools.

You can start a [14 day trial of the managed service](https://www.elastic.co/cloud/app-search-service?ultron=searchui-repo&blade=readme&hulk=product) or [host the self managed package for free](https://www.elastic.co/downloads/app-search?ultron=searchui-repo&blade=readme&hulk=product).

Once your data is indexed into App Search or a similar service, you're good to go.

### 2. Connectors

A connector is a module that tell Search UI how to connect and communicate with your Search API.

It generates Search API calls for you so that Search UI will "just work", right out of the box.

```js
const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  hostIdentifier: "host-2376rb"
});
```

_Read the [advanced README](./ADVANCED.md#build-your-own-connector) to learn how to build a connector for any Search API._

### 3. SearchProvider

`SearchProvider` is the top level component in your Search UI implementation.

It is where you configure your search experience and it ties all of your components together, so that they work as a cohesive application.

```jsx
<SearchProvider
  config={{
    apiConnector: connector
  }}
>
  <div className="App">{/* Place Components here! */}</div>
</SearchProvider>
```

While components can be handy, a search experience can have requirements that don't quite fit what components provide "out of the box". Use `WithSearch` to access "actions" and "state" in a [Render Prop](https://reactjs.org/docs/render-props.html), giving you maximum flexibility over the experience.

```jsx
<SearchProvider
  config={{
    apiConnector: connector
  }}
>
  <WithSearch
    mapContextToProps={({ searchTerm, setSearchTerm }) => ({
      searchTerm,
      setSearchTerm
    })}
  >
    {({ searchTerm, setSearchTerm }) => (
      <div className="App">{/* Work directly with state and actions! */}</div>
    )}
  </WithSearch>
</SearchProvider>
```

_Read the [Advanced Configuration Guide](./ADVANCED.md#advanced-configuration) or learn more about the state management and the [Headless Core](./ADVANCED.md#headless-core)._

### 4. Components

Components are the building blocks from which you craft your search experience.

Each Component - like `SearchBox` and `Results` - is a child of the `SearchProvider` object:

```jsx
<SearchProvider
  config={{
    apiConnector: connector
  }}
>
  <div className="App">
    <div className="Header">
      <SearchBox />
    </div>
    <div className="Body">
      <Results titleField="title" urlField="nps_link" />
    </div>
  </div>
</SearchProvider>
```

The following Components are available:

- SearchBox
- Results
- Result
- ResultsPerPage
- Facet
- Sorting
- Paging
- PagingInfo
- ErrorBoundary

_Read the [Component Reference](./ADVANCED.md#component-reference) for a full breakdown._

### 5. Styles and Layout

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

_Read the [Customization guide](./ADVANCED.md#customization) for more design details._

## FAQ 🔮

### Where can I learn more?

The [Advanced README](./ADVANCED.md) contains several useful guides. :sunglasses:

### Is Search UI only for React?

Nope. Search UI is "headless".

You can write support for it into any JavaScript framework. You can even use vanilla JavaScript.

[Read the Headless Core Guide](./ADVANCED.md#headless-core) for more information, or check out the [Vue.js Example](https://github.com/elastic/vue-search-ui-demo).

### Can I use my own styles?

You can!

Read the [Custom Styles and Layout Guide](./ADVANCED.md#custom-styles-and-layout) to learn more, or check out the [Seattle Indies Expo Demo](https://github.com/elastic/seattle-indies-expo-search).

### Can I build my own Components?

Yes! Absolutely.

Check out the [Build Your Own Component Guide](./ADVANCED.md#build-your-own-component).

### Does Search UI only work with App Search?

Nope! We do have two first party connectors: Site Search and App Search.

But Search UI is headless. You can use _any_ Search API.

Read the [Connectors and Handlers Guide](./ADVANCED.md#connectors-and-handlers).

### How do I use this with Elasticsearch?

First off, we should mention that it is not recommended to make API calls directly to Elasticsearch
from a browser, as noted in the [elasticsearch-js client](https://github.com/elastic/elasticsearch-js#browser).

The safest way to interact with Elasticsearch from a browser is to make all Elasticsearch queries server-side. Or you can use [Elastic App Search](https://www.elastic.co/cloud/app-search-service?ultron=searchui-repo&blade=readme&hulk=product), which can create public, scoped API credentials and be exposed directly to a browser.

That being said, Search UI will still work with Elasticsearch (or any other API, for that matter). Read the
[Connectors and Handlers Guide](./ADVANCED.md#connectors-and-handlers) to learn more, or check out the
[Elasticsearch Example](./examples/elasticsearch).

### Where do I report issues with the Search UI?

If something is not working as expected, please open an [issue](https://github.com/elastic/search-ui/issues/new).

### Where can I go to get help?

Connect with the community and maintainers directly on [Gitter](https://gitter.im/elastic-search-ui/community).

If you are using an Elastic product as your connector, try the Elastic community...

- [Elastic App Search discuss forums](https://discuss.elastic.co/c/app-search)
- [Elastic Site Search discuss forums](https://discuss.elastic.co/c/site-search)

## Contribute 🚀

We welcome contributors to the project. Before you begin, a couple notes...

- Read the [Search UI Contributor's Guide](./CONTRIBUTING.md).
- Prior to opening a pull request, please:
  - Create an issue to [discuss the scope of your proposal](https://github.com/elastic/search-ui/issues).
  - Sign the [Contributor License Agreement](https://www.elastic.co/contributor-agreement/). We are not asking you to assign copyright to us, but to give us the right to distribute your code without restriction. We ask this of all contributors in order to assure our users of the origin and continuing existence of the code. You only need to sign the CLA once.
- Please write simple code and concise documentation, when appropriate.

## License 📗

[Apache-2.0](https://github.com/elastic/search-ui/blob/master/LICENSE) © [Elastic](https://github.com/elastic)

Thank you to all the [contributors](https://github.com/elastic/search-ui/graphs/contributors)!
