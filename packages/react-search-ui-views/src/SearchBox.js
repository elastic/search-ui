import PropTypes from "prop-types";
import React from "react";
import Downshift from "downshift";

import { Result } from "./types";
import { Suggestion } from "./types";
import { appendClassName } from "./view-helpers";

import Autocomplete from "./Autocomplete";
import SearchInput from "./SearchInput";

function SearchBox(props) {
  const {
    className,
    allAutocompletedItemsCount,
    autocompleteView,
    isFocused,
    inputProps = {},
    inputView,
    onChange,
    onSelectAutocomplete,
    onSubmit,
    useAutocomplete,
    value,
    // eslint-disable-next-line no-unused-vars
    autocompletedResults,
    // eslint-disable-next-line no-unused-vars
    autocompletedSuggestions,
    // eslint-disable-next-line no-unused-vars
    autocompletedSuggestionsCount,
    // eslint-disable-next-line no-unused-vars
    completeSuggestion,
    // eslint-disable-next-line no-unused-vars
    notifyAutocompleteSelected,
    ...rest
  } = props;
  const focusedClass = isFocused ? "focus" : "";
  const AutocompleteView = autocompleteView || Autocomplete;
  const InputView = inputView || SearchInput;

  return (
    <Downshift
      inputValue={value}
      onChange={onSelectAutocomplete}
      onInputValueChange={newValue => {
        // To avoid over dispatching
        if (value === newValue) return;
        onChange(newValue);
      }}
      // Because when a selection is made, we don't really want to change
      // the inputValue. This is supposed to be a "controlled" value, and when
      // this happens we lose control of it.
      itemToString={() => value}
      {...rest}
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
            <div
              className={
                appendClassName("sui-search-box", className) + autocompleteClass
              }
            >
              <InputView
                getInputProps={additionalProps => {
                  const { className, ...rest } = additionalProps || {};
                  return getInputProps({
                    placeholder: "Search",
                    ...inputProps,
                    className: appendClassName("sui-search-box__text-input", [
                      inputProps.className,
                      className,
                      focusedClass
                    ]),
                    ...rest
                  });
                }}
                getButtonProps={additionalProps => {
                  const { className, ...rest } = additionalProps || {};
                  return {
                    type: "submit",
                    value: "Search",
                    className: appendClassName(
                      "button sui-search-box__submit",
                      className
                    ),
                    ...rest
                  };
                }}
                getAutocomplete={() => {
                  if (
                    useAutocomplete &&
                    isOpen &&
                    allAutocompletedItemsCount > 0
                  ) {
                    return <AutocompleteView {...props} {...downshiftProps} />;
                  } else {
                    return null;
                  }
                }}
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
  allAutocompletedItemsCount: PropTypes.number.isRequired,
  autocompletedResults: PropTypes.arrayOf(Result).isRequired,
  autocompletedSuggestions: PropTypes.objectOf(PropTypes.arrayOf(Suggestion))
    .isRequired,
  autocompletedSuggestionsCount: PropTypes.number.isRequired,
  completeSuggestion: PropTypes.func.isRequired,
  notifyAutocompleteSelected: PropTypes.func.isRequired,
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
  autocompleteView: PropTypes.func,
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
  className: PropTypes.string,
  inputProps: PropTypes.object,
  inputView: PropTypes.func,
  isFocused: PropTypes.bool,
  useAutocomplete: PropTypes.bool,

  // Specific configuration for this view only
  onSelectAutocomplete: PropTypes.func
};

export default SearchBox;
