import React from "react";
import {
  Result,
  Results,
  ResultsContainerProps
} from "@elastic/react-search-ui-views";

import { Result as ResultContainer } from ".";
import { useSearch } from "../hooks";

function getRaw(result, value) {
  if (!result[value] || !result[value].raw) return;
  return result[value].raw;
}

const ResultsContainer = ({
  clickThroughTags = [],
  resultView,
  shouldTrackClickThrough = true,
  titleField,
  urlField,
  thumbnailField,
  view,
  ...rest
}: ResultsContainerProps) => {
  const { results } = useSearch();

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
    children,
    ...rest
  };

  return <View {...viewProps} />;
};

export default ResultsContainer;
