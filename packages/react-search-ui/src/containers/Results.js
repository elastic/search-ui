import PropTypes from "prop-types";
import React, { Component } from "react";
import { Result, Results } from "@elastic/react-search-ui-views";

import { withSearch } from "..";
import { Result as ResultContainer } from ".";
import { Result as ResultType } from "../types";

function getRaw(result, value) {
  if (!result[value] || !result[value].raw) return;
  return result[value].raw;
}

export class ResultsContainer extends Component {
  static propTypes = {
    // Props
    className: PropTypes.string,
    clickThroughTags: PropTypes.arrayOf(PropTypes.string),
    resultView: PropTypes.func,
    titleField: PropTypes.string,
    urlField: PropTypes.string,
    view: PropTypes.func,
    shouldTrackClickThrough: PropTypes.bool,
    // State
    results: PropTypes.arrayOf(ResultType).isRequired
  };

  static defaultProps = {
    clickThroughTags: [],
    shouldTrackClickThrough: true
  };

  render() {
    const {
      className,
      clickThroughTags,
      resultView,
      results,
      shouldTrackClickThrough,
      titleField,
      urlField,
      view
    } = this.props;

    const View = view || Results;
    const ResultView = resultView || Result;

    return View({
      className: className,
      children: results.map(result => (
        <ResultContainer
          key={`result-${getRaw(result, "id")}`}
          titleField={titleField}
          urlField={urlField}
          view={ResultView}
          result={result}
          shouldTrackClickThrough={shouldTrackClickThrough}
          clickThroughTags={clickThroughTags}
        />
      ))
    });
  }
}

export default withSearch(({ results }) => ({ results }))(ResultsContainer);
