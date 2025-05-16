---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/api-connectors-elasticsearch.html
---

# Elasticsearch Connector [api-connectors-elasticsearch]

## ElasticsearchAPIConnector [api-connectors-elasticsearch-doc-reference]

::::{admonition} Security note
:class: important

This connector will talk to the **Elasticsearch** instance directly from the browser.  
We **strongly recommend** proxying requests through your backend using `ApiProxyConnector` to avoid exposing API credentials or allowing unrestricted access.

See [Using in Production](/reference/tutorials-elasticsearch-production-usage.md) for best practices.
::::

Search UI provides a way to connect to Elasticsearch directly without needing Enterprise Search. This is useful for when you dont need the features of Enterprise Search, such as relevance tuning.

The connector uses the same Search UI configuration that other connectors use.

You must specify either the cloud id or on-premise host url for the Elasticsearch connector.

```ts
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import type { IApiClientTransporter } from "@elastic/search-ui-elasticsearch-connector";

class CustomApiClientTransporter implements IApiClientTransporter {
  performRequest(searchRequest) {
    // Custom implementation
    return response;
  }
}

const customApiClient = new CustomApiClientTransporter();

const connector = new ElasticsearchAPIConnector(
  {
    // Either specify the cloud id or host or apiClient to connect to elasticsearch
    cloud: {
      id: "<elastic-cloud-id>" // cloud id found under your cloud deployment overview page
    },
    host: "http://localhost:9200", // host url for the Elasticsearch instance
    index: "<index-name>", // index name where the search documents are contained
    apiKey: "<api-key>", // Optional. apiKey used to authorize a connection to Elasticsearch instance.
    // This key will be visible to everyone so ensure its setup with restricted privileges.
    // See Authentication section for more details.
    connectionOptions: {
      // Optional connection options.
      headers: {
        "x-custom-header": "value" // Optional. Specify custom headers to send with the request
      }
    },
    // Optional. Custom API client implementation.
    // If not provided, a default ApiClientTransporter will be used.
    // This allows you to customize how requests are made to Elasticsearch.
    apiClient: customApiClient
  },
  (requestBody, requestState, queryConfig) => {
    // Optional: modify the query before sending to Elasticsearch
    return {
      ...requestBody,
      custom_field: "value"
    };
  }
);
```

**Constructor Parameters**

