---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/api-core-index.html
---

# Core API

Core API is the main set of interfaces and configurations used to set up and manage search functionality in Search UI.

## Core Components

Core API consists of three main parts:

1. [Configuration](/reference/api-core-configuration.md) - configuration of search queries, autocomplete, and event handlers
2. [State](/reference/api-core-state.md) - application state management, including:
   - Request State
   - Response State
   - Application State
3. [Actions](/reference/api-core-actions.md) - functions to update the Request State and perform API requests, including:
   - Search term management
   - Filter operations
   - Sorting
   - Pagination
   - Analytics tracking

## Key Features

- Search query configuration with support for filters and facets
- Autocomplete and suggestions configuration
- Application state management
- Integration with various search backends through connectors
- URL state and routing configuration

## Usage Example

```jsx
import { SearchProvider } from "@elastic/react-search-ui";

const config = {
  apiConnector: connector,
  searchQuery: {
    facets: {
      states: { type: "value", size: 30 }
    }
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5
    }
  }
};

<SearchProvider config={config}>{/* Search UI components */}</SearchProvider>;
```
