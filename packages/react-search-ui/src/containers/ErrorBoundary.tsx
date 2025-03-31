import React from "react";
import {
  ErrorBoundary,
  ErrorBoundaryViewProps
} from "@elastic/react-search-ui-views";
import { BaseContainerProps } from "../types";
import { useSearch } from "../hooks";

type ErrorBoundaryContainerProps = BaseContainerProps & {
  view?: React.ComponentType<ErrorBoundaryViewProps>;
};
export const ErrorBoundaryContainer = ({
  children,
  className,
  view,
  ...rest
}: ErrorBoundaryContainerProps) => {
  const { error } = useSearch();
  const View = view || ErrorBoundary;

  const viewProps = {
    className,
    children,
    error,
    ...rest
  };

  return <View {...viewProps} />;
};

export default ErrorBoundaryContainer;
