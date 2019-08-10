import PropTypes from "prop-types";
import { Component } from "react";
import { withSearch } from "..";
import { PagingInfo } from "@elastic/react-search-ui-views";
import { Result as ResultType } from "../types";

export class PagingInfoContainer extends Component {
  static propTypes = {
    // Props
    className: PropTypes.string,
    view: PropTypes.func,
    // State
    pagingStart: PropTypes.number.isRequired,
    pagingEnd: PropTypes.number.isRequired,
    resultSearchTerm: PropTypes.string.isRequired,
    totalResults: PropTypes.number.isRequired,
    results: PropTypes.arrayOf(ResultType)
  };

  render() {
    const {
      className,
      pagingStart,
      pagingEnd,
      resultSearchTerm,
      totalResults,
      // eslint-disable-next-line no-unused-vars
      results,
      view,
      ...rest
    } = this.props;

    const View = view || PagingInfo;

    return View({
      className,
      searchTerm: resultSearchTerm,
      start: pagingStart,
      end: pagingEnd,
      totalResults: totalResults,
      ...rest
    });
  }
}

export default withSearch(
  ({ pagingStart, pagingEnd, resultSearchTerm, totalResults }) => ({
    pagingStart,
    pagingEnd,
    resultSearchTerm,
    totalResults
  })
)(PagingInfoContainer);
