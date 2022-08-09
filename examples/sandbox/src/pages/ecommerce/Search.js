import React from "react";
import "@elastic/eui/dist/eui_theme_light.css";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch
} from "@elastic/react-search-ui";
import { Layout, SingleLinksFacet } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import { config, SORT_OPTIONS } from "./config";
import { CustomResultView } from "./CustomResultView";
import Navigation from "./components/Navigation";

export default function App() {
  return (
    <>
      <Navigation />
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
                    sideContent={
                      <div>
                        {wasSearched && (
                          <Sorting
                            label={"Sort by"}
                            sortOptions={SORT_OPTIONS}
                          />
                        )}
                        <Facet
                          field={"categories"}
                          label="Category"
                          filterType="any"
                          isFilterable={true}
                        />
                        <Facet
                          field="rating"
                          label="Rating"
                          view={SingleLinksFacet}
                        />
                        <Facet
                          field="manufacturer"
                          label="Manufacturer"
                          isFilterable={true}
                        />
                        <Facet field="price" label="Price" filterType="any" />
                        <Facet field="shipping" label="Shipping" />
                      </div>
                    }
                    bodyContent={
                      <Results
                        resultView={CustomResultView}
                        titleField="name"
                        urlField="url"
                        thumbnailField="image"
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
    </>
  );
}
