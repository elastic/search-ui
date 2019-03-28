import PropTypes from "prop-types";
import React from "react";

import { Result } from "./types";
import { Suggestion } from "./types";

function getRaw(result, value) {
  if (!result[value] || !result[value].raw) return;
  return result[value].raw;
}

function getSnippet(result, value) {
  if (!result[value] || !result[value].snippet) return;
  return result[value].snippet;
}

function Autocomplete({
  autocompleteResults,
  autocompletedResults,
  autocompleteSuggestions,
  autocompletedSuggestions,
  getItemProps,
  getMenuProps
}) {
  let index = 0;
  return (
    <div
      {...getMenuProps({
        className: "sui-search-box__autocomplete-container"
      })}
    >
      <div>
        {autocompleteResults.sectionTitle && (
          <div className="sui-search-box__section-title">
            {autocompleteResults.sectionTitle}
          </div>
        )}
        <ul>
          {autocompletedResults.map(result => {
            index++;
            const titleSnippet = getSnippet(
              result,
              autocompleteResults.titleField
            );
            const titleRaw = getRaw(result, autocompleteResults.titleField);
            return (
              // eslint-disable-next-line react/jsx-key
              <li
                {...getItemProps({
                  key: result.id.raw,
                  index: index - 1,
                  item: result
                })}
              >
                {titleSnippet ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: titleSnippet
                    }}
                  />
                ) : (
                  <span>{titleRaw}</span>
                )}
              </li>
            );
          })}
        </ul>
        {Object.entries(autocompletedSuggestions).map(
          ([suggestionType, suggestions]) => {
            return (
              <React.Fragment key={suggestionType}>
                {autocompleteSuggestions[suggestionType] &&
                  autocompleteSuggestions[suggestionType].sectionTitle && (
                    <div className="sui-search-box__section-title">
                      {autocompleteSuggestions[suggestionType].sectionTitle}
                    </div>
                  )}
                <ul>
                  {suggestions.map(suggestion => {
                    index++;
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <li
                        {...getItemProps({
                          key: suggestion.suggestion || suggestion.highlight,
                          index: index - 1,
                          item: suggestion
                        })}
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
              </React.Fragment>
            );
          }
        )}
      </div>
    </div>
  );
}

Autocomplete.propTypes = {
  autocompleteResults: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      titleField: PropTypes.string.isRequired,
      urlField: PropTypes.string.isRequired,
      linkTarget: PropTypes.string,
      sectionTitle: PropTypes.string
    })
  ]),
  autocompletedResults: PropTypes.arrayOf(Result).isRequired,
  autocompletedSuggestions: PropTypes.objectOf(PropTypes.arrayOf(Suggestion))
    .isRequired,
  autocompleteSuggestions: PropTypes.objectOf(
    PropTypes.shape({
      sectionTitle: PropTypes.string.isRequired
    })
  ),
  getItemProps: PropTypes.func.isRequired,
  getMenuProps: PropTypes.func.isRequired
};

export default Autocomplete;
