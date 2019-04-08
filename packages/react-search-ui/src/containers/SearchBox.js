import PropTypes from "prop-types";
import React, { Component } from "react";
import { SearchBox } from "@elastic/react-search-ui-views";

import { withSearch } from "..";
import { Result, Suggestion } from "../types";

export class SearchBoxContainer extends Component {
  static propTypes = {
    // Props
    autocompleteMinimumCharacters: PropTypes.number,
    autocompleteResults: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        clickThroughTags: PropTypes.arrayOf(PropTypes.string),
        linkTarget: PropTypes.string,
        sectionTitle: PropTypes.string,
        shouldTrackClickThrough: PropTypes.bool,
        titleField: PropTypes.string.isRequired,
        urlField: PropTypes.string.isRequired
      })
    ]),
    autocompleteSuggestions: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ]),
    autocompleteView: PropTypes.func,
    debounceLength: PropTypes.number,
    inputProps: PropTypes.object,
    onSelectAutocomplete: PropTypes.func,
    searchAsYouType: PropTypes.bool,
    view: PropTypes.func,
    // State
    autocompletedResults: PropTypes.arrayOf(Result).isRequired,
    autocompletedSuggestions: PropTypes.objectOf(PropTypes.arrayOf(Suggestion))
      .isRequired,
    searchTerm: PropTypes.string.isRequired,
    // Actions
    setSearchTerm: PropTypes.func.isRequired,
    trackAutocompleteClickThrough: PropTypes.func.isRequired
  };

  static defaultProps = {
    autocompleteMinimumCharacters: 0
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

  handleSubmit = e => {
    const { searchTerm, setSearchTerm } = this.props;

    e.preventDefault();
    setSearchTerm(searchTerm);
  };

  handleChange = value => {
    const {
      autocompleteMinimumCharacters,
      autocompleteResults,
      autocompleteSuggestions,
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

  render() {
    const { isFocused } = this.state;
    const {
      autocompleteMinimumCharacters,
      autocompleteResults,
      autocompleteSuggestions,
      autocompletedResults,
      autocompletedSuggestions,
      inputProps,
      onSelectAutocomplete,
      searchTerm,
      view
    } = this.props;

    const View = view || SearchBox;
    const useAutocomplete =
      (!!autocompleteResults || !!autocompleteSuggestions) &&
      searchTerm.length >= autocompleteMinimumCharacters;
    const autocompletedSuggestionsCount = Object.entries(
      autocompletedSuggestions
      // eslint-disable-next-line no-unused-vars
    ).reduce((acc, [_, value]) => acc + value.length, 0);
    const allAutocompletedItemsCount =
      autocompletedSuggestionsCount + autocompletedResults.length;

    return View({
      allAutocompletedItemsCount: allAutocompletedItemsCount,
      autocompleteResults: autocompleteResults,
      autocompleteSuggestions: autocompleteSuggestions,
      autocompletedSuggestionsCount: autocompletedSuggestionsCount,
      autocompletedResults: autocompletedResults,
      autocompletedSuggestions: autocompletedSuggestions,
      isFocused: isFocused,
      notifyAutocompleteSelected: this.handleNotifyAutocompleteSelected,
      onChange: value => this.handleChange(value),
      onSelectAutocomplete: onSelectAutocomplete,
      onSubmit: this.handleSubmit,
      useAutocomplete: useAutocomplete,
      value: searchTerm,
      inputProps: {
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        ...inputProps
      }
    });
  }
}

export default withSearch(SearchBoxContainer);
