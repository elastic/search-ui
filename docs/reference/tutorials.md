---
navigation_title: "Tutorials"
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/tutorials-connectors.html
---

# Which connector to choose? [tutorials-connectors]


The first thing you want to consider before implementing your search is the backend you’re going to use for your data.


## Recommended connectors [tutorials-connectors-recommended-connectors]

Search UI works best with **Elastic App Search** and **Elasticsearch**.

If you’re relatively new to the search problem or Elastic ecosystem, we recommend choosing **https://www.elastic.co/enterprise-search/search-applications[App Search]**. It solves many search problems out-of-box and is generally simpler to start with, althought it’s not as flexible as Elasticsearch.

On the other hand, if you prefer flexibility over simplicity and already familiar with **https://www.elastic.co/elasticsearch[Elasticsearch]**, go with it! Just note that our Elasticsearch connector is still in technical preview and its API might change in the future.

If you’re still not sure, go with App Search. It’ll help you start quickly, and you can switch to Elasticsearch later if you need to.


## Other connectors [tutorials-connectors-other-connectors]

Search UI also works with **Elastic Workplace Search** and **Elastic Site Search**.

Choose **https://www.elastic.co/enterprise-search/workplace-search[Workplace Search]** if it’s critical for you to search data from one of the [supported sources](https://www.elastic.co/guide/en/workplace-search/current/workplace-search-content-sources.html#oauth-first-party-content-sources), like Confluence, Salesforce, Jira or others.

Choose **https://www.elastic.co/enterprise-search/site-search[Site Search]** if you are already using [Swiftype](https://swiftype.com/), these are basically a single product with two names. Otherwise, it’s best to go with the **App Search** connector, since the functionalty of Site Search has already been implemented in the App Search’s web crawler.


## Custom connector [tutorials-connectors-custom-connector]

It is possible to implement your own connector to Search UI. Read our [Custom connector guide](/reference/guides-building-custom-connector.md) to learn more.
