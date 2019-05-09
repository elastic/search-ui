import React from "react";
import elasticsearch from "elasticsearch";

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

import buildRequest from "./buildRequest";
import buildState from "./buildState";

const INDEX_NAME = process.env.REACT_APP_ELASTICSEARCH_INDEX_NAME;
const HOST = process.env.REACT_APP_ELASTICSEARCH_HOST;
const client = new elasticsearch.Client({
  host: HOST
});

export default function App() {
  return (
    <SearchProvider
      config={{
        debug: true,
        onResultClick: () => {
          /* no-op */
        },
        onAutocompleteResultClick: () => {
          /* no-op */
        },
        onAutocomplete: async ({ searchTerm }) => {
          const body = buildRequest({ searchTerm });

          const response = await client.search({
            index: INDEX_NAME,
            body
          });
          const state = buildState(response);
          return {
            autocompletedResults: state.results
          };
        },
        onSearch: state => {
          const { resultsPerPage } = state;
          const body = buildRequest(state);

          return client
            .search({
              index: INDEX_NAME,
              body
            })
            .then(body => buildState(body, resultsPerPage));
        }
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
                  autocompleteSuggestions={true}
                />
              }
              sideContent={
                <div>
                  {wasSearched && (
                    <Sorting
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
                    />
                  )}
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
                  {wasSearched && <ResultsPerPage />}
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
