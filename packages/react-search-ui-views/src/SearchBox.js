import PropTypes from "prop-types";
import React from "react";
import Downshift from "downshift";

import { Result } from "./types";
import { Suggestion } from "./types";

function SearchBox(props) {
  const {
    useAutocomplete,
    autocompleteResults,
    autocompletedResults,
    autocompleteSuggestions,
    autocompletedSuggestions,
    isFocused,
    inputProps,
    onChange,
    onSelectAutocomplete,
    onSubmit,
    value
  } = props;
  const focusedClass = isFocused ? "focus" : "";

  // TODO Remove inline styles
  return (
    <form onSubmit={onSubmit}>
      <Downshift
        inputValue={value}
        onChange={onSelectAutocomplete}
        onInputValueChange={onChange}
        itemToString={item =>
          // TODO
          item
            ? item[autocompleteResults.titleField]
              ? item[autocompleteResults.titleField].raw ||
                item[autocompleteResults.titleField].snippet
              : item.suggestion
            : ""
        }
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          isOpen,
          highlightedIndex,
          selectedItem
        }) => {
          let index = 0;
          return (
            <div
              className="sui-search-box"
              style={{ position: "relative", overflow: "visible" }}
            >
              <input
                {...getInputProps({
                  placeholder: "Search your documents",
                  ...inputProps,
                  className: `sui-search-box__text-input ${focusedClass}`
                })}
              />
              <div
                {...getMenuProps({
                  style: {
                    position: "absolute",
                    top: "100%",
                    width: "100%"
                  }
                })}
              >
                {useAutocomplete && isOpen ? (
                  <div>
                    {autocompleteResults.sectionTitle && (
                      <div>{autocompleteResults.sectionTitle}</div>
                    )}
                    <ul>
                      {autocompletedResults.map(result => {
                        index++;
                        return (
                          // eslint-disable-next-line react/jsx-key
                          <li
                            {...getItemProps({
                              key: result.id.raw,
                              index: index - 1,
                              item: result,
                              style: {
                                backgroundColor:
                                  highlightedIndex === index - 1
                                    ? "lightgray"
                                    : "white",
                                fontWeight:
                                  selectedItem === result ? "bold" : "normal"
                              }
                            })}
                          >
                            {result[autocompleteResults.titleField].snippet ? (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html:
                                    result[autocompleteResults.titleField]
                                      .snippet
                                }}
                              />
                            ) : (
                              <span>
                                {result[autocompleteResults.titleField].raw}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    {Object.entries(autocompletedSuggestions).map(
                      ([suggestionType, suggestions]) => {
                        return (
                          <>
                            {autocompleteSuggestions[suggestionType] &&
                              autocompleteSuggestions[suggestionType]
                                .sectionTitle && (
                                <div>
                                  {
                                    autocompleteSuggestions[suggestionType]
                                      .sectionTitle
                                  }
                                </div>
                              )}
                            <ul>
                              {suggestions.map(suggestion => {
                                index++;
                                return (
                                  // eslint-disable-next-line react/jsx-key
                                  <li
                                    {...getItemProps({
                                      key:
                                        suggestion.suggestion ||
                                        suggestion.highlight,
                                      index: index - 1,
                                      item: suggestion,
                                      style: {
                                        backgroundColor:
                                          highlightedIndex === index - 1
                                            ? "lightgray"
                                            : "white",
                                        fontWeight:
                                          selectedItem === suggestion
                                            ? "bold"
                                            : "normal"
                                      }
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
                          </>
                        );
                      }
                    )}
                  </div>
                ) : null}
              </div>
              <input
                type="submit"
                value="Search"
                className="button sui-search-box__submit"
              />
            </div>
          );
        }}
      </Downshift>
    </form>
  );
}

SearchBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  useAutocomplete: PropTypes.bool,
  autocompleteResults: PropTypes.shape({
    titleField: PropTypes.string.isRequired,
    urlField: PropTypes.string.isRequired,
    sectionTitle: PropTypes.string
  }),
  autocompletedResults: PropTypes.arrayOf(Result).isRequired,
  autocompleteSuggestions: PropTypes.objectOf(
    PropTypes.shape({
      sectionTitle: PropTypes.string.isRequired
    })
  ),
  autocompletedSuggestions: PropTypes.objectOf(Suggestion).isRequired,
  onSelectAutocomplete: PropTypes.func,
  inputProps: PropTypes.object,
  isFocused: PropTypes.bool
};

export default SearchBox;
