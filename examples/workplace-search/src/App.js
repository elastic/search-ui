import React from "react";

import WorkplaceSearchAPIConnector from "@elastic/search-ui-workplace-search-connector";

import {
  SearchProvider,
  SearchBox,
  Results,
  WithSearch
} from "@elastic/react-search-ui";
import {
  Layout
} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

const connector = new WorkplaceSearchAPIConnector({
  endpointBase: "http://localhost:3002",
  redirectUri: "http://localhost:3000",
  clientId: "ace9c82ba444dafb593250e483dc66b24713f2e6e70bf4bc2eaafc5c682d45cd",
})

const config = {
  debug: true,
  alwaysSearchOnInitialLoad: true,
  searchQuery: {
    result_fields: {
      title: { raw: {} },
      description: { raw: {} },
      url: { raw: {} },
    },
  },
  apiConnector: connector
};

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => {
          return (
            <div className="App">
                <Layout
                  header={
                    <SearchBox />
                  }
                  bodyContent={
                    <Results
                      titleField="title"
                      urlField="nps_link"
                      thumbnailField="image_url"
                      shouldTrackClickThrough={true}
                    />
                  }
                />
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
