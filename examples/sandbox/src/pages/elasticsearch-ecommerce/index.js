import React from "react";
import "@elastic/eui/dist/eui_theme_light.css";

import ElasticSearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
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
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

const connector = new ElasticSearchAPIConnector({
  host:
    process.env.REACT_ELASTICSEARCH_HOST ||
    "https://search-ui-sandbox.es.us-central1.gcp.cloud.es.io:9243",
  index: process.env.REACT_ELASTICSEARCH_INDEX || "mrp-products",
  apiKey:
    process.env.REACT_ELASTICSEARCH_API_KEY ||
    "UkFhQWxJQUJSQktSLWdGY1Rfa0s6YWIzSWpzc2JUX0tCaTNTTm1WbWUwZw=="
});

const config = {
  debug: true,
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  searchQuery: {
    search_fields: {
      name: {
        weight: 3
      },
      designerName: {},
      category_lvl1: {},
      category_lvl2: {},
      category_lvl3: {}
    },
    result_fields: {
      name: { raw: {}, snippet: { size: 100, fallback: true } },
      designerName: { raw: {} },
      category_lvl1: { raw: {} },
      category_lvl2: { raw: {} },
      category_lvl3: { raw: {} },
      imageURL: { raw: {} }
    },
    disjunctiveFacets: [
      "designerName.keyword",
      "category_lvl1.keyword",
      "category_lvl2.keyword",
      "category_lvl3.keyword"
    ],
    facets: {
      "designerName.keyword": { type: "value" },
      "category_lvl1.keyword": { type: "value", size: 30, sort: "count" }
    }
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      search_fields: {
        title_suggest: {}
      },
      result_fields: {
        title_suggest_display: {
          snippet: {
            size: 100,
            fallback: true
          }
        },
        imageURL: {
          raw: {}
        }
      }
    },
    suggestions: {
      types: {
        documents: {
          fields: ["suggestions"]
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
        field: "title.keyword",
        direction: "asc"
      }
    ]
  },
  {
    name: "State",
    value: [
      {
        field: "states.keyword",
        direction: "asc"
      }
    ]
  },
  {
    name: "State -> Title",
    value: [
      {
        field: "states.keyword",
        direction: "asc"
      },
      {
        field: "title.keyword",
        direction: "asc"
      }
    ]
  },
  {
    name: "Heritage Site -> State -> Title",
    value: [
      {
        field: "world_heritage_site.keyword",
        direction: "asc"
      },
      {
        field: "states.keyword",
        direction: "asc"
      },
      {
        field: "title.keyword",
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
                        titleField: "title_suggest_display",
                        urlField: "imageURL",
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
                        field="designerName.keyword"
                        label="Designer"
                        filterType="any"
                        isFilterable={true}
                      />
                    </div>
                  }
                  bodyContent={
                    <Results
                      titleField="name"
                      urlField="nps_link"
                      thumbnailField="imageURL"
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
