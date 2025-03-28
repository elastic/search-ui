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
  SingleLinksFacet,
  SingleSelectFacet
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
        field: "title",
        direction: "asc"
      }
    ]
  },
  {
    name: "State",
    value: [
      {
        field: "states",
        direction: "asc"
      }
    ]
  },
  {
    name: "State -> Title",
    value: [
      {
        field: "states",
        direction: "asc"
      },
      {
        field: "title",
        direction: "asc"
      }
    ]
  },
  {
    name: "Heritage Site -> State -> Title",
    value: [
      {
        field: "world_heritage_site",
        direction: "asc"
      },
      {
        field: "states",
        direction: "asc"
      },
      {
        field: "title",
        direction: "asc"
      }
    ]
  }
];
export const SearchAsYouType = () => {
  const { wasSearched } = useSearch();
  return (
    <div className="App">
      <ErrorBoundary>
        <Layout
          header={
            <SearchBox
              // Set debounceLength and searchAsYouType props
              debounceLength={300}
              searchAsYouType={true}
            />
          }
          sideContent={
            <div>
              {wasSearched && (
                <Sorting label={"Sort by"} sortOptions={SORT_OPTIONS} />
              )}
              <Facet
                field={"states"}
                label="States"
                filterType="any"
                isFilterable={true}
              />
              <Facet
                field={"world_heritage_site"}
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
                filterType="any"
              />
              <Facet field="location" label="Distance" filterType="any" />
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
