import React from "react";

import { appendClassName } from "./view-helpers";
import type { SearchContextState } from "@elastic/search-ui";
import { BaseContainerProps } from "./types";

export type ErrorBoundaryContainerContext = Pick<SearchContextState, "error">;

export type ErrorBoundaryViewProps = BaseContainerProps &
  ErrorBoundaryContainerContext;

function ErrorBoundary({
  children,
  className,
  error,
  ...rest
}: ErrorBoundaryViewProps &
  React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  if (error) {
    return (
      <div className={appendClassName("sui-search-error", className)} {...rest}>
        {error}
      </div>
    );
  }

  return children as React.JSX.Element;
}

export default ErrorBoundary;
