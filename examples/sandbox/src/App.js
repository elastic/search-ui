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
import {
  Layout,
  SingleSelectFacet,
  SingleLinksFacet
} from "@elastic/react-search-ui-views";
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
        debug: true,
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
          disjunctiveFacets: ["acres", "states"],
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
        initialState: {
          sortField: "title",
          sortDirection: "asc"
        },
        autocompleteQuery: {
          results: {
            resultsPerPage: 5,
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
          },
          suggestions: {
            types: {
              documents: {
                fields: ["title"]
              }
            }
          }
        },
        apiConnector: connector
      }}
    >
      {({ wasSearched }) => (
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
                  autocompleteSuggestions={{
                    sectionTitle: "Suggested Queries"
                  }}
                />
              }
              sideContent={
                <div>
                  {wasSearched && <Sorting
                    label={"Sort by"}
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
                  />}
                  <Facet field="states" label="States" filterType="any" />
                  <Facet
                    field="world_heritage_site"
                    label="World Heritage Site?"
                  />
                  <Facet
                    field="visitors"
                    label="Visitors"
                    view={SingleLinksFacet}
                  />
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
                  {wasSearched && <PagingInfo />}
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
