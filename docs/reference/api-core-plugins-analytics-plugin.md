---
navigation_title: "Plugins"
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/api-core-plugins-analytics-plugin.html
applies_to:
  stack:
---

# Analytics Plugin [api-core-plugins-analytics-plugin]

:::{important}
The Behavioral Analytics feature was discontinued in Elastic 9.0.0.
:::

Use the Analytics Plugin to send analytics events to the Behavioral Analytics Product. Follow the instructions to set up the plugin.

## Installation [api-core-plugins-analytics-plugin-installation]

```bash
yarn add @elastic/search-ui-analytics-plugin
## OR
npm install @elastic/search-ui-analytics-plugin
```

## Basic Usage [api-core-plugins-analytics-plugin-basic-usage]

Add the Analytics Plugin to your Search UI configuration like so:

```js
import AnalyticsPlugin from "@elastic/search-ui-analytics-plugin";

// search ui configuration
const config = {
  apiConnector: connector,
  searchQuery: { ... },
  plugins: [ AnalyticsPlugin() ]
}
```

By default, the Analytics Plugin will use the Behavioral Analytics client provided when using script tag integration.

### Passing in a custom analytics client [api-core-plugins-analytics-plugin-passing-in-a-custom-analytics-client]

If you integrated Behavioral Analytics using the `@elastic/behavioral-analytics-javascript-tracker` NPM package, you can pass in a custom analytics client to the Analytics Plugin.

```js
import AnalyticsPlugin from "@elastic/search-ui-analytics-plugin";
import { createTracker, getTracker } from "@elastic/behavioral-analytics-javascript-tracker";

createTracker({
  // the DSN can be found in the Behavioral Analytics Collections view page
    dsn: "https://my-analytics-dsn.elastic.co"
})

// search ui configuration
const config = {
  apiConnector: connector,
  searchQuery: { ... },
  plugins: [
    AnalyticsPlugin({
      client: getTracker()
    })
  ]
}
```

## Options [api-core-plugins-analytics-plugin-options]

The Analytics Plugin accepts the following parameters:

| Option   | Type               | Description                                                                                                                                       | Default                   |
| -------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `client` | `AnalyticsTracker` | The Behavioral Analytics client to use. Read more on [Behavioral Analytics Tracker repo](https://github.com/elastic/behavioral-analytics-tracker) | `window.elasticAnalytics` |
