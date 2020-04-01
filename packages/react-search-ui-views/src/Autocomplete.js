import PropTypes from "prop-types";
import React from "react";

function Autocomplete({
  viewHelpers,
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
        className: viewHelpers.appendClassName(
          "sui-search-box__autocomplete-container",
          className
        )
      })}
    >
      <div>
        {!!autocompleteSuggestions &&
          Object.entries(autocompletedSuggestions).map(
            ([suggestionType, suggestions]) => {
              return (
                <React.Fragment key={suggestionType}>
                  {viewHelpers.getSuggestionTitle(
                    suggestionType,
                    autocompleteSuggestions
                  ) &&
                    suggestions.length > 0 && (
                      <div className="sui-search-box__section-title">
                        {viewHelpers.getSuggestionTitle(
                          suggestionType,
                          autocompleteSuggestions
                        )}
                      </div>
                    )}
                  {suggestions.length > 0 && (
                    <ul className="sui-search-box__suggestion-list">
                      {suggestions.map(suggestion => {
                        index++;
                        return (
                          // eslint-disable-next-line react/jsx-key
                          <li
                            {...getItemProps({
                              key:
                                suggestion.suggestion || suggestion.highlight,
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
                  )}
                </React.Fragment>
              );
            }
          )}
        {!!autocompleteResults &&
          !!autocompletedResults &&
          autocompletedResults.length > 0 &&
          autocompleteResults.sectionTitle && (
            <div className="sui-search-box__section-title">
              {autocompleteResults.sectionTitle}
            </div>
          )}
        {!!autocompleteResults &&
          !!autocompletedResults &&
          autocompletedResults.length > 0 && (
            <ul className="sui-search-box__results-list">
              {autocompletedResults.map(result => {
                index++;
                const titleSnippet = viewHelpers.getSnippet(
                  result,
                  autocompleteResults.titleField
                );
                const titleRaw = viewHelpers.getRaw(
                  result,
                  autocompleteResults.titleField
                );
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
          )}
      </div>
    </div>
  );
}

Autocomplete.propTypes = {
  viewHelpers: PropTypes.object.isRequired,
  allAutocompletedItemsCount: PropTypes.number.isRequired,
  autocompleteResults: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      titleField: PropTypes.string.isRequired,
      urlField: PropTypes.string.isRequired,
      linkTarget: PropTypes.string,
      sectionTitle: PropTypes.string
    })
  ]),
  autocompletedResults: PropTypes.array.isRequired,
  autocompletedSuggestions: PropTypes.objectOf(PropTypes.array).isRequired,
  autocompletedSuggestionsCount: PropTypes.number.isRequired,
  autocompleteSuggestions: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.exact({
      sectionTitle: PropTypes.string
    }),
    PropTypes.objectOf(
      PropTypes.exact({
        sectionTitle: PropTypes.string
      })
    )
  ]),
  getItemProps: PropTypes.func.isRequired,
  getMenuProps: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default Autocomplete;
