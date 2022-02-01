import React, { Component } from "react";
import { SearchBox } from "@elastic/react-search-ui-views";

import { withSearch } from "..";
import { SearchContextState } from "../withSearch";
import { BaseContainerProps } from "../types";
import { AutocompleteResult } from "@elastic/search-ui/lib/esm/types";

type SearchBoxContainerContext = Pick<SearchContextState, "autocompletedResults" | "autocompletedSuggestions" | "searchTerm" | "setSearchTerm" | "trackAutocompleteClickThrough">;
type SearchBoxAutocompleteViewProps = any
type InputViewProps = any

type SearchBoxContainerProps = BaseContainerProps & SearchBoxContainerContext & {
  view?: React.ComponentType<SearchBoxViewProps>,
  autocompleteView?: React.ComponentType<SearchBoxAutocompleteViewProps>,
  inputView?: React.ComponentType<InputViewProps>,
  autocompleteMinimumCharacters?: number
  autocompleteResults?: AutocompleteResult | boolean
  autocompleteSuggestions?: boolean | Record<string, { sectionTitle: string }>
  shouldClearFilters?: boolean
  debounceLength?: number,
  inputProps?: Record<string, any>,
  onSelectAutocomplete?: any,
  onSubmit?: (searchTerm: string) => void,
  searchAsYouType?: boolean
};

export type SearchBoxViewProps = BaseContainerProps
  & Pick<SearchBoxContainerProps, "autocompleteView" | "inputView" | "autocompleteSuggestions" | "autocompleteResults" | "autocompleteSuggestions" | "autocompletedResults" | "autocompletedSuggestions">
  & {
    allAutocompletedItemsCount: number,
    autocompletedSuggestionsCount: any,
    completeSuggestion: (searchQuery: string) => void,
    isFocused: boolean,
    notifyAutocompleteSelected: (selection: any) => void,
    onChange: (value: string) => void,
    onSelectAutocomplete: any,
    onSubmit: () => void,
    useAutocomplete: boolean,
    value: string,
    inputProps: {
      onFocus: () => void,
      onBlur: () => void,
    } & Record<string, any>
  }

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

  completeSuggestion = searchTerm => {
    const { shouldClearFilters, setSearchTerm } = this.props;
    setSearchTerm(searchTerm, {
      shouldClearFilters
    });
  };

  handleSubmit = e => {
    const { shouldClearFilters, searchTerm, setSearchTerm } = this.props;

    e.preventDefault();
    setSearchTerm(searchTerm, {
      shouldClearFilters
    });
  };

  handleChange = value => {
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

  handleNotifyAutocompleteSelected = selection => {
    const { autocompleteResults, trackAutocompleteClickThrough } = this.props;
    // Because suggestions don't count as clickthroughs, only
    // results
    if (
      autocompleteResults &&
      autocompleteResults.shouldTrackClickThrough !== false &&
      !selection.suggestion
    ) {
      const { clickThroughTags = [] } = autocompleteResults;
      const id = selection.id.raw;
      trackAutocompleteClickThrough(id, clickThroughTags);
    }
  };

  defaultOnSelectAutocomplete = selection => {
    if (!selection) return;

    const { autocompleteResults } = this.props;

    this.handleNotifyAutocompleteSelected(selection);
    if (!selection.suggestion) {
      const url = selection[autocompleteResults.urlField]
        ? selection[autocompleteResults.urlField].raw
        : "";
      if (url) {
        const target = autocompleteResults.linkTarget || "_self";
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
      // eslint-disable-next-line no-unused-vars
    ).reduce((acc, [_, value]: [any, any]) => acc + value.length, 0);
    const allAutocompletedItemsCount =
      autocompletedSuggestionsCount + autocompletedResults.length;

    let handleOnSelectAutocomplete;
    if (onSelectAutocomplete) {
      handleOnSelectAutocomplete = selection => {
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
      onChange: value => this.handleChange(value),
      onSelectAutocomplete:
        handleOnSelectAutocomplete || this.defaultOnSelectAutocomplete,
      onSubmit: onSubmit
        ? e => {
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
