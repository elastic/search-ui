# search-ui-elasticsearch-connector

**NOTE: This library is in an early Beta period, it is not yet recommended for production use**

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
