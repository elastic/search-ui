import PropTypes from "prop-types";
import React from "react";
import Downshift from "downshift";

import { Result } from "./types";
import { Suggestion } from "./types";

import Autocomplete from "./Autocomplete";

function SearchBox(props) {
  const {
    useAutocomplete,
    autocompleteResults,
    autocompletedResults,
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
      {downshiftProps => {
        const { closeMenu, getInputProps, isOpen } = downshiftProps;
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
                  <Autocomplete {...props} {...downshiftProps} />
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
