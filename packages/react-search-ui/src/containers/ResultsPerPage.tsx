import React, { Component } from "react";
import { withSearch } from "..";
import { ResultsPerPage } from "@elastic/react-search-ui-views";
import { SearchContextState } from "../withSearch";
import { BaseContainerProps, Rename } from "../types";

type ResultsPerPageContainerContext = Pick<
  SearchContextState,
  "resultsPerPage" | "setResultsPerPage"
>;

type ResultsPerPageContainerProps = BaseContainerProps &
  ResultsPerPageContainerContext & {
    view?: React.ComponentType<ResultsPerPageViewProps>;
    options?: number[];
  };

export type ResultsPerPageViewProps = BaseContainerProps &
  Pick<ResultsPerPageContainerProps, "options"> &
  Rename<ResultsPerPageContainerContext, { setResultsPerPage: "onChange" }>;

export class ResultsPerPageContainer extends Component<
  ResultsPerPageContainerProps
> {
  static defaultProps = {
    options: [20, 40, 60]
  };

  render() {
    const {
      className,
      resultsPerPage,
      setResultsPerPage,
      options,
      view,
      ...rest
    } = this.props;

    const View = view || ResultsPerPage;
    const viewProps: ResultsPerPageViewProps = {
      className,
      options,
      resultsPerPage,
      onChange: setResultsPerPage,
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
