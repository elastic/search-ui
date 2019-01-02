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

### Methods

| method   | params                                             | return                    | description |
| -------- | -------------------------------------------------- | ------------------------- | ----------- |
| `click`  | `props` - Object                                   |                           |             |
|          | - `query` - String                                 |                           |             |
|          | - `documentId` - String                            |                           |             |
|          | - `requestId` - String                             |                           |             |
|          | - `tags` - Array[String]                           |                           |             |
| `search` | `searchTerm` - String<br/>`searchOptions` - Object | [ResultList](#resultlist) |             |

### ResultList<a id="resultlist"></a>

| field        | type                             | description                                                                                      |
| ------------ | -------------------------------- | ------------------------------------------------------------------------------------------------ |
| `rawResults` | Array[Object]                    | Raw list of result data: [Reference](https://swiftype.com/documentation/app-search/api/search)   |
| `results`    | Array[[ResultItem](#resultItem)] |                                                                                                  |
| `info`       | Object                           | `meta` data from response: [Reference](https://swiftype.com/documentation/app-search/api/search) |

### ResultItem<a id="resultItem"></a>

| field        | type             | description                                                                            |
| ------------ | ---------------- | -------------------------------------------------------------------------------------- |
| `data`       | Array[Object]    | Raw result data: [Reference](https://swiftype.com/documentation/app-search/api/search) |
| `getRaw`     | Function(String) | Convenience function for getting raw field data                                        |
| `getSnippet` | Function(String) | Convenience function for getting snippet field data                                    |
