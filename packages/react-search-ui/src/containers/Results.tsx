import React, { Component } from "react";
import { Result, Results } from "@elastic/react-search-ui-views";

import { withSearch } from "..";
import { Result as ResultContainer } from ".";
import { BaseContainerProps } from "../types";
import { SearchContextState } from "../withSearch";
import { ResultViewProps } from "./Result";
import { SearchResult } from "@elastic/search-ui";

function getRaw(result, value) {
  if (!result[value] || !result[value].raw) return;
  return result[value].raw;
}

type ResultsContainerContext = Pick<SearchContextState, "results">;

type ResultsContainerProps = BaseContainerProps &
  ResultsContainerContext & {
    view?: React.ComponentType<ResultsViewProps>;
    resultView?: React.ComponentType<ResultViewProps>;
    clickThroughTags?: string[];
    titleField?: string;
    urlField?: string;
    thumbnailField?: string;
    results: SearchResult[];
    shouldTrackClickThrough?: boolean;
  };

export type ResultsViewProps = BaseContainerProps &
  Pick<
    ResultsContainerProps,
    "results" | "titleField" | "urlField" | "thumbnailField"
  > & {
    key?: string;
    onClickLink: () => void;
  };

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
      results,
      ...rest
    };

    return <View {...viewProps} />;
  }
}

export default withSearch<ResultsContainerProps, ResultsContainerContext>(
  ({ results }) => ({ results })
)(ResultsContainer);
