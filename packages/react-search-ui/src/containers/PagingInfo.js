import PropTypes from "prop-types";
import { Component } from "react";
import { withSearch } from "..";
import { PagingInfo } from "@elastic/react-search-ui-views";

export class PagingInfoContainer extends Component {
  static propTypes = {
    // Props
    className: PropTypes.string,
    view: PropTypes.func,
    // State
    current: PropTypes.number.isRequired,
    results: PropTypes.arrayOf(PropTypes.object).isRequired,
    resultsPerPage: PropTypes.number.isRequired,
    resultSearchTerm: PropTypes.string.isRequired,
    totalResults: PropTypes.number.isRequired,
    a11yNotify: PropTypes.func.isRequired,
    a11yNotificationMessages: PropTypes.objectOf(PropTypes.func)
  };

  render() {
    const {
      className,
      a11yNotificationMessages,
      a11yNotify,
      current,
      resultsPerPage,
      resultSearchTerm,
      totalResults,
      view
    } = this.props;
    const start = totalResults === 0 ? 0 : (current - 1) * resultsPerPage + 1;
    const end =
      totalResults <= start + resultsPerPage
        ? totalResults
        : start + resultsPerPage - 1;

    const resultsProps = {
      end: end,
      searchTerm: resultSearchTerm,
      start: start,
      totalResults: totalResults
    };

    a11yNotify(a11yNotificationMessages.searchResults(resultsProps));

    const View = view || PagingInfo;
    return View({ ...resultsProps, className });
  }
}

export default withSearch(
  ({
    current,
    results,
    resultsPerPage,
    resultSearchTerm,
    totalResults,
    a11yNotificationMessages,
    a11yNotify
  }) => ({
    current,
    results,
    resultsPerPage,
    resultSearchTerm,
    totalResults,
    a11yNotificationMessages,
    a11yNotify
  })
)(PagingInfoContainer);
