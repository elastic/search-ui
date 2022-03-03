# search-ui-workplace-search-connector

Part of the [Search UI](https://github.com/elastic/search-ui) project.

This Connector is used to connect Search UI to Elastic's [Workplace Search](https://www.elastic.co/workplace-search/) API.

## Usage

```shell
npm install --save @elastic/search-ui-workplace-search-connector
```

```js
import WorkplaceSearchAPIConnector from "@elastic/search-ui-workplace-search-connector";

const connector = new WorkplaceSearchAPIConnector({
  kibanaBase: "https://search-ui-sandbox.kb.us-central1.gcp.cloud.es.io:9243",
  enterpriseSearchBase:
    "https://search-ui-sandbox.ent.us-central1.gcp.cloud.es.io",
  redirectUri: "http://localhost:3000",
  clientId: "8e495e40fc4e6acf515e557e634de39d4f727f7f60a3afed24a99ce316607c1e"
});
```

## Authentication

The Workplace Search API requires authentication. This connector uses OAuth authentication. You can read more about that [here](https://www.elastic.co/guide/en/workplace-search/7.13/workplace-search-api-authentication.html#oauth-token) and [here](https://www.elastic.co/guide/en/workplace-search/7.13/workplace-search-search-oauth.html).

Using this connector will populate two additional pieces of Application State:

`isLoggedIn` - This can be used to determine whether or not a user is authenticated. Requests using this connector will only work if a user is authenticatied. If this is false, consider showing a "Login" link using the `authorizeUrl` state.
`authorizeUrl` - This can be used to create a "Login" link for users to initiate OAuth authentication.

## Classes

<dl>
<dt><a href="#WorkplaceSearchAPIConnector">WorkplaceSearchAPIConnector</a></dt>
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

<a name="WorkplaceSearchAPIConnector"></a>

## WorkplaceSearchAPIConnector

**Kind**: global class
<a name="new_WorkplaceSearchAPIConnector_new"></a>

### new WorkplaceSearchAPIConnector(options)

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

| Param                             | Type                       | Default                                                      | Description                                                                                                                                                                                  |
| --------------------------------- | -------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enterpriseSearchBase              | <code>string</code>        |                                                              | The publicly accessible url of the Enterprise Search deployment.                                                                                                                             |
| kibanaBase                        | <code>string</code>        |                                                              | The publicly accessible url for the Kibana deployment associated with the Enterprise Search deployment. Used for OAuth authentication.                                                       |
| redirectUri                       | <code>string</code>        |                                                              | The publicly accessible url of this Search UI deployment, which Kibana will redirect back to after successful OAuth authentication. Must match a URI as configured in the OAuth Application. |
| clientId                          | <code>string</code>        |                                                              | Client ID as generated when setting up the OAuth Application.                                                                                                                                |
| beforeSearchCall                  | [<code>hook</code>](#hook) | <code>(queryOptions,next)&#x3D;&gt;next(queryOptions)</code> | A hook to amend query options before the request is sent to the API in a query on an "onSearch" event.                                                                                       |
| beforeAutocompleteResultsCall     | [<code>hook</code>](#hook) | <code>(queryOptions,next)&#x3D;&gt;next(queryOptions)</code> | A hook to amend query options before the request is sent to the API in a "results" query on an "onAutocomplete" event.                                                                       |
| beforeAutocompleteSuggestionsCall | [<code>hook</code>](#hook) | <code>(queryOptions,next)&#x3D;&gt;next(queryOptions)</code> | A hook to amend query options before the request is sent to the API in a "suggestions" query on an "onAutocomplete" event.                                                                   |
