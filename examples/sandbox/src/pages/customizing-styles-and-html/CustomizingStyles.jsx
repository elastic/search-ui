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

// This is a custom component we've created.
import { ClearFilters } from "./ClearFilters";
// We import custom.css here to override styles defined by the out-of-the-box stylesheet
// above
import "./custom.css";
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

const CustomPagingInfoView = ({ start, end }) => (
  <div className="paging-info">
    <strong>
      {start} - {end}
    </strong>
  </div>
);

const CustomResultView = ({ result, onClickLink }) => (
  <li className="sui-result">
    <div className="sui-result__header">
      <h3>
        {/* Maintain onClickLink to correct track click throughs for analytics*/}
        <a onClick={onClickLink} href={result.nps_link.raw}>
          {result.title.snippet}
        </a>
      </h3>
    </div>
    <div className="sui-result__body">
      {/* use 'raw' values of fields to access values without snippets */}
      <div className="sui-result__image">
        <img src={result.image_url.raw} alt="" />
      </div>
      {/* Use the 'snippet' property of fields with dangerouslySetInnerHtml to render snippets */}
      <div
        className="sui-result__details"
        dangerouslySetInnerHTML={{ __html: result.description.snippet }}
      ></div>
    </div>
  </li>
);
export const CustomizingStylesApp = () => {
  const { wasSearched } = useSearch();

  return (
    <div className="App customization-example">
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
              <ClearFilters />
              <br />
              <br />
              {wasSearched && (
                <Sorting label={"Sort by"} sortOptions={SORT_OPTIONS} />
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
              resultView={CustomResultView}
              titleField="title"
              urlField="nps_link"
              thumbnailField="image_url"
              shouldTrackClickThrough={true}
            />
          }
          bodyHeader={
            <>
              {wasSearched && <PagingInfo view={CustomPagingInfoView} />}
              {wasSearched && <ResultsPerPage />}
            </>
          }
          bodyFooter={<Paging />}
        />
      </ErrorBoundary>
    </div>
  );
};
