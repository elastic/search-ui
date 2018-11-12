import PropTypes from "prop-types";
import React, { Component } from "react";
import { withSearch } from "..";
import { PagingInfo } from "@elastic/react-search-components";

export class PagingInfoContainer extends Component {
  static propTypes = {
    current: PropTypes.number.isRequired,
    render: PropTypes.func,
    results: PropTypes.arrayOf(PropTypes.object).isRequired,
    resultsPerPage: PropTypes.number.isRequired,
    resultSearchTerm: PropTypes.string.isRequired,
    totalResults: PropTypes.number.isRequired
  };

  render() {
    const {
      current,
      render,
      results,
      resultsPerPage,
      resultSearchTerm,
      totalResults
    } = this.props;
    const start = totalResults === 0 ? 0 : (current - 1) * resultsPerPage + 1;
    const end =
      totalResults <= resultsPerPage
        ? totalResults
        : start + resultsPerPage - 1;

    if (!resultSearchTerm && results.length === 0) return null;

    const View = render || PagingInfo;

    return (
      <View
        end={end}
        searchTerm={resultSearchTerm}
        start={start}
        totalResults={totalResults}
      />
    );
  }
}

export default withSearch(PagingInfoContainer);
