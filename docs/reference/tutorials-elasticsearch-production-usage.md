---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/tutorials-elasticsearch-production-usage.html
applies_to:
  stack:
  serverless:
---

# Using in Production [tutorials-elasticsearch-production-usage]

In production, it's **strongly recommended** not to expose your Elasticsearch instance directly to the browser. Instead, proxy all requests through your own backend server.

## Connection & Authentication [api-connectors-elasticsearch-connection-and-authentication]

You have the following options available to you for securely exposing your Elasticsearch instance to the internet:

### Proxying Elasticsearch Requests [api-connectors-elasticsearch-proxy-the-_search-api-call-through-your-api]

:::{tip}
This is the **recommended** approach and will be used in the examples below.
:::

This involves creating an API route that proxies search requests to Elasticsearch. Proxying enables you to:

- Add custom headers or API keys on the server.
- Apply filters to restrict access to specific documents
- Your own user based authentication for your API
- Monitor and log search activity
- Add a caching layer between the API and Elasticsearch

Use `ApiProxyConnector` in the frontend to send requests to your backend, and `ElasticsearchAPIConnector` in the backend to forward them to Elasticsearch.

### API Key Restrictions [api-connectors-elasticsearch-use-an-elasticsearch-api-key]

You can restrict access to indices by using an API key. We **recommend** you create an apiKey that is restricted to the particular index and has **read-only** authorization. See [Kibana API keys guide](docs-content://deploy-manage/api-keys/elasticsearch-api-keys.md). To use the API key, place it within the Elasticsearch connection configuration.

## Frontend Update [tutorials-elasticsearch-production-usage-client]

To proxy search requests through your server, use the `ApiProxyConnector`. This connector sends search and autocomplete requests to your backend, where the real Elasticsearch query is executed.

```js
import { ApiProxyConnector } from "@elastic/search-ui-elasticsearch-connector/api-proxy";
const connector = new ApiProxyConnector({
  basePath: "http://localhost:3001/api" // ⚠️ Replace with your server URL in production
  // fetchOptions: {} // Optional: Add headers or credentials here if needed
});

const config = {
  apiConnector: connector
  // other Search UI config options
};
```

For more details, see the [ApiProxyConnector](/reference/api-connectors-elasticsearch.md#api-connectors-elasticsearch-api-proxy-doc-reference)

## Server Usage [tutorials-elasticsearch-production-usage-server]

On your backend, handle the request using `ElasticsearchAPIConnector` and pass in the request body from the client:

```js
import express from "express";
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const app = express();
app.use(express.json());

const connector = new ElasticsearchAPIConnector({
  host: "https://your-elasticsearch-host", // ⚠️ Replace with your Elasticsearch host
  index: "your-index", // ✅ Use the same index as your data
  apiKey: "your-api-key" // 🔒 Use a secure, read-only API key
});

app.post("/api/search", async (req, res) => {
  const { state, queryConfig } = req.body; // { state: RequestState, queryConfig: QueryConfig } - comes from ApiProxyConnector on the frontend
  const response = await connector.onSearch(state, queryConfig);
  res.json(response);
});

app.post("/api/autocomplete", async (req, res) => {
  const { state, queryConfig } = req.body;
  const response = await connector.onAutocomplete(state, queryConfig);
  res.json(response);
});

app.listen(3001);
```

For other authentication methods, check the [Elasticsearch API connector reference](/reference/api-connectors-elasticsearch.md#api-connectors-elasticsearch-doc-reference).

## Summary [tutorials-elasticsearch-production-usage-summary]

For a secure and scalable production setup:

- Use `ApiProxyConnector` on the frontend.
- Use `ElasticsearchAPIConnector` on the server.
- **Avoid to** expose your Elasticsearch API key to the browser.
- Monitor and log if needed.

:::{tip}
You can explore a **production ready** example using this setup in our [CodeSandbox](https://codesandbox.io/p/sandbox/github/elastic/search-ui/tree/main/examples/sandbox?file=/src/pages/elasticsearch-production-ready/index.jsx).

It demonstrates how to use `ApiProxyConnector` on the client and proxy search requests to a backend that uses `ElasticsearchAPIConnector`.
:::
