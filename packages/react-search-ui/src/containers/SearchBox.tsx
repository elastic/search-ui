import React, { useState } from "react";
import {
  SearchBox,
  SearchBoxContainerProps
} from "@elastic/react-search-ui-views";
import { useSearch } from "../hooks";

const SearchBoxContainer = ({
  autocompleteMinimumCharacters = 0,
  autocompleteResults,
  autocompleteSuggestions,
  className,
  autocompleteView,
  inputProps,
  inputView,
  onSelectAutocomplete,
  shouldClearFilters = true,
  onSubmit,
  searchAsYouType,
  debounceLength,
  view,
  ...rest
}: SearchBoxContainerProps) => {
  const {
    autocompletedResults,
    autocompletedSuggestions,
    searchTerm,
    setSearchTerm,
    trackAutocompleteClickThrough,
    trackAutocompleteSuggestionClickThrough
  } = useSearch();

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchTerm, {
      shouldClearFilters
    });
  };

  const handleChange = (value) => {
    const options = {
      autocompleteMinimumCharacters,
      ...((autocompleteResults ||
        autocompleteSuggestions ||
        searchAsYouType) && {
        debounce: debounceLength || 200
      }),
      shouldClearFilters,
      refresh: !!searchAsYouType,
      autocompleteResults: !!autocompleteResults,
      autocompleteSuggestions: !!autocompleteSuggestions
    };

    setSearchTerm(value, options);
  };

  const handleNotifyAutocompleteSelected = (selection) => {
    // results
    if (autocompleteResults) {
      const autocompleteResultsConfig =
        autocompleteResults === true
          ? { clickThroughTags: [], shouldTrackClickThrough: true }
          : autocompleteResults;

      if (
        !selection.suggestion &&
        autocompleteResultsConfig.shouldTrackClickThrough !== false
      ) {
        const { clickThroughTags = [] } = autocompleteResultsConfig;
        const id = selection.id?.raw;
        trackAutocompleteClickThrough(id, clickThroughTags);
      }

      if (selection.suggestion) {
        trackAutocompleteSuggestionClickThrough(
          selection.suggestion,
          selection.index,
          []
        );
      }
    }
  };
  const completeSuggestion = (searchTerm) => {
    setSearchTerm(searchTerm, {
      shouldClearFilters
    });
  };
  const defaultOnSelectAutocomplete = (selection) => {
    if (!selection) return;

    handleNotifyAutocompleteSelected(selection);
    if (!selection.suggestion && typeof autocompleteResults !== "boolean") {
      const url = selection[autocompleteResults.urlField]
        ? selection[autocompleteResults.urlField].raw
        : "";
      if (url) {
        const target =
          (typeof autocompleteResults !== "boolean" &&
            autocompleteResults.linkTarget) ||
          "_self";
        window.open(url, target);
      }
    } else {
      completeSuggestion(selection.suggestion);
    }
  };
  const View = view || SearchBox;

  const useAutocomplete =
    (!!autocompleteResults || !!autocompleteSuggestions) &&
    searchTerm.length >= autocompleteMinimumCharacters;
  const autocompletedSuggestionsCount = Object.entries(
    autocompletedSuggestions
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ).reduce((acc, [_, value]: [any, any]) => acc + value.length, 0);

  const allAutocompletedItemsCount =
    autocompletedSuggestionsCount + autocompletedResults.length;
  let handleOnSelectAutocomplete;
  if (onSelectAutocomplete) {
    handleOnSelectAutocomplete = (selection) => {
      onSelectAutocomplete(
        selection,
        {
          notifyAutocompleteSelected: handleNotifyAutocompleteSelected,
          completeSuggestion: completeSuggestion,
          autocompleteResults: autocompleteResults
        },
        defaultOnSelectAutocomplete
      );
    };
  }
  const viewProps = {
    allAutocompletedItemsCount: allAutocompletedItemsCount,
    autocompleteView,
    autocompleteResults: autocompleteResults,
    autocompleteSuggestions: autocompleteSuggestions,
    autocompletedResults: autocompletedResults,
    autocompletedSuggestions: autocompletedSuggestions,
    className,
    autocompletedSuggestionsCount: autocompletedSuggestionsCount,
    completeSuggestion: completeSuggestion,
    isFocused: isFocused,
    notifyAutocompleteSelected: handleNotifyAutocompleteSelected,
    onChange: (value) => handleChange(value),
    onSelectAutocomplete:
      handleOnSelectAutocomplete || defaultOnSelectAutocomplete,
    onSubmit: onSubmit
      ? (e) => {
          e.preventDefault();
          onSubmit(searchTerm);
        }
      : handleSubmit,
    useAutocomplete: useAutocomplete,
    value: searchTerm,
    inputProps: {
      onFocus: handleFocus,
      onBlur: handleBlur,
      ...inputProps
    },
    inputView,
    ...rest
  };
  return <View {...viewProps} />;
};
export default SearchBoxContainer;
