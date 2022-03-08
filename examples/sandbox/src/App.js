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

import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import SiteSearchAPIConnector from "@elastic/search-ui-site-search-connector";
import WorkplaceSearchAPIConnector from "@elastic/search-ui-workplace-search-connector";
import ElasticSearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
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
import { config as ElasticSearchConfig, fields as ElasticsearchFields } from './configurations/Elasticsearch';
import { config as EntSearchConfig, fields as EntSearchFields } from './configurations/EntSearch';
import "./App.css";

const sourceMode = process.env.REACT_APP_SOURCE

const isElasticsearchSource = sourceMode && sourceMode.indexOf("ELASTICSEARCH") !== -1;

const fields = isElasticsearchSource ? ElasticsearchFields : EntSearchFields;

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

let connector = null
let queryConfig = null

if (sourceMode === "ELASTICSEARCH_CONNECTOR") {
  connector = new ElasticSearchAPIConnector({
    host: process.env.REACT_ELASTICSEARCH_HOST || "http://localhost:9200",
    index: process.env.REACT_ELASTICSEARCH_INDEX || "us_parks"
  }, {
    queryFields: ["title", "description", "states"]
  });
  queryConfig = ElasticSearchConfig
} else if (process.env.REACT_APP_SOURCE === "SITE_SEARCH") {
  connector = new SiteSearchAPIConnector({
    engineKey:
      process.env.REACT_SITE_SEARCH_ENGINE_KEY || "Z43R5U3HiDsDgpKawZkA",
    documentType: process.env.REACT_SITE_SEARCH_ENGINE_NAME || "national-parks"
  });
  queryConfig = EntSearchConfig;
} else if (process.env.REACT_APP_SOURCE === "WORKPLACE_SEARCH") {
  queryConfig = EntSearchConfig;
  connector = new WorkplaceSearchAPIConnector({
    kibanaBase:
      process.env.REACT_WORKPLACE_SEARCH_KIBANA_BASE ||
      "https://search-ui-sandbox.kb.us-central1.gcp.cloud.es.io:9243",
    enterpriseSearchBase:
      process.env.REACT_WORKPLACE_SEARCH_ENTERPRISE_SEARCH_BASE ||
      "https://search-ui-sandbox.ent.us-central1.gcp.cloud.es.io",
    redirectUri:
      process.env.REACT_WORKPLACE_SEARCH_REDIRECT_URI ||
      "http://localhost:3000",
    clientId:
      process.env.REACT_WORKPLACE_SEARCH_CLIENT_ID ||
      "8e495e40fc1e6acf515e557e534de39d4f727f7f60a3afed24a99ce3a6607c1e"
  });
} else {
  connector = new AppSearchAPIConnector({
    searchKey:
      process.env.REACT_APP_SEARCH_KEY || "search-371auk61r2bwqtdzocdgutmg",
    engineName:
      process.env.REACT_APP_SEARCH_ENGINE_NAME || "search-ui-examples",
    hostIdentifier:
      process.env.REACT_APP_SEARCH_HOST_IDENTIFIER || "host-2376rb",
    endpointBase: process.env.REACT_APP_SEARCH_ENDPOINT_BASE || ""
  });
  queryConfig = EntSearchConfig;
}

const config = {
  debug: true,
  alwaysSearchOnInitialLoad: true,
  ...queryConfig,
  apiConnector: connector,
  hasA11yNotifications: true
};

export default function App() {
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
                  {process.env.REACT_APP_SOURCE === "WORKPLACE_SEARCH" &&
                    !isLoggedIn && (
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
                              Search UI requires an active, authorized
                              connection to Elastic Enteprise Search.
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
