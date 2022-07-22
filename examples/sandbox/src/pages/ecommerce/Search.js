import React from "react";
import "@elastic/eui/dist/eui_theme_light.css";

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
import { Layout, SingleLinksFacet } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import { config, SORT_OPTIONS } from "./config";

const CustomResultView = ({ result, onClickLink }) => (
  <li className="sui-result">
    <div className="sui-result__header">
      <h3>
        <a
          onClick={onClickLink}
          href={result.url.raw}
          dangerouslySetInnerHTML={{ __html: result.name.snippet }}
          target="_blank"
        />
      </h3>
    </div>
    <div className="sui-result__body">
      <div className="sui-result__image">
        <img src={result.image.raw} />
      </div>
      <div className="sui-result__details">
        <div>
          ${result.price.raw}
          <br />
          {result.shipping && result.shipping.raw !== undefined
            ? result.shipping.raw === 0
              ? "Free shipping"
              : `+$${result.shipping.raw} shipping`
            : ""}
          {}
        </div>
        <br />
        <div>
          {[...Array(result.rating.raw)]
            .fill("★")
            .concat([...Array(5 - result.rating.raw)].fill("☆"))}{" "}
          {result.votes.raw}
        </div>
        <br />
        <div dangerouslySetInnerHTML={{ __html: result.description.snippet }} />
      </div>
    </div>
  </li>
);

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
                        titleField: "name",
                        urlField: "url"
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
                        field={"categories"}
                        label="Category"
                        filterType="any"
                      />
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
  );
}
