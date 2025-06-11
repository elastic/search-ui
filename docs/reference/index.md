---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/overview.html
applies_to:
  stack:
  serverless:
---

# Search UI

Search UI is a JavaScript library for building modern, customizable search experiences using Elastic as a backend. Maintained by the Elastic team, it helps you implement search interfaces with minimal boilerplate.

As a headless library, Search UI separates logic from presentation. It provides search state and actions you can use with React, vanilla JavaScript, or other frameworks like Vue.

## Live demos 👀 [overview-live-demos]

### Connectors [overview-connectors]

- [Elasticsearch](https://codesandbox.io/s/github/elastic/search-ui/tree/main/examples/sandbox?file=%2Fsrc%2Fpages%2Felasticsearch-basic%2Findex.jsx): Browser-only implementation
- [Elasticsearch](https://codesandbox.io/s/github/elastic/search-ui/tree/main/examples/sandbox?file=%2Fsrc%2Fpages%2Felasticsearch-production-ready%2Findex.jsx): Production-ready implementation, using proxy connector
- [Elastic Site Search (Swiftype)](https://codesandbox.io/s/github/elastic/search-ui/tree/main/examples/sandbox?file=%2Fsrc%2Fpages%2Fsite-search%2Findex.jsx)

### Examples [overview-examples]

- [Search as you type](https://codesandbox.io/s/github/elastic/search-ui/tree/main/examples/sandbox?file=%2Fsrc%2Fpages%2Fsearch-as-you-type%2Findex.jsx)
- [Search bar in header](https://codesandbox.io/s/github/elastic/search-ui/tree/main/examples/sandbox?file=%2Fsrc%2Fpages%2Fsearch-bar-in-header%2Findex.jsx)
- [Customizing Styles and Components](https://codesandbox.io/s/github/elastic/search-ui/tree/main/examples/sandbox?file=%2Fsrc%2Fpages%2Fcustomizing-styles-and-html%2Findex.jsx)

## Get Started 🌟 [overview-get-started]

### Installation [overview-installation]

```sh
npm install @elastic/search-ui @elastic/react-search-ui @elastic/react-search-ui-views
# or
yarn add @elastic/search-ui @elastic/react-search-ui @elastic/react-search-ui-views
```

### Tutorials 📘 [overview-tutorials]

:::{note}

Search UI can connect to Serverless using a backend proxy. In this setup, the frontend uses the `ApiProxyConnector` to send requests to your backend, which then forwards them to Elasticsearch. Direct browser connections to Serverless are not supported due to CORS restrictions.

[See our guide for using Search UI in production](./tutorials-elasticsearch-production-usage.md) for a full example of this setup.
:::

Get started quickly with Search UI and your favorite Elastic product by following one of the tutorials below:

- [Elasticsearch](./tutorials-elasticsearch.md)
- ⚠️ DEPRECATED [Elastic App Search](./tutorials-app-search.md)
- ⚠️ DEPRECATED [Elastic Workplace Search](./tutorials-workplace-search.md)

## [Ecommerce 📦](./ecommerce.md)

Guides for implementing ecommerce use cases using Search UI components.

- [Autocomplete](./solutions-ecommerce-autocomplete.md): Add real-time query and product suggestions to your search box.
- [Product Carousels](./solutions-ecommerce-carousel.md): Display horizontal lists of products, like 'Best Rated' or 'On Sale'.
- [Category Page](./solutions-ecommerce-category-page.md): Filter and explore products in a specific category using facets.
- [Product Detail Page](./solutions-ecommerce-product-detail-page.md): Enrich product pages with cross-sell suggestions and related items.
- [Search Page](./solutions-ecommerce-search-page.md): Show full search results with options for sorting, filters, and variants.

## [Basic usage ⚙️](./basic-usage.md)

Quick-start guides for common Search UI tasks like styling, header placement, search behavior, and debugging.

- [Using search-as-you-type](./guides-using-search-as-you-type.md): Trigger a search request with each keystroke using the `searchAsYouType` prop.
- [Adding a search bar to a header](./guides-adding-search-bar-to-header.md): Place a search bar in the site header and redirect queries to a results page.
- [Debugging](./guides-debugging.md): Enable debug mode to inspect actions and state changes in the browser console.

## [Advanced usage 🛠️](./advanced-usage.md)

Learn how to customize component behavior, build your own UI components, connect to any backend, and integrate Search UI with frameworks like Vue and Next.js.

- [Conditional Facets](./guides-conditional-facets.md): Show or hide facets based on selected filters.
- [Changing component behavior](./guides-changing-component-behavior.md): Override default logic using `mapContextToProps` or custom props.
- [Analyzing performance](./guides-analyzing-performance.md): Measure and analyze your search experience’s performance using browser and React profiling tools.
- [Building a custom connector](./guides-building-custom-connector.md): Use Search UI with any backend by implementing a connector.
- [Next.js integration](./guides-nextjs-integration.md): Use Search UI with server-side rendering in Next.js apps.

## [API reference 📚](./api-reference.md)

### [Core API](./api-core-index.md)

Configuration, state, and actions that power the search experience.

- [Configuration](./api-core-configuration.md)
- [State](./api-core-state.md)
- [Actions](./api-core-actions.md)

### [React API](./api-react-search-provider.md)

React-specific utilities for accessing and interacting with the Core API.

- [WithSearch & withSearch](./api-react-with-search.md)
- [useSearch hook](./api-react-use-search.md)

## [React components 🧩](./api-react-components-search-box.md)

Search UI includes a set of ready-to-use React components for building your search interface. This section documents each component's API and customization options.

- [Results](./api-react-components-results.md)
- [Result](./api-react-components-result.md)
- [ResultsPerPage](./api-react-components-results-per-page.md)
- [Facet](./api-react-components-facet.md)
- [Sorting](./api-react-components-sorting.md)
- [Paging](./api-react-components-paging.md)
- [PagingInfo](./api-react-components-paging-info.md)
- [ErrorBoundary](./api-react-components-error-boundary.md)

## Connectors API 🔌

Built-in connectors let Search UI talk to Elastic backends. This section documents how to configure each connector, including usage examples and integration details.

- [Elasticsearch Connector](./api-connectors-elasticsearch.md): Connect directly to Elasticsearch indices using cloud or self-managed instances.
- [Site Search Connector](./api-connectors-site-search.md): Use Elastic Site Search as a backend. Note: Some advanced Search UI features are not supported.
- ⚠️ DEPRECATED [Workplace Search Connector](./api-connectors-workplace-search.md): Legacy connector for Elastic Workplace Search.
- ⚠️ DEPRECATED [App Search Connector](./api-connectors-app-search.md): Legacy connector for Elastic App Search.

## Plugins 🧪

- ⚠️ DEPRECATED [Analytics Plugin](./api-core-plugins-analytics-plugin.md): Track user behavior and send events to Elastic Behavioral Analytics.

## Known issues 🛠️

- [Known issues](./known-issues.md)

## License 📗 [overview-license]

[Apache-2.0](https://github.com/elastic/search-ui/blob/main/LICENSE.txt) © [Elastic](https://github.com/elastic)

Thank you to all the [contributors](https://github.com/elastic/search-ui/graphs/contributors)! 🙏 🙏
