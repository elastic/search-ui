# search-ui-app-search-connector

Part of the [Search UI](https://github.com/elastic/search-ui) project.

This Connector is used to connect Search UI to Elastic's [App Search](https://www.elastic.co/cloud/app-search-service) API.

## Usage

```shell
npm install --save @elastic/search-ui-app-search-connector
```

```js
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  hostIdentifier: "host-2376rb",
  beforeSearchCall: (options, next) =>
    next({
      ...options,
      group: { field: "title" }
    })
});
```

## Classes

<dl>
<dt><a href="#AppSearchAPIConnector">AppSearchAPIConnector</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#next">next</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#hook">hook</a> ⇒ <code>Object</code></dt>
<dd><p>Hooks work like middleware. This gives you an opportunity to modify the request and response
to for a particular API call.</p>
</dd>
</dl>

<a name="AppSearchAPIConnector"></a>

## AppSearchAPIConnector

**Kind**: global class
<a name="new_AppSearchAPIConnector_new"></a>

### new AppSearchAPIConnector(options)

| Param                                       | Type                       | Description                                                                                                                                                         |
| ------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| options                                     | <code>Object</code>        | Credential found in your App Search Dashboard                                                                                                                       |
| options.searchKey                           | <code>string</code>        | Credential found in your App Search Dashboard                                                                                                                       |
| options.engineName                          | <code>string</code>        | Engine to query, found in your App Search Dashboard                                                                                                                 |
| [options.hostIdentifier]                    | <code>string</code>        | Credential found in your App Search Dashboard. Required only if not using the endpointBase option.                                                                  |
| [options.beforeSearchCall]                  | [<code>hook</code>](#hook) | A hook to amend request or response to API for "onSearch" event.                                                                                                    |
| [options.beforeAutocompleteResultsCall]     | [<code>hook</code>](#hook) | A hook to amend request or response to API for a "results" query on an "onAutocomplete" event.                                                                      |
| [options.beforeAutocompleteSuggestionsCall] | [<code>hook</code>](#hook) | A hook to amend request or response to API for a "suggestions" query on an "onAutocomplete" event.                                                                  |
| [options.endpointBase]                      | <code>string</code>        | Overrides the base of the Swiftype API endpoint completely. Useful for non-SaaS App Search deployments. For example, Elastic Cloud, Self-Managed, or proxying SaaS. |

<a name="next"></a>

## next ⇒ <code>Object</code>

**Kind**: global typedef
**Returns**: <code>Object</code> - The API response

| Param               | Type                | Description                    |
| ------------------- | ------------------- | ------------------------------ |
| updatedQueryOptions | <code>Object</code> | The options to send to the API |

<a name="hook"></a>

## hook ⇒ <code>Object</code>

Hooks work like middleware. This gives you an opportunity to modify the request and response
to for a particular API call.

**Kind**: global typedef
**Returns**: <code>Object</code> - The API response, which may or may not have been amended by this hook

| Param        | Type                       | Description                                      |
| ------------ | -------------------------- | ------------------------------------------------ |
| queryOptions | <code>Object</code>        | The options that are about to be sent to the API |
| next         | [<code>next</code>](#next) | Callback to continue to make the actual API call |
