import React from "react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting
} from "@elastic/react-search-ui";
import { Layout, SingleSelectFacet } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

const connector = new AppSearchAPIConnector({
  searchKey:
    process.env.REACT_APP_SEARCH_KEY || "search-371auk61r2bwqtdzocdgutmg",
  engineName: process.env.REACT_APP_SEARCH_ENGINE_NAME || "search-ui-examples",
  hostIdentifier: process.env.REACT_APP_SEARCH_HOST_IDENTIFIER || "host-2376rb",
  endpointBase: process.env.REACT_APP_SEARCH_ENDPOINT_BASE || ""
});

export default function App() {
  return (
    <SearchProvider
      config={{
        searchQuery: {
          search_fields: {
            title: {},
            description: {}
          },
          result_fields: {
            title: {
              snippet: {
                size: 100,
                fallback: true
              }
            },
            nps_link: {
              raw: {}
            },
            description: {
              snippet: {
                size: 100,
                fallback: true
              }
            }
          },
          disjunctiveFacets: ["acres"],
          facets: {
            states: { type: "value", size: 30 },
            acres: {
              type: "range",
              ranges: [
                { from: -1, name: "Any" },
                { from: 0, to: 1000, name: "Small" },
                { from: 1001, to: 100000, name: "Medium" },
                { from: 100001, name: "Large" }
              ]
            }
          }
        },
        autocompleteQuery: {
          results: {
            search_fields: {
              title: {},
              description: {}
            },
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
          }
        },
        apiConnector: connector
      }}
    >
      {_ => (
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
                />
              }
              sideContent={
                <div>
                  <Sorting
                    sortOptions={[
                      {
                        name: "Relevance",
                        value: "",
                        direction: ""
                      },
                      {
                        name: "Title",
                        value: "title",
                        direction: "asc"
                      }
                    ]}
                  />
                  <Facet field="states" label="States" />
                  <Facet field="acres" label="Acres" view={SingleSelectFacet} />
                </div>
              }
              bodyContent={
                <Results
                  titleField="title"
                  urlField="nps_link"
                  shouldTrackClickThrough={true}
                />
              }
              bodyHeader={
                <React.Fragment>
                  <PagingInfo />
                  <ResultsPerPage />
                </React.Fragment>
              }
              bodyFooter={<Paging />}
            />
          </ErrorBoundary>
        </div>
      )}
    </SearchProvider>
  );
}
