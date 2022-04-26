# search-ui

Part of the [Search UI](https://github.com/elastic/search-ui) project.

The "Headless Search UI" that serves as a foundation for the [react-search-ui](../react-search-ui/README.md) library.

If you are not using React, this library can be used in conjunction with
any other framework. Instead of working with components as you do in React, you simply work directly with state and actions. These are documented in the [Headless core](https://docs.elastic.co/search-ui/guides/philosophy) section of the Advanced README.

You'll get all of the benefit of Search UI, just with no view. The view is up to you.

## Usage

```shell
npm install --save @elastic/search-ui
```

```js
import { SearchDriver } from "@elastic/search-ui";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  hostIdentifier: "host-2376rb"
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

All configuration is documented in the [Configuration](https://docs.elastic.co/search-ui/api/configuration) section
of the Advanced README.

## SearchDriver Usage

### Methods

| method                    | params   | return                                                   | description                                                          |
| ------------------------- | -------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| `subscribeToStateChanges` | function |                                                          | Function to execute when state changes. ex.<br/><br/>`(state) => {}` |
| `getActions`              |          | [Actions](https://docs.elastic.co/search-ui/api/actions) | All available actions.                                               |
| `getState`                |          | [State](https://docs.elastic.co/search-ui/api/state)     | Current state.                                                       |
