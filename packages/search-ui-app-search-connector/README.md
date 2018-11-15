# search-ui-app-search-connector

This Connector is used to connect Search UI to Elastic's [App Search](https://www.elastic.co/cloud/app-search-service) API.

## Usage

```shell
npm install --save import @elastic/search-ui-app-search-connector
```

```js
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

const connector = new AppSearchAPIConnector({
  searchKey: "search-soaewu2ye6uc45dr8mcd54v8",
  engineName: "national-parks-demo",
  hostIdentifier: "host-2376rb"
});
```

### Methods

TODO Properly document interface once we decide what this interface should look like

| method   | params                                             | return | description |
| -------- | -------------------------------------------------- | ------ | ----------- |
| `click`  | `props` - Object                                   |        |             |
|          | - `query` - String                                 |        |             |
|          | - `documentId` - String                            |        |             |
|          | - `requestId` - String                             |        |             |
|          | - `tags` - Array[String]                           |        |             |
| `search` | `searchTerm` - String<br/>`searchOptions` - Object |        |             |
