import PropTypes from "prop-types";
import React from "react";
import Downshift from "downshift";

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
    onSubmit,
    value
  } = props;
  const focusedClass = isFocused ? "focus" : "";

  const onSelectAutocomplete =
    props.onSelectAutocomplete ||
    (selection => {
      if (!selection.suggestion) {
        const url = selection[autocompleteResults.urlField]
          ? selection[autocompleteResults.urlField].raw
          : "";
        if (url) {
          const target = autocompleteResults.linkTarget || "_self";
          window.open(url, target);
        }
      }
    });

  return (
    <Downshift
      inputValue={value}
      onChange={onSelectAutocomplete}
      onInputValueChange={onChange}
      // Because when a selection is made, we don't really want to change
      // the inputValue. This is supposed to be a "controlled" value, and when
      // this happens we lose control of it.
      itemToString={() => value}
    >
      {({ closeMenu, getInputProps, getItemProps, getMenuProps, isOpen }) => {
        let index = 0;
        let autocompleteClass = isOpen === true ? " autocomplete" : "";
        return (
          <form
            onSubmit={e => {
              closeMenu();
              onSubmit(e);
            }}
          >
            <div className={"sui-search-box" + autocompleteClass}>
              <div className="sui-search-box__wrapper">
                <input
                  {...getInputProps({
                    placeholder: "Search your documents",
                    ...inputProps,
                    className: `sui-search-box__text-input ${focusedClass}`
                  })}
                />
                {useAutocomplete &&
                isOpen &&
                (autocompletedResults.length > 0 ||
                  Object.entries(autocompletedSuggestions).length > 0) ? (
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
                          const titleRaw = getRaw(
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
                      {Object.entries(autocompletedSuggestions).map(
                        ([suggestionType, suggestions]) => {
                          return (
                            <>
                              {autocompleteSuggestions[suggestionType] &&
                                autocompleteSuggestions[suggestionType]
                                  .sectionTitle && (
                                  <div className="sui-search-box__section-title">
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
                            </>
                          );
                        }
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
              <input
                type="submit"
                value="Search"
                className="button sui-search-box__submit"
              />
            </div>
          </form>
        );
      }}
    </Downshift>
  );
}

SearchBox.propTypes = {
  // Provided by container
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
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
  autocompleteSuggestions: PropTypes.objectOf(
    PropTypes.shape({
      sectionTitle: PropTypes.string.isRequired
    })
  ),
  autocompletedSuggestions: PropTypes.objectOf(Suggestion).isRequired,
  inputProps: PropTypes.object,
  isFocused: PropTypes.bool,
  useAutocomplete: PropTypes.bool,

  // Specific configuration for this view only
  onSelectAutocomplete: PropTypes.func
};

export default SearchBox;
