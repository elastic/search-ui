import React from "react";
import Downshift from "downshift";

import { appendClassName } from "./view-helpers";

import Autocomplete from "./Autocomplete";
import SearchInput from "./SearchInput";
import { SearchBoxViewProps } from "@elastic/react-search-ui";

function SearchBox(props: SearchBoxViewProps) {
  const {
    className,
    allAutocompletedItemsCount,
    autocompleteView,
    isFocused,
    inputProps = { className: "" },
    inputView,
    onChange,
    onSelectAutocomplete,
    onSubmit,
    useAutocomplete,
    value,
    // NOTE: These are explicitly de-structured but not used so that they are
    // not passed through to the input with the 'rest' parameter
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    autocompletedResults,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    autocompletedSuggestions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    autocompletedSuggestionsCount,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    completeSuggestion,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      onInputValueChange={(newValue) => {
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
      {(downshiftProps) => {
        const { closeMenu, getInputProps, isOpen } = downshiftProps;
        const autocompleteClass = isOpen === true ? " autocomplete" : "";
        return (
          <form
            onSubmit={(e) => {
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
                {...downshiftProps}
                getInputProps={(additionalProps) => {
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
                getButtonProps={(additionalProps) => {
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

export default SearchBox;
