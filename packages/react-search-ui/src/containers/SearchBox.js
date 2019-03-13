import PropTypes from "prop-types";
import React, { Component } from "react";
import { SearchBox } from "@elastic/react-search-ui-views";

import { Result } from "../types";
import { withSearch } from "..";

export class SearchBoxContainer extends Component {
  static propTypes = {
    // Props
    autocompleteResults: PropTypes.shape({
      titleField: PropTypes.string.isRequired,
      urlField: PropTypes.string.isRequired,
      sectionTitle: PropTypes.string
    }),
    debounceLength: PropTypes.number,
    inputProps: PropTypes.object,
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

  shouldAutocompleteResults = () => {
    const { autocompletedResults } = this.props;
    return !!autocompletedResults;
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

  handleSelectAutocomplete = value => {
    if (value.suggestion) {
      //TODO
      console.log(value);
    } else {
      const {
        autocompleteResults: { urlField }
      } = this.props;
      window.open(value[urlField].raw, "_blank");
    }
  };

  render() {
    const { isFocused } = this.state;
    const {
      autocompleteResults,
      autocompletedResults,
      inputProps,
      searchTerm,
      view
    } = this.props;

    const View = view || SearchBox;

    return (
      <View
        useAutocomplete={this.shouldAutocompleteResults()}
        autocompleteResults={autocompleteResults}
        autocompletedResults={autocompletedResults}
        //TODO
        autocompletedSuggestions={{}}
        isFocused={isFocused}
        onChange={value => this.handleChange(value)}
        onSelectAutocomplete={this.handleSelectAutocomplete}
        onSubmit={this.handleSubmit}
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
