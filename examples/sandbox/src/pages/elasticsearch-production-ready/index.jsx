import React from "react";
import "@elastic/eui/dist/eui_theme_light.css";

import { ApiProxyConnector } from "@elastic/search-ui-elasticsearch-connector";
import moment from "moment";

import { SearchProvider } from "@elastic/react-search-ui";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import { ElasticsearchProdReady } from "./elasticsearchProdReady";

const connector = new ApiProxyConnector({
  basePath: "http://localhost:3001/api"
});

const config = {
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  searchQuery: {
    filters: [],
    search_fields: {
      title: {
        weight: 3
      },
      description: {},
      states: {}
    },
    result_fields: {
      visitors: { raw: {} },
      world_heritage_site: { raw: {} },
      location: { raw: {} },
      acres: { raw: {} },
      square_km: { raw: {} },
      title: {
        snippet: {
          size: 100,
          fallback: true
        }
      },
      nps_link: { raw: {} },
      states: { raw: {} },
      date_established: { raw: {} },
      image_url: { raw: {} },
      description: {
        snippet: {
          size: 100,
          fallback: true
        }
      }
    },
    disjunctiveFacets: [
      "acres",
      "states.keyword",
      "date_established",
      "location"
    ],
    facets: {
      "world_heritage_site.keyword": { type: "value" },
      "states.keyword": { type: "value", size: 30, sort: "count" },
      acres: {
        type: "range",
        ranges: [
          { from: -1, name: "Any" },
          { from: 0, to: 1000, name: "Small" },
          { from: 1001, to: 100000, name: "Medium" },
          { from: 100001, name: "Large" }
        ]
      },
      location: {
        // San Francisco. In the future, make this the user's current position
        center: "37.7749, -122.4194",
        type: "range",
        unit: "mi",
        ranges: [
          { from: 0, to: 100, name: "Nearby" },
          { from: 100, to: 500, name: "A longer drive" },
          { from: 500, name: "Perhaps fly?" }
        ]
      },
      date_established: {
        type: "range",
        ranges: [
          {
            from: moment().subtract(50, "years").toISOString(),
            name: "Within the last 50 years"
          },
          {
            from: moment().subtract(100, "years").toISOString(),
            to: moment().subtract(50, "years").toISOString(),
            name: "50 - 100 years ago"
          },
          {
            to: moment().subtract(100, "years").toISOString(),
            name: "More than 100 years ago"
          }
        ]
      },
      visitors: {
        type: "range",
        ranges: [
          { from: 0, to: 10000, name: "0 - 10000" },
          { from: 10001, to: 100000, name: "10001 - 100000" },
          { from: 100001, to: 500000, name: "100001 - 500000" },
          { from: 500001, to: 1000000, name: "500001 - 1000000" },
          { from: 1000001, to: 5000000, name: "1000001 - 5000000" },
          { from: 5000001, to: 10000000, name: "5000001 - 10000000" },
          { from: 10000001, name: "10000001+" }
        ]
      }
    }
  },
  autocompleteQuery: {
    results: {
      search_fields: {
        parks_search_as_you_type: {}
      },
      resultsPerPage: 5,
      result_fields: {
        title: {
          snippet: {
            size: 100,
            fallback: true
          }
        },
        nps_link: {
          raw: {}
        }
      }
    },
    suggestions: {
      types: {
        documents: {
          fields: ["parks_completion"]
        }
      },
      size: 4
    }
  }
};

export default function App() {
  return (
    <SearchProvider config={config}>
      <ElasticsearchProdReady />
    </SearchProvider>
  );
}
