import "./styles.css";
import { SearchProvider, SearchBox } from "@elastic/react-search-ui";
import { config } from "./config";
import React from "react";

function InputView({ getAutocomplete, getInputProps, getButtonProps }) {
  return (
    <div className="nav-search">
      <div className="nav-search-searchbar">
        <input
          id="search"
          {...getInputProps({
            placeholder: "Search for products..."
          })}
          className="searchbar-input"
        />
        {getAutocomplete()}
        <div className="searchbar-iconContainer">
          <svg
            className="searchbar-icon"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

function getRaw(result, value) {
  if (!result[value] || !result[value].raw) return;
  return result[value].raw;
}

function getSnippet(result, value) {
  if (!result[value] || !result[value].snippet) return;
  return result[value].snippet;
}

function getSuggestionTitle(suggestionType, autocompleteSuggestions) {
  if (autocompleteSuggestions.sectionTitle) {
    return autocompleteSuggestions.sectionTitle;
  }

  if (
    autocompleteSuggestions[suggestionType] &&
    autocompleteSuggestions[suggestionType].sectionTitle
  ) {
    return autocompleteSuggestions[suggestionType].sectionTitle;
  }
}

function AutocompleteView({
  autocompleteResults,
  autocompletedResults,
  autocompleteSuggestions,
  autocompletedSuggestions,
  className,
  getItemProps,
  getMenuProps
}) {
  let index = 0;
  return (
    <div
      {...getMenuProps({
        className: ["sui-search-box__autocomplete-container", className].join(
          " "
        )
      })}
    >
      <div>
        {!!autocompleteSuggestions &&
          Object.entries(autocompletedSuggestions).map(
            ([suggestionType, suggestions]) => {
              return (
                <React.Fragment key={suggestionType}>
                  {getSuggestionTitle(
                    suggestionType,
                    autocompleteSuggestions
                  ) &&
                    suggestions.length > 0 && (
                      <div className="sui-search-box__section-title">
                        {getSuggestionTitle(
                          suggestionType,
                          autocompleteSuggestions
                        )}
                      </div>
                    )}
                  {suggestions.length > 0 && (
                    <ul className="sui-search-box__suggestion-list">
                      {suggestions.map((suggestion) => {
                        index++;
                        return (
                          <li
                            {...getItemProps({
                              key:
                                suggestion.suggestion || suggestion.highlight,
                              index: index - 1,
                              item: suggestion
                            })}
                            data-transaction-name="query suggestion"
                          >
                            {suggestion.highlight ? (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: suggestion.highlight
                                }}
                              />
                            ) : (
                              <span>{suggestion.suggestion}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </React.Fragment>
              );
            }
          )}
        {!!autocompleteResults &&
          !!autocompletedResults &&
          typeof autocompleteResults !== "boolean" &&
          autocompletedResults.length > 0 &&
          autocompleteResults.sectionTitle && (
            <div className="sui-search-box__section-title">
              {autocompleteResults.sectionTitle}
            </div>
          )}
        {!!autocompleteResults &&
          !!autocompletedResults &&
          autocompletedResults.length > 0 && (
            <ul className="autocomplete-results">
              {autocompletedResults.map((result) => {
                index++;
                const titleField =
                  typeof autocompleteResults === "boolean"
                    ? null
                    : autocompleteResults.titleField;
                const titleSnippet = getSnippet(result, titleField);
                const titleRaw = getRaw(result, titleField);
                // eslint-disable-next-line no-console
                return (
                  <li
                    {...getItemProps({
                      key: result.id.raw,
                      index: index - 1,
                      item: result
                    })}
                    className="autocomplete-result-item"
                  >
                    <img
                      className="autocomplete-result-item--img"
                      src={result.image.raw}
                    />
                    <h5>{titleRaw}</h5>
                  </li>
                );
              })}
            </ul>
          )}
      </div>
    </div>
  );
}

function Navigation(props) {
  return (
    <div className="navigation">
      <div className="nav-wrapper">
        <div className="nav-elements">
          <a className="nav-element-logo" href="/ecommerce">
            ES
          </a>
          <nav className="nav-links">
            <a className="nav-link" href="/ecommerce">
              Home
            </a>
            <a className="nav-link" href="/ecommerce/category/tvs">
              Electronics
            </a>
          </nav>
        </div>
        <SearchProvider
          config={{
            ...config,
            trackUrlState: false
          }}
        >
          <div className="nav-search">
            <SearchBox
              autocompleteResults={{
                sectionTitle: "Products",
                titleField: "name",
                urlField: "url"
              }}
              inputView={InputView}
              autocompleteView={AutocompleteView}
            />
          </div>
        </SearchProvider>
      </div>
    </div>
  );
}

export default Navigation;
