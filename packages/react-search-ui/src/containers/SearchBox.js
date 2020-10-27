import PropTypes from "prop-types";
import { Component } from "react";
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
      PropTypes.exact({
        sectionTitle: PropTypes.string
      }),
      PropTypes.objectOf(
        PropTypes.exact({
          sectionTitle: PropTypes.string
        })
      )
    ]),
    autocompleteView: PropTypes.func,
    className: PropTypes.string,
    shouldClearFilters: PropTypes.bool,
    debounceLength: PropTypes.number,
    inputProps: PropTypes.object,
    inputView: PropTypes.func,
    onSelectAutocomplete: PropTypes.func,
    onSubmit: PropTypes.func,
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
    ).reduce((acc, [_, value]) => acc + value.length, 0);
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

    return View({
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
    });
  }
}

export default withSearch(
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
