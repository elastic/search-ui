---
navigation_title: "Connectors API"
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/api-connectors-app-search.html
---

# App Search Connector [api-connectors-app-search]


::::{admonition} Deprecation Notice
:class: important

App Search connector for Search UI is deprecated and will no longer be supported. Please migrate to [Elasticsearch Connector](/reference/tutorials-elasticsearch.md) for continued support.

::::


This Connector is used to connect Search UI to Elastic’s [App Search](https://www.elastic.co/cloud/app-search-service) API.


## Usage [api-connectors-app-search-usage]

```shell
npm install --save @elastic/search-ui-app-search-connector
```

```js
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  endpointBase: "http://127.0.0.1:3002"
});
```


### Additional options [api-connectors-app-search-additional-options]

Additional options will be passed through to the underlying [APIclient](https://github.com/elastic/app-search-javascript). Any valid parameter of the client can be used.

```js
const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  endpointBase: "http://127.0.0.1:3002",
  cacheResponses: false
});
```


## Options [api-connectors-app-search-options]

| Param | Description |
| --- | --- |
| searchKey | Required. String. Credential found in your App Search Dashboard |
| engineName | Required. String. Engine to query, found in your App Search Dashboard |
| endpointBase | Required. String. Endpoint path, found in your App Search Dashboard |
| cacheResponses | Optional. Boolean. Default is true. By default, connector will keep an in browser memory result cache of previous requests. |
| hostIdentifier | Optional. Useful when proxying the Swiftype API or developing against a local API server. |
| beforeSearchCall | Optional. A hook to amend query options before the request is sent to the API in a query on an "onSearch" event. |
| beforeAutocompleteResultsCall | Optional. A hook to amend query options before the request is sent to the API in a "results" query on an "onAutocomplete" event. |
| beforeAutocompleteSuggestionsCall | Optional. A hook to amend query options before the request is sent to the API in a "suggestions" query on an "onAutocomplete" event. |