| Argument                  | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| config                    | object   | Elasticsearch connection options (see table below).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| postProcessRequestBodyFn? | function | **Optional** function to customize the Elasticsearch request body.<br>**Params:**<br>`requestBody` - [Search API Request](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html)<br>`requestState` - [RequestState](https://github.com/elastic/search-ui/blob/main/packages/search-ui/src/types/index.ts#L50)<br>`queryConfig` - [QueryConfig](https://github.com/elastic/search-ui/blob/main/packages/search-ui/src/types/index.ts#L188)<br>**Return:**<br>`requestBody` - [Search API Request](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html) |

**Config**

| Param             | Type   | Description                                                                                                                                                                                                                                                                                                                                            |
| ----------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| cloud             | object | **Required if `host` or custom `apiClient` not provided.** Object type. The cloud id for the deployment within elastic cloud. Format: `{ id: 'cloud:id' }`. You can find your cloud id in the Elastic Cloud deployment overview page.                                                                                                                  |
| host              | string | **Required if `cloud` or custom `apiClient` not provided.** String type. The host url to the Elasticsearch instance                                                                                                                                                                                                                                    |
| index             | string | **Required.** String type. The search index name                                                                                                                                                                                                                                                                                                       |
| apiKey            | string | **Optional.** a credential used to access the Elasticsearch instance. See [Connection & Authentication](/reference/tutorials-elasticsearch-production-usage.md#api-connectors-elasticsearch-connection-and-authentication)                                                                                                                             |
| connectionOptions | object | **Optional.** Object containing `headers` dictionary of header name to header value.                                                                                                                                                                                                                                                                   |
| apiClient         | object | **Optional.** Custom API client implementation. If not provided, a default ApiClientTransporter will be used. This allows you to customize how requests are made to Elasticsearch. The object must implement the `IApiClientTransporter` interface with a `performRequest` method that takes a search request and returns a promise with the response. |

## ApiProxyConnector [api-connectors-elasticsearch-api-proxy-doc-reference]

The `ApiProxyConnector` is used when you want to proxy search requests through your own backend rather than exposing your Elasticsearch cluster directly to the browser.

It sends `onSearch` and `onAutocomplete` requests to your API, which is expected to forward them to Elasticsearch using `ElasticsearchAPIConnector`.

```js
import { ApiProxyConnector } from "@elastic/search-ui-elasticsearch-connector/api-proxy";
// Alternatively:
// import { ApiProxyConnector } from "@elastic/search-ui-elasticsearch-connector";

const connector = new ApiProxyConnector({
  basePath: "/api", // Base path for your proxy server
  fetchOptions: {
    headers: {
      Authorization: "Bearer your-auth-token" // Optional fetch params
    }
  }
});
```

**Constructor Parameters**

| Argument     | Type   | Description                                                                                                                                      |
| ------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| basePath     | string | **Optional.** The base URL path for your proxy server. _Default is "/api"._                                                                      |
| fetchOptions | object | **Optional.** Custom [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit) options passed to fetch, e.g., headers or mode. |

**Expected Server API**

The server is expected to expose two endpoints:

- `POST /search` — handles search requests
- `POST /autocomplete` — handles autocomplete requests

Both endpoints should accept a body with the following format:

```json
{
  "state": {
    /* RequestState */
  },
  "queryConfig": {
    /* QueryConfig */
  }
}
```

And respond with the standard Search UI response types:

- `ResponseState` for `/search`
- `AutocompleteResponseState` for `/autocomplete`

For a full working example with server setup, see the Using in [Production guide](/reference/tutorials-elasticsearch-production-usage.md) or jump to the [CodeSandbox](https://codesandbox.io/p/sandbox/github/elastic/search-ui/tree/main/examples/sandbox?file=/src/pages/elasticsearch-production-ready/index.jsx).

## Autocomplete [api-connectors-elasticsearch-autocomplete]

Search UI supports autocomplete functionality to suggest search terms that provide results. The autocomplete functionality is built on top of the Elasticsearch `suggest` and `bool prefix query` API.

To take advantage of the feature, first update the [autocomplete query](/reference/api-core-configuration.md#api-core-configuration-autocomplete-query) configuration.

Below is an example of what the `autocompleteQuery` may look like.

```js
autocompleteQuery: {
  // performs a prefix search on the query
  results: {
    resultsPerPage: 5, // number of results to display. Default is 5.
    search_fields: {
      // the fields to prefix search on
      title_suggest: {}
    },
    result_fields: {
      // Add snippet highlighting within autocomplete suggestions
      title: { snippet: { size: 100, fallback: true }},
      nps_link: { raw: {} }
    }
  },
  // performs a query to suggest for values that partially match the incomplete query
  suggestions: {
    types: {
      // Limit query to only suggest based on "title" field
      documents: {  fields: ["title_completion"] }
    },
    // Limit the number of suggestions returned from the server
    size: 4
  }
}
```

Above we are configuring both the `results` and `suggestions` sections of the autocomplete query.

`results` will need a search field to perform a prefix search on the query. We advise using a `search_as_you_type` field to be used. `suggestions` require a `completion` type field to perform a query to suggest for values that partially match the incomplete query.

Below is an example of the mappings for the above example. `title_suggest` is a `search_as_you_type` field and `title_completion` is a `completion` type field.

```json
{
  "mappings": {
    "properties": {
      "title_suggest": {
        "type": "search_as_you_type"
      },
      "title_completion": {
        "type": "completion"
      }
    }
  }
}
```

With a combination of this configuration + the [Searchbox](/reference/api-react-components-search-box.md) component with autocomplete configuration, your users will be able to see suggestions as they type within the search box.
