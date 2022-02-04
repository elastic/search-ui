import { ResultsViewProps } from "@elastic/react-search-ui";
import React from "react";

import { appendClassName } from "./view-helpers";

function Results({
  children,
  className,
  ...rest
}: ResultsViewProps & React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={appendClassName("sui-results-container", className)}
      {...rest}
    >
      {children}
    </ul>
  );
}

export default Results;
