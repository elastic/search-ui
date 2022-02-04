import React, { Component } from "react";
import { withSearch } from "..";
import { ErrorBoundary } from "@elastic/react-search-ui-views";
import { SearchContextState } from "../withSearch";
import { BaseContainerProps } from "../types";

type ErrorBoundaryContainerContext = Pick<SearchContextState, "error">;

export type ErrorBoundaryViewProps = BaseContainerProps &
  ErrorBoundaryContainerContext;

type ErrorBoundaryContainerProps = BaseContainerProps &
  ErrorBoundaryContainerContext & {
    view?: React.ComponentType<ErrorBoundaryViewProps>;
  };

export class ErrorBoundaryContainer extends Component<ErrorBoundaryContainerProps> {
  render() {
    const { children, className, error, view, ...rest } = this.props;

    const View: React.ComponentType<ErrorBoundaryViewProps> =
      view || ErrorBoundary;

    const viewProps = {
      className,
      children,
      error,
      ...rest
    };

    return <View {...viewProps} />;
  }
}

export default withSearch<
  ErrorBoundaryContainerProps,
  ErrorBoundaryContainerContext
>(({ error }) => ({ error }))(ErrorBoundaryContainer);
