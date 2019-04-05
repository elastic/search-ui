import PropTypes from "prop-types";
import React, { Component } from "react";
import { SearchBox } from "@elastic/react-search-ui-views";

import { withSearch } from "..";
import { Result } from "../types";

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
    autocompleteView: PropTypes.func,
    debounceLength: PropTypes.number,
    inputProps: PropTypes.object,
    onSelectAutocomplete: PropTypes.func,
    searchAsYouType: PropTypes.bool,
    view: PropTypes.func,
    // State
    autocompletedResults: PropTypes.arrayOf(Result).isRequired,
    searchTerm: PropTypes.string.isRequired,
    // Actions
    setSearchTerm: PropTypes.func.isRequired,
    trackAutocompleteClickThrough: PropTypes.func.isRequired
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
      searchAsYouType,
      setSearchTerm,
      debounceLength
    } = this.props;

    const options = {
      autocompleteMinimumCharacters,
      ...((autocompleteResults || searchAsYouType) && {
        debounce: debounceLength || 200
      }),
      refresh: !!searchAsYouType,
      autocompleteResults: !!autocompleteResults
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
      autocompleteMinimumCharacters = 0,
      autocompleteResults,
      autocompletedResults,
      inputProps,
      onSelectAutocomplete,
      searchTerm,
      view
    } = this.props;

    const View = view || SearchBox;
    const useAutocomplete =
      !!autocompleteResults &&
      searchTerm.length >= autocompleteMinimumCharacters;

    return View({
      autocompleteResults: autocompleteResults,
      autocompletedResults: autocompletedResults,
      autocompletedSuggestions: {},
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
