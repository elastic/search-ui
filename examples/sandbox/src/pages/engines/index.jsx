import React from "react";
import "@elastic/eui/dist/eui_theme_light.css";

import EnginesAPIConnector from "@elastic/search-ui-engines-connector";

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
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

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

const SORT_OPTIONS = [
  {
    name: "Relevance",
    value: []
  },
  {
    name: "Youngest",
    value: [
      {
        field: "age",
        direction: "asc"
      }
    ]
  },
  {
    name: "Oldest",
    value: [
      {
        field: "age",
        direction: "desc"
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
                      debounceLength={0}
                      autocompleteResults={{
                        linkTarget: "_blank",
                        sectionTitle: "Results",
                        titleField: "name",
                        urlField: "name"
                      }}
                    />
                  }
                  sideContent={
                    <div>
                      {wasSearched && (
                        <Sorting label={"Sort by"} sortOptions={SORT_OPTIONS} />
                      )}
                      <Facet
                        field="color"
                        label="Color"
                        filterType="any"
                        isFilterable={true}
                      />
                      <Facet
                        field="age"
                        label="Age"
                        filterType="any"
                        isFilterable={true}
                      />
                    </div>
                  }
                  bodyContent={
                    <Results titleField="name" shouldTrackClickThrough={true} />
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
