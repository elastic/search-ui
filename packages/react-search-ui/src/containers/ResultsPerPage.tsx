import React, { Component } from "react";
import { withSearch } from "..";
import { ResultsPerPage } from "@elastic/react-search-ui-views";
import { SearchContextState } from "../withSearch";
import { BaseContainerProps, Rename } from "../types";

type ResultsPerPageContainerContext = Rename<
  Pick<SearchContextState, "resultsPerPage" | "setResultsPerPage">,
  {
    resultsPerPage: "value";
  }
>;

type ResultsPerPageContainerProps = BaseContainerProps &
  ResultsPerPageContainerContext & {
    view?: React.ComponentType<ResultsPerPageViewProps>;
    options?: number[];
  };

export type ResultsPerPageViewProps = BaseContainerProps &
  Pick<ResultsPerPageContainerProps, "options"> &
  Rename<ResultsPerPageContainerContext, { setResultsPerPage: "onChange" }>;

export class ResultsPerPageContainer extends Component<ResultsPerPageContainerProps> {
  static defaultProps = {
    options: [20, 40, 60]
  };

  render() {
    const { className, value, setResultsPerPage, options, view, ...rest } =
      this.props;

    const View = view || ResultsPerPage;
    const viewProps: ResultsPerPageViewProps = {
      className,
      onChange: (value) => {
        setResultsPerPage(value);
      },
      options,
      value,
      ...rest
    };

    return <View {...viewProps} />;
  }
}

export default withSearch<
  ResultsPerPageContainerProps,
  ResultsPerPageContainerContext
>(({ resultsPerPage, setResultsPerPage }) => ({
  resultsPerPage,
  setResultsPerPage
}))(ResultsPerPageContainer);
