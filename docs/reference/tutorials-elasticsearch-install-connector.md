---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/tutorials-elasticsearch-install-connector.html
---

# Install Сonnector [tutorials-elasticsearch-install-connector]

### Setup CRA for Search UI [tutorials-elasticsearch-step-4-setup-cra-for-search-ui]

First, download the Search-UI’s starter app from github by

```shell
curl https://codeload.github.com/elastic/app-search-reference-ui-react/tar.gz/master | tar -xz
```

and should appear as a folder called `app-search-reference-ui-react-main`.

Navigate to the root to the folder and install the dependencies using the following command:

```shell
yarn
```

## Installing сonnector [tutorials-elasticsearch-installing-connector]

Within the folder, we can now install the `@elastic/search-ui-elasticsearch-connector` library with Yarn.

```shell
yarn add @elastic/search-ui-elasticsearch-connector
```

Make sure to check and update Search UI dependencies to the latest version. You can find the latest version by going to [NPM’s page for @elastic/search-ui](https://www.npmjs.com/package/@elastic/search-ui).

## Setting up the connector [tutorials-elasticsearch-setting-up-the-connector]

Open the project within your favorite editor.

Within `src/App.js`, change line 3 to import the Elasticsearch connector. You no longer need the app-search connector.

```js
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
```

and then update the options to the connector

```js
const connector = new ElasticsearchAPIConnector({
  cloud: {
    id: "<my-elastic-cloud-id>"
  },
  apiKey: "<api-key>",
  index: "my-example-movies"
});
```

If you’re using Elastic Cloud, you can find your cloud id within your deployment’s details.

:::{image} images/copy-cloud-id.jpg
:alt: copy es endpoint
:class: screenshot
:::

alternatively, if you’re using an on-premise Elasticsearch instance, you can connect via specifying the host.

```js
const connector = new ElasticsearchAPIConnector({
  host: "http://localhost:9200",
  index: "my-example-movies"
});
```
