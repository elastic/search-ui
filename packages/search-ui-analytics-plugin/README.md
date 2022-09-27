# search-ui-analytics-plugin

Part of the [Search UI](https://github.com/elastic/search-ui) project.

### Integration

Enable Behaviorial analytics within kibana.

Embed the analytics client onto the page. See the example integrations snippet thats provided to you once you created a collection

```
<script
  src="<HOST>/analytics.js"
  data-dsn="<HOST>/analytics/api/collections/test"
  defer
></script>
```

then integrate the plugin into the configuration

```
import AnalyticsPlugin from "@elastic/search-ui-analytics-plugin";

const config = {
  ...
  plugins: [AnalyticsPlugin()],
  ...
}
```
