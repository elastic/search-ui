---
navigation_title: "Tutorials"
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/tutorials-connectors.html
applies_to:
  stack:
  serverless:
---

# Which connector to choose? [tutorials-connectors]

The first thing you want to consider before implementing your search is the backend you’re going to use for your data.

- (Recommended) [Elasticsearch Connector](/reference/api-connectors-elasticsearch.md) is the best option for working with [Elasticsearch](https://www.elastic.co/elasticsearch). It’s a flexible option that gives you full control over the request and response flow — but it can also work out of the box with minimal configuration.
- [Site Search](/reference/api-connectors-site-search.md) if you are already using [Swiftype](https://swiftype.com/), these are basically a single product with two names.
- Use [Custom Connector Guide](/reference/guides-building-custom-connector.md) if none of the built-in connectors fit your use case.

### ⚠️ Deprecated connectors

The following connectors are no longer recommended for use in new projects:

- [Elastic App Search](/reference/api-connectors-app-search.md)
- [Elastic Workplace Search](/reference/api-connectors-workplace-search.md)

These products are deprecated and not actively maintained. If you’re still using them, the connectors will technically work — but we suggest migrating to the [Elasticsearch Connector](/reference/api-connectors-elasticsearch.md).
