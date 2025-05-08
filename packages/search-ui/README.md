# search-ui

Part of the [Search UI](https://github.com/elastic/search-ui) project.

The "Headless Search UI" that serves as a foundation for the [react-search-ui](../react-search-ui/README.md) library.

If you are not using React, this library can be used in conjunction with
any other framework. Instead of working with components as you do in React, you simply work directly with state and actions. These are documented in the [State](https://docs.elastic.co/search-ui/api/core/state) and [Actions](https://docs.elastic.co/search-ui/api/core/actions) sections of the documentation.

You'll get all of the benefit of Search UI, just with no view. The view is up to you.

## Usage with Elasticsearch Connector

```shell
npm install --save @elastic/search-ui @elastic/search-ui-elasticsearch-connector
```

```js
import { SearchDriver } from "@elastic/search-ui";
import ElasticSearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const connector = new ElasticSearchAPIConnector({
  host: "https://your-elasticsearch-host:9243",
  index: "your-index",
  apiKey: "your-api-key" // Optional
});

const config = {
  apiConnector: connector
};

const driver = new SearchDriver(config);

driver.subscribeToStateChanges((state) =>
  console.log(`Received ${state.totalResults} results for your search!`)
);

driver.getActions().setSearchTerm("canyon");

// Received 8 results for your search!
```

## Configuration

All configuration is documented in the [Configuration](https://docs.elastic.co/search-ui/api/core/configuration) section
of the Advanced README.

## SearchDriver Usage

### Methods

| method                    | params   | return                                                        | description                                                          |
| ------------------------- | -------- | ------------------------------------------------------------- | -------------------------------------------------------------------- |
| `subscribeToStateChanges` | function |                                                               | Function to execute when state changes. ex.<br/><br/>`(state) => {}` |
| `getActions`              |          | [Actions](https://docs.elastic.co/search-ui/api/core/actions) | All available actions.                                               |
| `getState`                |          | [State](https://docs.elastic.co/search-ui/api/core/state)     | Current state.                                                       |
