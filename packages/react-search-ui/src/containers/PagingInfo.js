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
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    resultSearchTerm: PropTypes.string.isRequired,
    totalResults: PropTypes.number.isRequired
  };

  render() {
    const {
      className,
      start,
      end,
      resultSearchTerm,
      totalResults,
      view
    } = this.props;

    const View = view || PagingInfo;

    return View({
      className,
      searchTerm: resultSearchTerm,
      start,
      end,
      totalResults: totalResults
    });
  }
}

export default withSearch(({ start, end, resultSearchTerm, totalResults }) => ({
  start,
  end,
  resultSearchTerm,
  totalResults
}))(PagingInfoContainer);
