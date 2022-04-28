import React from "react";
import {
  EuiButton,
  EuiButtonEmpty,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiText,
  EuiProvider,
  EuiHeader,
  EuiHeaderSectionItem,
  EuiHeaderSection,
  EuiHeaderLogo
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
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import "./index.css";

const SORT_OPTIONS = [
  {
    name: "Relevance",
    value: []
  },
  {
    name: "Source",
    value: [
      {
        field: "source",
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
    process.env.REACT_WORKPLACE_SEARCH_REDIRECT_URI ||
    "http://localhost:3000/workplace-search/",
  clientId:
    process.env.REACT_WORKPLACE_SEARCH_CLIENT_ID ||
    "8e495e40fc1e6acf515e557e534de39d4f727f7f60a3afed24a99ce3a6607c1e"
});

const config = {
  debug: true,
  alwaysSearchOnInitialLoad: true,
  searchQuery: {
    disjunctiveFacets: [],
    facets: {
      source: { type: "value" },
      type: { type: "value" }
    }
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      result_fields: {
        title: {
          snippet: {
            size: 100,
            fallback: true
          }
        },
        nps_link: {
          raw: {}
        }
      }
    },
    suggestions: {
      types: {
        documents: {
          fields: ["title"]
        }
      },
      size: 4
    }
  },
  apiConnector: connector,
  hasA11yNotifications: true
};

export default function WorkplaceSearch() {
  return (
    <EuiProvider colorMode="light">
      <SearchProvider config={config}>
        <WithSearch
          mapContextToProps={({
            wasSearched,
            authorizeUrl,
            isLoggedIn,
            logout
          }) => ({
            wasSearched,
            authorizeUrl,
            isLoggedIn,
            logout
          })}
        >
          {({ wasSearched, authorizeUrl, isLoggedIn, logout }) => {
            return (
              <div className="App">
                <EuiHeader>
                  <EuiHeaderSection>
                    <EuiHeaderSectionItem>
                      <EuiHeaderLogo iconType="logoWorkplaceSearch">
                        Workplace Search
                      </EuiHeaderLogo>
                    </EuiHeaderSectionItem>
                  </EuiHeaderSection>
                  {isLoggedIn && (
                    <EuiHeaderSection side="right">
                      <EuiHeaderSectionItem>
                        <EuiButtonEmpty
                          iconType="exit"
                          onClick={() => logout()}
                        >
                          Logout
                        </EuiButtonEmpty>
                      </EuiHeaderSectionItem>
                    </EuiHeaderSection>
                  )}
                </EuiHeader>
                <ErrorBoundary>
                  {!isLoggedIn && (
                    <EuiModal maxWidth={354} className="login-modal">
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
                          field={"source"}
                          label="Source"
                          filterType="any"
                        />
                        <Facet
                          field={"type"}
                          label="Type"
                          filterType="any"
                          isFilterable={true}
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
