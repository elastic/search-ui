import React from "react";
import "@elastic/eui/dist/eui_theme_light.css";

import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

import {
  ErrorBoundary,
  SearchProvider,
  SearchBox,
  Results,
  WithSearch
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

// Cloud credentials, replace local credentials with it when the object and nested fields are available on Cloud
// const connector = new AppSearchAPIConnector({
//   searchKey:
//     process.env.REACT_APP_SEARCH_KEY || "search-nyxkw1fuqex9qjhfvatbqfmw",
//   engineName: process.env.REACT_APP_SEARCH_ENGINE_NAME || "magic-cards",
//   endpointBase:
//     process.env.REACT_APP_SEARCH_ENDPOINT_BASE ||
//     "https://search-ui-sandbox.ent.us-central1.gcp.cloud.es.io"
// });

// Local credentials
const connector = new AppSearchAPIConnector({
  searchKey:
    process.env.REACT_APP_SEARCH_KEY || "search-jizf9cusjmouqrbs1jqavn1c",
  engineName: process.env.REACT_APP_SEARCH_ENGINE_NAME || "magic-cards",
  endpointBase:
    process.env.REACT_APP_SEARCH_ENDPOINT_BASE || "http://localhost:3002"
});

const config = {
  debug: true,
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  searchQuery: {
    result_fields: {
      name: { raw: {} },
      text: { raw: {} },
      subtypes: { raw: {} },
      manaValue: { raw: {} },
      "purchaseUrls.cardKingdom": { raw: {} }
    }
  }
};

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch
        mapContextToProps={({ wasSearched }) => ({
          wasSearched
        })}
      >
        {() => {
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
                  bodyContent={<Results titleField="name" />}
                />
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
