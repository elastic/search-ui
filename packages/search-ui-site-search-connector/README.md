# search-ui-site-search-connector

This Connector is used to connect Search UI to Elastic's [Site Search](https://www.elastic.co/cloud/site-search-service) API.

While Site Search supports multiple document types, Search UI will only
support a single document type, and it must be provided up front when
creating the connector.

Note that Site Search does not support certain features that App Search
does provide. For example:

- Only value facets are allowed, not range facets, for example.
- Click-through tracking does not support tags.
- Facets do not have a configurable "size" parameter.
- Disjunctive faceting is not supported.

## Usage

```shell
npm install --save import @elastic/search-ui-site-search-connector
```

```js
import SiteSearchAPIConnector from "@elastic/search-ui-site-search-connector";

const connector = new SiteSearchAPIConnector({
  documentType: "national-parks",
  engineKey: "Z41R5U3Hi4s5gp1aw7kA",
  additionalOptions: () => ({
    fetch_fields: ["title"]
  })
});
```

### Methods

TODO Properly document interface once we decide what this interface should look like

| method   | params                                             | return | description |
| -------- | -------------------------------------------------- | ------ | ----------- |
| `click`  | `props` - Object                                   |        |             |
|          | - `query` - String                                 |        |             |
|          | - `documentId` - String                            |        |             |
| `search` | `searchTerm` - String<br/>`searchOptions` - Object |        |             |
