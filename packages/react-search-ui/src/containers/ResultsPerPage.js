import PropTypes from "prop-types";
import React, { Component } from "react";
import { withSearch } from "..";
import { ResultsPerPage } from "@elastic/react-search-ui-views";

export class ResultsPerPageContainer extends Component {
  static propTypes = {
    // Props
    view: PropTypes.func,
    // State
    results: PropTypes.arrayOf(PropTypes.object).isRequired,
    resultsPerPage: PropTypes.number.isRequired,
    searchTerm: PropTypes.string.isRequired,
    // Actions
    setResultsPerPage: PropTypes.func.isRequired
  };

  render() {
    const {
      results,
      resultsPerPage,
      searchTerm,
      setResultsPerPage,
      view
    } = this.props;

    if (!searchTerm && results.length === 0) return null;

    const View = view || ResultsPerPage;

    return (
      <View
        onChange={value => {
          setResultsPerPage(value);
        }}
        options={[20, 40, 60]}
        value={resultsPerPage}
      />
    );
  }
}

export default withSearch(ResultsPerPageContainer);
