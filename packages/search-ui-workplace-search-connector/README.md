# search-ui-app-search-connector

Part of the [Search UI](https://github.com/elastic/search-ui) project.

This Connector is used to connect Search UI to Elastic's [App Search](https://www.elastic.co/app-search/) API.

## Usage

```shell
npm install --save @elastic/search-ui-app-search-connector
```

```js
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  endpointBase: "http://127.0.0.1:3002"
});
```

### Swiftype.com App Search users:

When using the [SaaS version available on swiftype.com](https://app.swiftype.com/as) of App Search, you can configure the connector using your `hostIdentifier` instead of the `endpointBase` parameter.
The `hostIdentifier` can be found within the [Credentials](https://app.swiftype.com/as#/credentials) menu.

```
const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  hostIdentifier: "host-c5s2mj"
});
```

### Additional options

Additional options will be passed through to the underlying
[APIclient](https://github.com/elastic/app-search-javascript). Any valid parameter of the client can be used.

```js
const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  endpointBase: "http://127.0.0.1:3002",
  cacheResponses: false
});
```

## Classes

<dl>
<dt><a href="#AppSearchAPIConnector">AppSearchAPIConnector</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#next">next</a> : <code>function</code></dt>
<dd></dd>
<dt><a href="#hook">hook</a> : <code>function</code></dt>
<dd></dd>
<dt><a href="#Options">Options</a></dt>
<dd></dd>
</dl>

<a name="AppSearchAPIConnector"></a>

## AppSearchAPIConnector

**Kind**: global class
<a name="new_AppSearchAPIConnector_new"></a>

### new AppSearchAPIConnector(options)

| Param   | Type                             |
| ------- | -------------------------------- |
| options | [<code>Options</code>](#Options) |

<a name="next"></a>

## next : <code>function</code>

**Kind**: global typedef

| Param               | Type                | Description                    |
| ------------------- | ------------------- | ------------------------------ |
| updatedQueryOptions | <code>Object</code> | The options to send to the API |

<a name="hook"></a>

## hook : <code>function</code>

**Kind**: global typedef

| Param        | Type                       | Description                                      |
| ------------ | -------------------------- | ------------------------------------------------ |
| queryOptions | <code>Object</code>        | The options that are about to be sent to the API |
| next         | [<code>next</code>](#next) | The options that are about to be sent to the API |

<a name="Options"></a>

## Options

**Kind**: global typedef

| Param                             | Type                       | Default                                                      | Description                                                                                                                   |
| --------------------------------- | -------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| searchKey                         | <code>string</code>        |                                                              | Credential found in your App Search Dashboard                                                                                 |
| engineName                        | <code>string</code>        |                                                              | Engine to query, found in your App Search Dashboard                                                                           |
| hostIdentifier                    | <code>string</code>        |                                                              | Credential found in your App Search Dashboard Useful when proxying the Swiftype API or developing against a local API server. |
| beforeSearchCall                  | [<code>hook</code>](#hook) | <code>(queryOptions,next)&#x3D;&gt;next(queryOptions)</code> | A hook to amend query options before the request is sent to the API in a query on an "onSearch" event.                        |
| beforeAutocompleteResultsCall     | [<code>hook</code>](#hook) | <code>(queryOptions,next)&#x3D;&gt;next(queryOptions)</code> | A hook to amend query options before the request is sent to the API in a "results" query on an "onAutocomplete" event.        |
| beforeAutocompleteSuggestionsCall | [<code>hook</code>](#hook) | <code>(queryOptions,next)&#x3D;&gt;next(queryOptions)</code> | A hook to amend query options before the request is sent to the API in a "suggestions" query on an "onAutocomplete" event.    |
| endpointBase                      | <code>string</code>        | <code>""</code>                                              | Overrides the base of the Swiftype API endpoint completely.                                                                   |
