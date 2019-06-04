import React from "react";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  WithSearch,
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

const config = {
  debug: true,
  onResultClick: () => {
    /* Not implemented */
  },
  onAutocompleteResultClick: () => {
    /* Not implemented */
  },
  onAutocomplete: async ({ searchTerm }) => {
    const body = buildRequest({ searchTerm });

    const response = await fetch(".netlify/functions/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    const json = await response.json();
    const state = buildState(json);
    return {
      autocompletedResults: state.results
    };
  },
  onSearch: async state => {
    const { resultsPerPage } = state;
    const body = buildRequest(state);

    const response = await fetch(".netlify/functions/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    const json = await response.json();

    return buildState(json, resultsPerPage);
  }
};

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch
        mapContextToProps={({ wasSearched }) => ({ wasSearched })}
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
                    <Facet
                      field="states"
                      label="States"
                      filterType="any"
                      isFilterable={true}
                    />
                    <Facet
                      field="world_heritage_site"
                      label="World Heritage Site?"
                    />
                    <Facet
                      field="visitors"
                      label="Visitors"
                      view={SingleLinksFacet}
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
      </WithSearch>
    </SearchProvider>
  );
}
