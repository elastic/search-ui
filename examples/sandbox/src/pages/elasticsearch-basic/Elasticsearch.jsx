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
import {
  BooleanFacet,
  Layout,
  SingleSelectFacet,
  SingleLinksFacet
} from "@elastic/react-search-ui-views";

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

export const Elasticsearch = () => {
  const { wasSearched } = useSearch();
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
                titleField: "title",
                urlField: "nps_link",
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
                field="states.keyword"
                label="States"
                filterType="any"
                isFilterable={true}
                persistent
              />
              <Facet
                field="world_heritage_site.keyword"
                label="World Heritage Site"
                view={BooleanFacet}
              />
              <Facet
                field="visitors"
                label="Visitors"
                view={SingleLinksFacet}
              />
              <Facet
                field="date_established"
                label="Date Established"
                isFilterable={true}
                filterType="any"
              />
              <Facet field="location" label="Distance" filterType="any" />
              <Facet field="visitors" label="visitors" persistent />
              <Facet field="acres" label="Acres" view={SingleSelectFacet} />
            </div>
          }
          bodyContent={
            <Results
              titleField="title"
              urlField="nps_link"
              thumbnailField="image_url"
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
};
