import React, { Component } from "react";
import { withSearch } from "..";
import {
  ErrorBoundary,
  ErrorBoundaryContainerContext,
  ErrorBoundaryViewProps
} from "@elastic/react-search-ui-views";
import { BaseContainerProps } from "../types";

type ErrorBoundaryContainerProps = BaseContainerProps &
  ErrorBoundaryContainerContext & {
    view?: React.ComponentType<ErrorBoundaryViewProps>;
  };

export class ErrorBoundaryContainer extends Component<ErrorBoundaryContainerProps> {
  render() {
    const { children, className, error, view, ...rest } = this.props;

    const View = view || ErrorBoundary;

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
