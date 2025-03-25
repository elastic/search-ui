---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/tutorials-elasticsearch-production-usage.html
---

# Using in Production [tutorials-elasticsearch-production-usage]

In production, it's strongly recommended **not** to expose your Elasticsearch instance directly to the browser. Instead, proxy all requests through your own backend server.

## Frontend Update [tutorials-elasticsearch-production-usage-client]

To proxy search requests through your server, use the `ApiProxyConnector`. This connector sends search and autocomplete requests to your backend, where the real Elasticsearch query is executed.

```js
import { ApiProxyConnector } from "@elastic/search-ui-elasticsearch-connector";

const connector = new ApiProxyConnector({
  basePath: "http://localhost:3001/api" // ⚠️ Replace with your server URL in production
  // fetchOptions: {} // Optional: Add headers or credentials here if needed
});

const config = {
  apiConnector: connector
  // other Search UI config options
};
```

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

For other authentication methods, check the [Elasticsearch API connector reference](/reference/api-connectors-elasticsearch.md#api-connectors-elasticsearch).

## API Key Restrictions [tutorials-elasticsearch-production-usage-api-keys]

You can restrict access to indices by using an API key. We recommend you create an apiKey that is restricted to the particular index and has **read-only** authorization. See [Kibana API keys guide](docs-content://deploy-manage/api-keys/elasticsearch-api-keys.md). To use the API key, place it within the Elasticsearch connection configuration.

## Summary [tutorials-elasticsearch-production-usage-summary]

For a secure and scalable production setup:

- Use `ApiProxyConnector` on the frontend.
- Use `ElasticsearchAPIConnector` on the server.
- **Never** expose your Elasticsearch API key to the browser.
- Monitor and log if needed.

:::{tip}
You can explore a **production ready** example using this setup in our [CodeSandbox](https://codesandbox.io/p/sandbox/github/elastic/search-ui/tree/main/examples/sandbox?file=/src/pages/elasticsearch-production-ready/index.jsx).

It demonstrates how to use `ApiProxyConnector` on the client and proxy search requests to a backend that uses `ElasticsearchAPIConnector`.
:::
