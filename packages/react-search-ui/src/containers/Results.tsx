import React, { Component } from "react";
import {
  Result,
  Results,
  ResultsContainerProps,
  ResultsContainerContext
} from "@elastic/react-search-ui-views";

import { withSearch } from "..";
import { Result as ResultContainer } from ".";

function getRaw(result, value) {
  if (!result[value] || !result[value].raw) return;
  return result[value].raw;
}

export class ResultsContainer extends Component<ResultsContainerProps> {
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
      thumbnailField,
      view,
      ...rest
    } = this.props;

    const View = view || Results;
    const ResultView = resultView || Result;

    const children = results.map((result) => (
      <ResultContainer
        key={`result-${getRaw(result, "id")}`}
        titleField={titleField}
        urlField={urlField}
        thumbnailField={thumbnailField}
        view={ResultView}
        shouldTrackClickThrough={shouldTrackClickThrough}
        clickThroughTags={clickThroughTags}
        result={result}
      />
    ));

    const viewProps = {
      className,
      children,
      ...rest
    };

    return <View {...viewProps} />;
  }
}

export default withSearch<ResultsContainerProps, ResultsContainerContext>(
  ({ results }) => ({ results })
)(ResultsContainer);
