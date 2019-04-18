# search-ui

**NOTE: This library is in an early Beta period, it is not yet recommended for production use**

The "Headless Search UI" that serves as a foundation for the [react-search-ui](../react-search-ui/README.md) library.

If you are not using React, this library can be used in conjunction with
any other framework. Instead of working with components as you do in React, you simply work directly with state and actions. These are documented in the [Search UI core](#core) section of the react-search-ui
README.

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

driver.subscribeToStateChanges(state =>
  console.log(`Received ${state.totalResults} results for your search!`)
);

driver.getActions().setSearchTerm("canyon");

// Received 8 results for your search!
```

## Configuration

All configuration is documented in the [Search UI Configuration](../react-search-ui/README.md#config) section
of the `react-search-ui` README.

## SearchDriver Usage

### Methods

| method                    | params   | return                                                | description                                                          |
| ------------------------- | -------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| `subscribeToStateChanges` | function |                                                       | Function to execute when state changes. ex.<br/><br/>`(state) => {}` |
| `getActions`              |          | Object[Actions](../react-search-ui/README.md#actions) | All available actions.                                               |
| `getState`                |          | [State](../react-search-ui/README.md#state)           | Current state.                                                       |

### Does Search UI use telemetry?

If you are using the App Search or Site Search connector, we pass along 2 headers on API requests
that identify them as Search UI requests. This ONLY happens if you are using our pre-built
connectors.

Ex.

```
x-swiftype-integration: search-ui
x-swiftype-integration-version: 0.6.0
```
