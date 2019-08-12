import PropTypes from "prop-types";
import { Component } from "react";
import { withSearch } from "..";
import { ResultsPerPage } from "@elastic/react-search-ui-views";
import { Result as ResultType } from "../types";

export class ResultsPerPageContainer extends Component {
  static propTypes = {
    // Props
    className: PropTypes.string,
    view: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.number),
    // State
    resultsPerPage: PropTypes.number.isRequired,
    // Actions
    setResultsPerPage: PropTypes.func.isRequired,
    results: PropTypes.arrayOf(ResultType),
    searchTerm: PropTypes.string
  };

  static defaultProps = {
    options: [20, 40, 60]
  };

  render() {
    const {
      className,
      resultsPerPage,
      setResultsPerPage,
      view,
      options,
      // eslint-disable-next-line no-unused-vars
      results,
      // eslint-disable-next-line no-unused-vars
      searchTerm,
      ...rest
    } = this.props;

    const View = view || ResultsPerPage;

    return View({
      className,
      onChange: value => {
        setResultsPerPage(value);
      },
      options,
      value: resultsPerPage,
      ...rest
    });
  }
}

export default withSearch(({ resultsPerPage, setResultsPerPage }) => ({
  resultsPerPage,
  setResultsPerPage
}))(ResultsPerPageContainer);
