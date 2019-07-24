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
    pagingStart: PropTypes.number.isRequired,
    pagingEnd: PropTypes.number.isRequired,
    resultSearchTerm: PropTypes.string.isRequired,
    totalResults: PropTypes.number.isRequired
  };

  render() {
    const {
      className,
      pagingStart,
      pagingEnd,
      resultSearchTerm,
      totalResults,
      view
    } = this.props;

    const View = view || PagingInfo;

    return View({
      className,
      searchTerm: resultSearchTerm,
      start: pagingStart,
      end: pagingEnd,
      totalResults: totalResults
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
