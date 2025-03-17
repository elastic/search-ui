# search-ui-elasticsearch-connector

Part of the [Search UI](https://github.com/elastic/search-ui) project.

This Connector is used to connect Search UI directly to Elasticsearch.

## Usage

```shell
npm install --save @elastic/search-ui-elasticsearch-connector
```

```js
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const connector = new ElasticsearchAPIConnector({
  cloud: {
    id: "<elastic-cloud-id>"
  },
  index: "search-ui-examples", // index name where the search documents are contained
  apiKey: "apiKeyExample" // Optional. apiKey used to authorize a connection to Elasticsearch instance.
  // This key will be visible to everyone so ensure its setup with restricted privileges.
  // See Authentication section for more details.
});
```

## ElasticsearchAPIConnector

**Kind**: global class

### new ElasticsearchAPIConnector(options)

| Param   | Type                             |
| ------- | -------------------------------- |
| options | [<code>Options</code>](#Options) |

## Options

**Kind**: global typedef

| Param  | Type                | Default        | Description                                                                                                                                     |
| ------ | ------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| cloud  | <code>Object</code> | { id: string } | Elastic cloud configuration. Can be found in your cloud deployment dashboard.                                                                   |
| host   | <code>string</code> |                | Elasticsearch host.                                                                                                                             |
| index  | <code>string</code> |                | Index name for where the search documents are contained in                                                                                      |
| apiKey | <code>string</code> |                | Optional. Credential thats setup within Kibana's UI. see [kibana API keys guide](https://www.elastic.co/guide/en/kibana/current/api-keys.html). |

## Query Configuration Requirements

- `search_fields` object is required with all fields you want to search by.

## Connection & Authentication

This connector will talk to the elasticsearch instance directly from the browser. This requires further additional steps to keep your Elasticsearch instance secure as possible. You have the following options available to you to keep any sensitive data protected

### Proxy the \_search API call through your API

This envolves building an API route that will proxy the elasticsearch call through your API. During the proxy, you are able to:

- Ability to add any additional authentication headers / keys as you proxy the request through the API and to Elasticsearch.
- Update the elasticsearch query request to add any filters to filter restricted documents
- Application performance monitoring of functionality
- Your own user based authentication for your API
- Add a caching layer between the API and Elasticsearch

To do this, provide the host to be the location of the API. Example `host: "https://search.acme.co/search", index: "movies"`. In this example, you would need to implement a POST endpoint for `https://search.acme.co/search/movies/_search` . When the connector performs a network request, the Elasticsearch Query DSL will be contained within the body.

### Use an Elasticsearch api-key

You can restrict access to indices via an api-key. See [kibana API keys guide](https://www.elastic.co/guide/en/kibana/current/api-keys.html)
