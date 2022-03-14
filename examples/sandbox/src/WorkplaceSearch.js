import React from "react";
import {
  EuiButton,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiText,
  EuiProvider
} from "@elastic/eui";
import "@elastic/eui/dist/eui_theme_light.css";

import WorkplaceSearchAPIConnector from "@elastic/search-ui-workplace-search-connector";
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
import {
  BooleanFacet,
  Layout,
  SingleLinksFacet,
  SingleSelectFacet
} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import {
  config as WorkplaceSearchConfig,
  fields as WorkplaceSearchFields
} from "./configurations/WorkplaceSearch";
import "./App.css";

const fields = WorkplaceSearchFields;

const SORT_OPTIONS = [
  {
    name: "Relevance",
    value: []
  },
  {
    name: "Title",
    value: [
      {
        field: fields.title,
        direction: "asc"
      }
    ]
  },
  {
    name: "State",
    value: [
      {
        field: fields.states,
        direction: "asc"
      }
    ]
  },
  {
    name: "State -> Title",
    value: [
      {
        field: fields.states,
        direction: "asc"
      },
      {
        field: fields.title,
        direction: "asc"
      }
    ]
  },
  {
    name: "Heritage Site -> State -> Title",
    value: [
      {
        field: fields.world_heritage_site,
        direction: "asc"
      },
      {
        field: fields.states,
        direction: "asc"
      },
      {
        field: fields.title,
        direction: "asc"
      }
    ]
  }
];

let connector = new WorkplaceSearchAPIConnector({
  kibanaBase:
    process.env.REACT_WORKPLACE_SEARCH_KIBANA_BASE ||
    "https://search-ui-sandbox.kb.us-central1.gcp.cloud.es.io:9243",
  enterpriseSearchBase:
    process.env.REACT_WORKPLACE_SEARCH_ENTERPRISE_SEARCH_BASE ||
    "https://search-ui-sandbox.ent.us-central1.gcp.cloud.es.io",
  redirectUri:
    process.env.REACT_WORKPLACE_SEARCH_REDIRECT_URI || "http://localhost:3000",
  clientId:
    process.env.REACT_WORKPLACE_SEARCH_CLIENT_ID ||
    "8e495e40fc1e6acf515e557e534de39d4f727f7f60a3afed24a99ce3a6607c1e"
});

const config = {
  debug: true,
  alwaysSearchOnInitialLoad: true,
  ...WorkplaceSearchConfig,
  apiConnector: connector,
  hasA11yNotifications: true
};

export default function WorkplaceSearch() {
  return (
    <EuiProvider colorMode="light">
      <SearchProvider config={config}>
        <WithSearch
          mapContextToProps={({ wasSearched, authorizeUrl, isLoggedIn }) => ({
            wasSearched,
            authorizeUrl,
            isLoggedIn
          })}
        >
          {({ wasSearched, authorizeUrl, isLoggedIn }) => {
            return (
              <div className="App">
                <ErrorBoundary>
                  {!isLoggedIn && (
                    <EuiModal
                      onClose={() => {}}
                      maxWidth={354}
                      className="login-modal"
                    >
                      <EuiModalHeader className="login-modal__header">
                        <EuiModalHeaderTitle>
                          <h1>Log in to continue</h1>
                        </EuiModalHeaderTitle>
                      </EuiModalHeader>

                      <EuiModalBody>
                        <EuiText size="m">
                          <p>
                            Search UI requires an active, authorized connection
                            to Elastic Enteprise Search.
                            <br />
                            Select “Log in” below to continue.
                          </p>
                        </EuiText>
                      </EuiModalBody>

                      <EuiModalFooter>
                        <EuiButton href={authorizeUrl} fill fullWidth>
                          Log in
                        </EuiButton>
                      </EuiModalFooter>
                    </EuiModal>
                  )}
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
                          <Sorting
                            label={"Sort by"}
                            sortOptions={SORT_OPTIONS}
                          />
                        )}
                        <Facet
                          field={fields.source}
                          label="Source"
                          filterType="any"
                        />
                        <Facet
                          field={fields.type}
                          label="Type"
                          filterType="any"
                          isFilterable={true}
                        />
                        <Facet
                          field={fields.states}
                          label="States"
                          filterType="any"
                          isFilterable={true}
                        />
                        <Facet
                          field={fields.world_heritage_site}
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
                        <Facet
                          field="location"
                          label="Distance"
                          filterType="any"
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
          }}
        </WithSearch>
      </SearchProvider>
    </EuiProvider>
  );
}
