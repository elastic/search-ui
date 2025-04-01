import React from "react";
import {
  ResultsPerPage,
  ResultsPerPageContainerProps,
  ResultsPerPageViewProps
} from "@elastic/react-search-ui-views";
import { useSearch } from "../hooks";

const ResultsPerPageContainer = ({
  className,
  options = [20, 40, 60],
  view,
  ...rest
}: ResultsPerPageContainerProps) => {
  const { resultsPerPage, setResultsPerPage } = useSearch();
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
};

export default ResultsPerPageContainer;
