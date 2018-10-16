# Search UI

A flexible JavaScript library for building search experiences.

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

This is the top level workspace for all of the related libraries. You won't find any code here, to find individual libraries, look in the [packages](packages) directory.

## What it looks like

If you're using React, it can be as simple as this:

```jsx
<AppSearchProvider driver={appSearchConnector}>
  <SearchBox />
  <Sorting
    sortOptions={[
      {name: "Relevance", value: "", direction: ""},
      {name: "Published", value: "published_at", direction: "desc"}
    ]}
  />
  <Facets>
    <Facet field="author" label="Author" />
    <Facet field="title" label="Title" />
  </Facets>
</AppSearchProvider>
```

That's it. We'll handle all of the state management, API calls, and url management for you. All you need to do is compose the UI.

Using JQuery? No problem, we're flexible.

```javascript

new SearchBox(".search-box", appSearchConnector);
new Sorting(".sorting", appSearchConnector, {
  sortOptions: [
    {name: "Relevance", value: "", direction: ""},
    {name: "Published", value: "published_at", direction: "desc"}
  ]
});
new Facet(".author-facet", appSearchConnector, {
  field: "author",
  label: "Author"
});
new Facet(".title-facet", appSearchConnector, {
  field: "title",
  label: "Title"
});
```

Using some other framework? Just using vanilla JavaScript? Using [elasticsearch](https://www.elastic.co/products/elasticsearch)? We support just about any configuration. Read on to learn more.

## Quick Start

We'll point you in the right direction, depending on your setup:

First off, what framework are you using?
- [React](packages/react-search-app)
- [JQuery](packages/jquery-search-app)
- [None of the above](packages/search-app)

What search service are you using?

- [Elastic App Search](packages/search-app-app-search-connector)
- [Elastic Site Search](packages/search-app-site-search-connector)
- [elasticsearch](packages/search-app-elasticsearch-connector)

"I'm just looking for some snazzy looking UI components, I don't care about state management, and I'm using..."

- [React](packages/react-search-components)
- [JQuery](packages/jquery-search-components)

## Overview

Search UI is built in layers, which allows you to find the right level of abstraction for your particular use case.

### search-app
At the heart of the library is [search-app](packages/search-app), which we refer to as a "Headless Search Experience". It handles all of the state management concerns of a search experience, and simply exposes that state as a `state` objects and a group of `actions` to act on that state. If you've used Redux before, you will feel right at home using `search-app`. It is built with plain old javascript, and serves as the heart of our React and JQuery libraries, but can also be used independently if you are using another framework, or just vanilla JavaScript.

### search service connectors
`search-app` expects a REST API to be available for searching. We'd like to be able to use this
library with any number of APIs, including Elastic's [Site Search](https://www.elastic.co/cloud/site-search-service), [App Search](https://www.elastic.co/cloud/app-search-service), and [elasticsearch](https://www.elastic.co/products/elasticsearch). We provide connectors for [each](packages/search-app-site-search-connector) of [those](packages/search-app-app-search-connector) [services](packages/search-app-elasticsearch-connector). Don't see your search service on this list? Just create a new connector!

### framework support

If you're using this library, you're most likely using it within a framework like React. We currently have first class support for both [React](packages/react-search-components) and [JQuery](packages/jquery-search-components).
