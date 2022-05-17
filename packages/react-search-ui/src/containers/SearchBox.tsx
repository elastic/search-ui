import React, { Component } from "react";
import {
  SearchBox,
  SearchBoxContainerProps,
  SearchBoxContainerContext
} from "@elastic/react-search-ui-views";

import { withSearch } from "..";

export class SearchBoxContainer extends Component<SearchBoxContainerProps> {
  static defaultProps = {
    autocompleteMinimumCharacters: 0,
    shouldClearFilters: true
  };

  state = {
    isFocused: false
  };

  handleFocus = () => {
    this.setState({
      isFocused: true
    });
  };

  handleBlur = () => {
    this.setState({
      isFocused: false
    });
  };

  completeSuggestion = (searchTerm) => {
    const { shouldClearFilters, setSearchTerm } = this.props;
    setSearchTerm(searchTerm, {
      shouldClearFilters
    });
  };

  handleSubmit = (e) => {
    const { shouldClearFilters, searchTerm, setSearchTerm } = this.props;

    e.preventDefault();
    setSearchTerm(searchTerm, {
      shouldClearFilters
    });
  };

  handleChange = (value) => {
    const {
      autocompleteMinimumCharacters,
      autocompleteResults,
      autocompleteSuggestions,
      shouldClearFilters,
      searchAsYouType,
      setSearchTerm,
      debounceLength
    } = this.props;

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

  handleNotifyAutocompleteSelected = (selection) => {
    const { autocompleteResults, trackAutocompleteClickThrough } = this.props;
    // Because suggestions don't count as clickthroughs, only
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
    }
  };

  defaultOnSelectAutocomplete = (selection) => {
    if (!selection) return;

    const { autocompleteResults } = this.props;

    this.handleNotifyAutocompleteSelected(selection);
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
      this.completeSuggestion(selection.suggestion);
    }
  };

  render() {
    const { isFocused } = this.state;
    const {
      autocompleteMinimumCharacters,
      autocompleteResults,
      autocompleteSuggestions,
      autocompletedResults,
      autocompletedSuggestions,
      className,
      autocompleteView,
      inputProps,
      inputView,
      onSelectAutocomplete,
      onSubmit,
      searchTerm,
      view,
      ...rest
    } = this.props;

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
            notifyAutocompleteSelected: this.handleNotifyAutocompleteSelected,
            completeSuggestion: this.completeSuggestion,
            autocompleteResults: this.props.autocompleteResults
          },
          this.defaultOnSelectAutocomplete
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
      completeSuggestion: this.completeSuggestion,
      isFocused: isFocused,
      notifyAutocompleteSelected: this.handleNotifyAutocompleteSelected,
      onChange: (value) => this.handleChange(value),
      onSelectAutocomplete:
        handleOnSelectAutocomplete || this.defaultOnSelectAutocomplete,
      onSubmit: onSubmit
        ? (e) => {
            e.preventDefault();
            onSubmit(searchTerm);
          }
        : this.handleSubmit,
      useAutocomplete: useAutocomplete,
      value: searchTerm,
      inputProps: {
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        ...inputProps
      },
      inputView,
      ...rest
    };

    return <View {...viewProps} />;
  }
}

export default withSearch<SearchBoxContainerProps, SearchBoxContainerContext>(
  ({
    autocompletedResults,
    autocompletedSuggestions,
    searchTerm,
    setSearchTerm,
    trackAutocompleteClickThrough
  }) => ({
    autocompletedResults,
    autocompletedSuggestions,
    searchTerm,
    setSearchTerm,
    trackAutocompleteClickThrough
  })
)(SearchBoxContainer);
