import React, { Component } from "react";
import { withSearch } from "..";
import {
  ResultsPerPage,
  ResultsPerPageContainerContext,
  ResultsPerPageContainerProps,
  ResultsPerPageViewProps
} from "@elastic/react-search-ui-views";
import { useSearch } from "../hooks";

export function ResultsPerPageContainer({
  className,
  options,
  view,
  ...rest
}: ResultsPerPageContainerProps) {
  const {
    driver: {
      state: { resultsPerPage },
      actions: { setResultsPerPage }
    }
  } = useSearch();
  const View = view || ResultsPerPage;
  const viewProps: ResultsPerPageViewProps = {
    className,
    onChange: (value) => {
      setResultsPerPage(value);
    },
    options,
    value: resultsPerPage,
    ...rest
  };

  return <View {...viewProps} />;
}

export default ResultsPerPageContainer;
