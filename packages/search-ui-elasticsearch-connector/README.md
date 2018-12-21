# search-ui-app-search-connector

This Connector is used to connect Search UI to [elasticsearch](https://github.com/elastic/elasticsearch).

** NOTE: This connector is experimental and a work in progress. Do not use this in production. **

## Usage

```shell
npm install --save import @elastic/search-ui-elasticsearch-connector
```

```js
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

const connector = new ElasticsearchAPIConnector({
  indexName: "",
  host: ""
});
```

### Configuration

| option      | type   | required? | source                                     |
| ----------- | ------ | --------- | ------------------------------------------ |
| `indexName` | String | required  | From your App Search Account's Credentials |
| `host`      | String | required  | From your App Search Engine's Name         |

### Methods

| method   | params                                             | return                    | description     |
| -------- | -------------------------------------------------- | ------------------------- | --------------- |
| `click`  |                                                    |                           | Not Implemented |
| `search` | `searchTerm` - String<br/>`searchOptions` - Object | [ResultList](#resultlist) |                 |

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
