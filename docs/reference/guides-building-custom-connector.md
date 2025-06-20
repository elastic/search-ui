---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/guides-building-a-custom-connector.html
applies_to:
  stack:
  serverless:
---

# Building a custom connector [guides-building-a-custom-connector]

This guide helps you build a custom connector so you can use Search UI with your own API.

A connector is a class that implements the following methods:

- `onSearch`
- `onAutocomplete`
- `onResultClick`
- `onAutocompleteResultClick`

## Connector Example [guides-building-a-custom-connector-connector-example]

Below is an example of a custom connector. Example is given in typescript as the types may be helpful to you.

See [Request State](/reference/api-core-state.md#api-core-state-request-state), [Response State](/reference/api-core-state.md#api-core-state-response-state) and [Search Query Config](/reference/api-core-configuration.md#api-core-configuration-search-query-queryconfig) for more information.

```typescript
import type { APIConnector } from "@elastic/search-ui";

class MyAPIConnector implements APIConnector {
  async onSearch(
    state: RequestState,
    queryConfig: QueryConfig
  ): Promise<ResponseState> {
    const { searchTerm, current, filters, sort } = state;
    // perform a request to your API with the request state
    const response = await fetch("https://api.my-host/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        searchTerm,
        current,
        filters,
        sort
      })
    });
    // response will need to be in the shape of ResponseState.
    // Alternatively you could transform the response here
    return response.json();
  }

  async onAutocomplete(
    state: RequestState,
    queryConfig: AutocompleteQueryConfig
  ): Promise<AutocompleteResponseState> {
    const response = await fetch(
      "https://api.my-host/autocomplete?query" + state.searchTerm,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    // response will need to be in the shape of AutocompleteResponseState.
    // Alternatively you could transform the response here
    return response.json();
  }

  onResultClick(params): void {
    console.log(
      "perform a call to the API to highlight a result has been clicked"
    );
  }

  onAutocompleteResultClick(params): void {
    console.log(
      "perform a call to the API to highlight an autocomplete result has been clicked"
    );
  }
}
```

## Integration [guides-building-a-custom-connector-integration]

Once you have built your connector, you can simply use it within Search UI.

```js
  const connector = new MyAPIConnector();

  const config = {
    apiConnector: connector,
    searchQuery: { ... },
    autocompleteQuery: { ... }
  };

  const App = () => (
    <SearchProvider config={config}>
      <div className="App">
        <SearchBox />
      </div>
    </SearchProvider>
  );
```
