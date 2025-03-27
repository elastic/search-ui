import React from "react";
import "@elastic/eui/dist/eui_theme_light.css";

import EnginesAPIConnector from "@elastic/search-ui-engines-connector";

import { SearchProvider } from "@elastic/react-search-ui";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import { Engines } from "./Engines";

const connector = new EnginesAPIConnector({
  host: "http://localhost:3002",
  engineName: "puggles",
  apiKey: "QTJDMHhJVUJENHg5WEJWcXlrWVQ6dXFlcF9QRWdRWHl2Rm9iSndka1Rndw=="
});

const config = {
  debug: true,
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  autocompleteQuery: {
    results: {
      search_fields: {
        name: {}
      },
      resultsPerPage: 5,
      result_fields: {
        name: {
          snippet: {
            size: 100,
            fallback: true
          }
        }
      }
    }
  },
  searchQuery: {
    filters: [],
    search_fields: {
      name: {
        weight: 3
      }
    },
    result_fields: {
      id: { raw: {} },
      name: { raw: {}, snippet: { size: 100, fallback: true } },
      color: { raw: {} },
      age: { raw: {} }
    },
    disjunctiveFacets: ["color", "age"],
    facets: {
      color: { type: "value" },
      age: {
        type: "range",
        ranges: [
          { to: 2, name: "New born" },
          { from: 2, to: 3, name: "Puppy" },
          { from: 3, to: 13, name: "Mid" },
          { from: 14, name: "senior" }
        ]
      }
    }
  }
};

export default function App() {
  return (
    <SearchProvider config={config}>
      <Engines />
    </SearchProvider>
  );
}
