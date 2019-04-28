import PropTypes from "prop-types";
import { Component } from "react";
import { withSearch } from "..";
import { ResultsPerPage } from "@elastic/react-search-ui-views";

export class ResultsPerPageContainer extends Component {
  static propTypes = {
    // Props
    className: PropTypes.string,
    view: PropTypes.func,
    resultsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
    // State
    results: PropTypes.arrayOf(PropTypes.object).isRequired,
    resultsPerPage: PropTypes.number.isRequired,
    searchTerm: PropTypes.string.isRequired,
    // Actions
    setResultsPerPage: PropTypes.func.isRequired
  };

  static defaultProps = {
    resultsPerPageOptions: [20, 40, 60]
  };

  render() {
    const {
      className,
      resultsPerPage,
      setResultsPerPage,
      view,
      resultsPerPageOptions
    } = this.props;

    const View = view || ResultsPerPage;

    return View({
      className,
      onChange: value => {
        setResultsPerPage(value);
      },
      options: resultsPerPageOptions,
      value: resultsPerPage
    });
  }
}

export default withSearch(ResultsPerPageContainer);
