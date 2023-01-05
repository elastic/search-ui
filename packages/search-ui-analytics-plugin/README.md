# Search UI Analytics Plugin

The Analytics Plugin is a plugin that provides a way to send analytics events to the Behavioral Analytics Product. To use it, you must follow the instructions on how to set up the Analytics Product.

## Installation

```bash
yarn add @elastic/search-ui-analytics-plugin
## OR
npm install @elastic/search-ui-analytics-plugin
```

## Basic Usage

Within your Search UI configuration, you can add the Analytics Plugin like so:

By default, the Analytics Plugin will use the Behavioral Analytics client thats provided when the integrated via script tag.

```js
import AnalyticsPlugin from "@elastic/search-ui-analytics-plugin";

// search ui configuration
const config = {
  apiConnector: connector,
  searchQuery: { ... },
  plugins: [ AnalyticsPlugin() ]
}
```

### Passing in a custom analytics client

If you integrated Behavioral Analytics using `@elastic/behavioral-analytics-javascript-tracker` NPM package, you can pass in a custom analytics client to the Analytics Plugin.

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

## Options

The Analytics Plugin accepts the following options:

| Option   | Type               | Description                                                                                                                                       | Default                   |
| -------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `client` | `AnalyticsTracker` | The Behavioral Analytics client to use. Read more on [Behavioral Analytics Tracker repo](https://github.com/elastic/behavioral-analytics-tracker) | `window.elasticAnalytics` |
