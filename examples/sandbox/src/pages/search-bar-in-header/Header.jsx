import React from "react";

import { config } from "./config";

import { SearchBox } from "@elastic/react-search-ui";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import { Provider } from "./Provider";

export default function Header() {
  return (
    <div>
      <div
        style={{
          borderBottom: "1px solid black",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div
          style={{
            fontSize: "40px"
          }}
        >
          🚀 Acme Inc.
        </div>
        <Provider
          config={{
            ...config,
            trackUrlState: false
          }}
        >
          <SearchBox
            onSubmit={(searchTerm) => {
              window.location.href = `${window.location.origin}/search-bar-in-header/search?q=${searchTerm}`;
            }}
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
        </Provider>
      </div>
    </div>
  );
}
