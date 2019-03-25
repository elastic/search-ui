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

  return (
    <Downshift
      inputValue={value}
      onChange={onSelectAutocomplete}
      onInputValueChange={onChange}
      stateReducer={(state, changes) => {
        return changes;
      }}
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
                <div
                  {...getMenuProps({
                    className: "sui-search-box__autocomplete-container"
                  })}
                >
                  {useAutocomplete && isOpen ? (
                    <div>
                      {autocompleteResults.sectionTitle && (
                        <div className="sui-search-box__section-title">
                          {autocompleteResults.sectionTitle}
                        </div>
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
                                item: result
                              })}
                            >
                              {result[autocompleteResults.titleField]
                                .snippet ? (
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
                  ) : null}
                </div>
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
