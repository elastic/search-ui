---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/tutorials-elasticsearch-customise-request.html
---

# Customise Request [api-connectors-elasticsearch-customise-the-elasticsearch-request-body]

Elasticsearch connector allows you to customise the Elasticsearch request body before its performed on Elasticsearch. This is useful if you want to customise the query or options before the request is sent to Elasticsearch.

This is an advanced option, the underlying query may change between versions and reading from / mutating the query is brittle, so please be aware to use this sparingly and let us know what you want to achieve through github issues.

## Using interceptSearchRequest Hook

The `interceptSearchRequest` hook allows you to modify the entire request body before it's sent to Elasticsearch. This is useful when you need to modify multiple parts of the request or add custom fields.

```js
const connector = new ElasticsearchAPIConnector({
  host: "https://example-host.es.us-central1.gcp.cloud.es.io:9243",
  index: "national-parks",
  apiKey: "exampleApiKey",
  interceptSearchRequest: async (
    { requestBody, requestState, queryConfig },
    next
  ) => {
    console.log("Search request:", requestBody); // logging out the requestBody before sending to Elasticsearch

    if (!requestState.searchTerm) {
      return next(requestBody);
    }

    const searchFields = queryConfig.search_fields;
    const modifiedBody = {
      ...requestBody,
      query: {
        multi_match: {
          query: requestState.searchTerm,
          fields: Object.keys(searchFields).map((fieldName) => {
            const weight = searchFields[fieldName].weight || 1;
            return `${fieldName}^${weight}`;
          })
        }
      }
    };

    return next(modifiedBody);
  }
});
```

The hook receives the current request state and configuration, allowing you to modify the request before it's sent to Elasticsearch. Always call `next()` with the modified request body to ensure the request is sent to Elasticsearch.

## Using getQueryFn Hook

The `getQueryFn` hook allows you to completely override the query generation. This is useful when you want to implement custom query logic or use advanced Elasticsearch features like semantic search. The hook is called only when there is a search query, so you don't need to handle empty search terms.

```js
const connector = new ElasticsearchAPIConnector({
  host: "https://example-host.es.us-central1.gcp.cloud.es.io:9243",
  index: "national-parks",
  apiKey: "exampleApiKey",
  getQueryFn: (state, config) => ({
    semantic: {
      field: "inference_field",
      query: state.searchTerm
    }
  })
});
```

The `getQueryFn` hook only replaces the query part of the request body. Filters are still added separately and automatically mixed in. This makes it perfect for implementing custom search algorithms while maintaining compatibility with Search UI's filtering system.

::::{admonition} Note
:class: important

This example uses Elasticsearch's built-in semantic search. Make sure you have configured the inference pipeline and the field is properly mapped in your index. See [Semantic Search](https://www.elastic.co/docs/solutions/search/semantic-search) documentation for setup instructions.
::::
