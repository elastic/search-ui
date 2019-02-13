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
  MultiValueFacet,
  SingleRangeSelectFacet
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
        apiConnector: connector,
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
      }}
    >
      {_ => (
        <div className="App">
          <Layout
            header={<SearchBox />}
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
                <Facet field="states" label="States" view={MultiValueFacet} />
                <Facet
                  field="acres"
                  label="Acres"
                  view={SingleRangeSelectFacet}
                />
              </div>
            }
            bodyContent={
              <ErrorBoundary>
                <Results titleField="title" urlField="nps_link" />
              </ErrorBoundary>
            }
            bodyHeader={
              <React.Fragment>
                <PagingInfo />
                <ResultsPerPage />
              </React.Fragment>
            }
            bodyFooter={<Paging />}
          />
        </div>
      )}
    </SearchProvider>
  );
}
