import { SearchContextState, SearchResult } from "@elastic/search-ui";
import React from "react";
import { BaseContainerProps } from "./types";
import { ResultViewProps } from "./Result";

import { appendClassName } from "./view-helpers";

export type ResultsContainerContext = Pick<SearchContextState, "results">;

export type ResultsContainerProps = BaseContainerProps &
  ResultsContainerContext & {
    view?: React.ComponentType<ResultsViewProps>;
    resultView?: React.ComponentType<ResultViewProps>;
    clickThroughTags?: string[];
    titleField?: string;
    urlField?: string;
    thumbnailField?: string;
    results: SearchResult[];
    shouldTrackClickThrough?: boolean;
  };

export type ResultsViewProps = BaseContainerProps;

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
