import React from "react";

import { appendClassName } from "./view-helpers";
import { ErrorBoundaryViewProps } from "@elastic/react-search-ui";

function ErrorBoundary({
  children,
  className,
  error,
  ...rest
}: ErrorBoundaryViewProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  if (error) {
    return (
      <div className={appendClassName("sui-search-error", className)} {...rest}>
        {error}
      </div>
    );
  }

  return <>{children}</>;
}

export default ErrorBoundary;
