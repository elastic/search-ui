import React from "react";
import {
  ErrorBoundary,
  Facet,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  useSearch
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";

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
export const Engines = () => {
  const { wasSearched } = useSearch();
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
};
