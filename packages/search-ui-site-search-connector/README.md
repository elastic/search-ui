# search-ui-site-search-connector

This Connector is used to connect Search UI to Elastic's [Site Search](https://www.elastic.co/cloud/site-search-service) API.

While Site Search supports multiple document types, Search UI will only
support a single document type, and it must be provided up front when
creating the connector.

Note that Site Search does not support certain features that App Search
does provide. For example:

- Only `value` facets are allowed, not `range` facets.
- Analytics tags are not supported.
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
  engineKey: "Z41R5U3Hi4s5gp1aw7kA"
});
```

### Configuration

| option                                            | type             | required? | source                                                                                                                       |
| ------------------------------------------------- | ---------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `documentType`                                    | String           | required  | From your Site Search Account's Credentials                                                                                  |
| `engineKey`                                       | String           | required  | From your Site Search Engine's Name                                                                                          |
| `additionalOptions`                               | Function(Object) | optional  | A hook that allows you to inject additional, API specific configuration.<br/><br/> `currentOptions => ({ someOption: 'a' })` |
| options before the request is sent to the server. |

### Methods

| method   | params                                             | return                    | description |
| -------- | -------------------------------------------------- | ------------------------- | ----------- |
| `click`  | `props` - Object                                   |                           |             |
|          | - `query` - String                                 |                           |             |
|          | - `documentId` - String                            |                           |             |
| `search` | `searchTerm` - String<br/>`searchOptions` - Object | [ResultList](#resultlist) |             |

### ResultList<a id="resultlist"></a>

| field        | type                             | description                                                                                      |
| ------------ | -------------------------------- | ------------------------------------------------------------------------------------------------ |
| `rawResults` | Array[Object]                    | Raw list of result data: [Reference](https://swiftype.com/documentation/app-search/api/search)   |
| `results`    | Array[[ResultItem](#resultItem)] |                                                                                                  |
| `info`       | Object                           | `meta` data from response: [Reference](https://swiftype.com/documentation/app-search/api/search) |

### ResultItem<a id="resultItem"></a>

| field        | type             | description                                                                            |
| ------------ | ---------------- | -------------------------------------------------------------------------------------- |
| `data`       | Array[Object]    | Raw result data: [Reference](https://swiftype.com/documentation/app-search/api/search) |
| `getRaw`     | Function(String) | Convenience function for getting raw field data                                        |
| `getSnippet` | Function(String) | Convenience function for getting snippet field data                                    |
