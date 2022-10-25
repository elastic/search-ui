import React from "react";
import "@elastic/eui/dist/eui_theme_light.css";

import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

import moment from "moment";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch
} from "@elastic/react-search-ui";
import {
  BooleanFacet,
  Layout,
  SingleLinksFacet,
  SingleSelectFacet
} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

const connector = new AppSearchAPIConnector({
  searchKey:
    process.env.REACT_APP_SEARCH_KEY || "search-nyxkw1fuqex9qjhfvatbqfmw",
  engineName: process.env.REACT_APP_SEARCH_ENGINE_NAME || "national-parks",
  endpointBase:
    process.env.REACT_APP_SEARCH_ENDPOINT_BASE ||
    "https://search-ui-sandbox.ent.us-central1.gcp.cloud.es.io"
});

const config = {
  debug: true,
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  searchQuery: {
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
    disjunctiveFacets: ["acres", "states", "date_established", "location"],
    facets: {
      world_heritage_site: { type: "value" },
      states: { type: "value", size: 30 },
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
          fields: ["title"]
        }
      },
      size: 4
    }
  }
};

const SORT_OPTIONS = [
  {
    name: "Relevance",
    value: []
  },
  {
    name: "Title",
    value: [
      {
        field: "title",
        direction: "asc"
      }
    ]
  },
  {
    name: "State",
    value: [
      {
        field: "states",
        direction: "asc"
      }
    ]
  },
  {
    name: "State -> Title",
    value: [
      {
        field: "states",
        direction: "asc"
      },
      {
        field: "title",
        direction: "asc"
      }
    ]
  },
  {
    name: "Heritage Site -> State -> Title",
    value: [
      {
        field: "world_heritage_site",
        direction: "asc"
      },
      {
        field: "states",
        direction: "asc"
      },
      {
        field: "title",
        direction: "asc"
      }
    ]
  }
];

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch
        mapContextToProps={({ wasSearched }) => ({
          wasSearched
        })}
      >
        {({ wasSearched }) => {
          return (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={
                    <SearchBox
                      autocompleteMinimumCharacters={3}
                      autocompleteResults={{
                        linkTarget: "_blank",
                        sectionTitle: "Results",
                        titleField: "title",
                        urlField: "nps_link",
                        shouldTrackClickThrough: true,
                        clickThroughTags: ["test"]
                      }}
                      autocompleteSuggestions={true}
                      debounceLength={0}
                    />
                  }
                  sideContent={
                    <div>
                      {wasSearched && (
                        <Sorting label={"Sort by"} sortOptions={SORT_OPTIONS} />
                      )}
                      <Facet
                        field={"states"}
                        label="States"
                        filterType="any"
                        isFilterable={true}
                      />
                      <Facet
                        field={"world_heritage_site"}
                        label="World Heritage Site"
                        view={BooleanFacet}
                      />
                      <Facet
                        field="visitors"
                        label="Visitors"
                        view={SingleLinksFacet}
                      />
                      <Facet
                        field="date_established"
                        label="Date Established"
                        isFilterable={true}
                        filterType="any"
                      />
                      <Facet
                        field="location"
                        label="Distance"
                        filterType="any"
                      />
                      <Facet
                        field="acres"
                        label="Acres"
                        view={SingleSelectFacet}
                      />
                    </div>
                  }
                  bodyContent={
                    <Results
                      titleField="title"
                      urlField="nps_link"
                      thumbnailField="image_url"
                      shouldTrackClickThrough={true}
                    />
                  }
                  bodyHeader={
                    <React.Fragment>
                      {wasSearched && <PagingInfo />}
                      {wasSearched && <ResultsPerPage />}
                    </React.Fragment>
                  }
                  bodyFooter={<Paging />}
                />
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
