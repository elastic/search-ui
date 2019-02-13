# search-ui-app-search-connector

**NOTE: This library is in an early Beta period, it is not yet recommended for production use**

This Connector is used to connect Search UI to Elastic's [App Search](https://www.elastic.co/cloud/app-search-service) API.

## Usage

```shell
npm install --save @elastic/search-ui-app-search-connector
```

```js
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  hostIdentifier: "host-2376rb",
  additionalOptions: () => ({
    group: { field: "title" }
  })
});
```

### Configuration

| option              | type             | required? | source                                                                                                                                 |
| ------------------- | ---------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `searchKey`         | String           | required  | From your App Search Account's Credentials                                                                                             |
| `engineName`        | String           | required  | From your App Search Engine's Name                                                                                                     |
| `hostIdentifier`    | String           | required  | From your App Search Account's Credentials                                                                                             |
| `additionalOptions` | Function(Object) | optional  | A hook that allows you to inject additional, API specific configuration.<br/><br/> `currentOptions => ({ group: { field: "title" } })` |
