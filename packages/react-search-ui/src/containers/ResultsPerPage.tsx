import React, { Component } from "react";
import { withSearch } from "..";
import {
  ResultsPerPage,
  ResultsPerPageContainerContext,
  ResultsPerPageContainerProps,
  ResultsPerPageViewProps
} from "@elastic/react-search-ui-views";

export class ResultsPerPageContainer extends Component<ResultsPerPageContainerProps> {
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
      onChange: (value) => {
        setResultsPerPage(value);
      },
      options,
      value: resultsPerPage,
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
