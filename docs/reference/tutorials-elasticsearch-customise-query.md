---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/tutorials-elasticsearch-customise-request.html
---

# Customise Request [api-connectors-elasticsearch-customise-the-elasticsearch-request-body]

Elasticsearch connector allows you to customise the Elasticsearch request body before its performed on Elasticsearch. This is useful if you want to customise the query or options before the request is sent to Elasticsearch.

This is an advanced option, the underlying query may change between versions and reading from / mutating the query is brittle, so please be aware to use this sparingly and let us know what you want to achieve through github issues.

Example below is overriding the `query` section of the Elasticsearch request body.

```js
const connector = new ElasticsearchAPIConnector(
  {
    host: "https://example-host.es.us-central1.gcp.cloud.es.io:9243",
    index: "national-parks",
    apiKey: "exampleApiKey"
  },
  (requestBody, requestState, queryConfig) => {
    console.log("postProcess requestBody Call", requestBody); // logging out the requestBody before sending to Elasticsearch
    if (!requestState.searchTerm) return requestBody;

    const searchFields = queryConfig.search_fields;

    requestBody.query = {
      multi_match: {
        query: requestState.searchTerm,
        fields: Object.keys(searchFields).map((fieldName) => {
          const weight = searchFields[fieldName].weight || 1;
          return `${fieldName}^${weight}`;
        })
      }
    }; // transforming the query before sending to Elasticsearch using the requestState and queryConfig

    return requestBody;
  }
);
```
