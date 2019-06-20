# search-ui-site-search-connector

**NOTE: This library is in an early Beta period, it is not yet recommended for production use**

This Connector is used to connect Search UI to Elastic's [Site Search](https://www.elastic.co/cloud/site-search-service) API.

While Site Search supports multiple document types, Search UI will only
support a single document type, and it must be provided up front when
creating the connector.

Note that Site Search does not support certain features of Search UI:

- `disjunctiveFacets` or `disjunctiveFacetsAnalyticsTags` configuration options
- Only `value` facets are allowed, no `range` facet support.
- `sort` option is not supported on facets.
- `size` option is not supported on facets.
- Does not support multiple filters applied to a single field.
- Cannot apply more than 1 range filter on a single field.
- Analytics tags are not supported in `click`.
- `suggestions` are not supported in autocomplete, only `results`
- The `none` filter type is not supported.

## Usage

```shell
npm install --save @elastic/search-ui-site-search-connector
```

```js
import SiteSearchAPIConnector from "@elastic/search-ui-site-search-connector";

const connector = new SiteSearchAPIConnector({
  documentType: "national-parks",
  engineKey: "Z41R5U3Hi4s5gp1aw7kA"
});
```

## Classes

<dl>
<dt><a href="#SiteSearchAPIConnector">SiteSearchAPIConnector</a></dt>
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

<a name="SiteSearchAPIConnector"></a>

## SiteSearchAPIConnector

**Kind**: global class
<a name="new_SiteSearchAPIConnector_new"></a>

### new SiteSearchAPIConnector(options)

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

| Param                         | Type                       | Default                                                      | Description                                                                                                            |
| ----------------------------- | -------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| documentType                  | <code>string</code>        |                                                              | Document Type found in your Site Search Dashboard                                                                      |
| engineKey                     | <code>string</code>        |                                                              | Credential found in your Site Search Dashboard                                                                         |
| beforeSearchCall              | [<code>hook</code>](#hook) | <code>(queryOptions,next)&#x3D;&gt;next(queryOptions)</code> | A hook to amend query options before the request is sent to the API in a query on an "onSearch" event.                 |
| beforeAutocompleteResultsCall | [<code>hook</code>](#hook) | <code>(queryOptions,next)&#x3D;&gt;next(queryOptions)</code> | A hook to amend query options before the request is sent to the API in a "results" query on an "onAutocomplete" event. |
