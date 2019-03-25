import PropTypes from "prop-types";
import React, { Component } from "react";
import { SearchBox } from "@elastic/react-search-ui-views";

import { withSearch } from "..";
import { Result } from "../types";

export class SearchBoxContainer extends Component {
  static propTypes = {
    // Props
    autocompleteResults: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        titleField: PropTypes.string.isRequired,
        urlField: PropTypes.string.isRequired,
        linkTarget: PropTypes.string,
        sectionTitle: PropTypes.string
      })
    ]),
    debounceLength: PropTypes.number,
    inputProps: PropTypes.object,
    onSelectAutocomplete: PropTypes.func,
    searchAsYouType: PropTypes.bool,
    view: PropTypes.func,
    // State
    autocompletedResults: PropTypes.arrayOf(Result).isRequired,
    searchTerm: PropTypes.string.isRequired,
    // Actions
    setSearchTerm: PropTypes.func.isRequired
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
      autocompleteResults,
      searchAsYouType,
      setSearchTerm,
      debounceLength
    } = this.props;

    const options = {
      ...((autocompleteResults || searchAsYouType) && {
        debounce: debounceLength || 200
      }),
      refresh: !!searchAsYouType,
      autocompleteResults: !!autocompleteResults
    };

    setSearchTerm(value, options);
  };

  render() {
    const { isFocused } = this.state;
    const {
      autocompleteResults,
      autocompletedResults,
      inputProps,
      onSelectAutocomplete,
      searchTerm,
      view
    } = this.props;

    const View = view || SearchBox;

    return (
      <View
        autocompleteResults={autocompleteResults}
        autocompletedResults={autocompletedResults}
        autocompletedSuggestions={{}}
        isFocused={isFocused}
        onChange={value => this.handleChange(value)}
        onSelectAutocomplete={onSelectAutocomplete}
        onSubmit={this.handleSubmit}
        useAutocomplete={!!autocompleteResults}
        value={searchTerm}
        inputProps={{
          onFocus: this.handleFocus,
          onBlur: this.handleBlur,
          ...inputProps
        }}
      />
    );
  }
}

export default withSearch(SearchBoxContainer);
