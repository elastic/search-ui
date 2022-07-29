import React from "react";
import "@elastic/eui/dist/eui_theme_light.css";
import { config, SORT_OPTIONS } from "./config";

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
import {
  Layout,
  SingleLinksFacet,
  BooleanFacet
} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import { CustomResultView } from "./CustomResultView";
import Navigation from "./components/Navigation";

const categoryPageconfig = {
  ...config,
  searchQuery: {
    ...config.searchQuery,
    filters: [{ field: "parent_category", values: ["TVs"] }],
    facets: {
      ...config.searchQuery.facets,
      price: {
        type: "range",
        ranges: [
          { from: 0, to: 200, name: "Under $200" },
          { from: 200, to: 500, name: "$200 to $500" },
          { from: 500, to: 1000, name: "$500 to $1000" },
          { from: 1000, to: 2000, name: "$1000 to $2000" },
          { from: 2000, name: "$2000 & Above" }
        ]
      }
    }
  }
};

export default function CategoryPageTv() {
  return (
    <>
      <Navigation />
      <SearchProvider config={categoryPageconfig}>
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
                          field="tv_smart_tv"
                          label="Smart TV"
                          view={BooleanFacet}
                        />
                        <Facet field="tv_resolution" label="Resolution" />
                        <Facet field="tv_size" label="Diagonal size" />
                        <Facet
                          field="rating"
                          label="Rating"
                          view={SingleLinksFacet}
                        />
                        <Facet field="manufacturer" label="Manufacturer" />
                        <Facet field="price" label="Price" filterType="any" />
                        <Facet field="shipping" label="Shipping" />
                      </div>
                    }
                    bodyContent={
                      <Results
                        titleField="name"
                        urlField="url"
                        thumbnailField="image"
                        shouldTrackClickThrough={true}
                        resultView={CustomResultView}
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
