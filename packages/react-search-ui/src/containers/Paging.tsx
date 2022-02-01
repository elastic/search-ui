import React from "react";

import { withSearch } from "..";
import { Paging } from "@elastic/react-search-ui-views";
import { SearchContextState } from "../withSearch";
import { BaseContainerProps, Rename } from "../types";

type PagingContainerContext = Pick<
  SearchContextState,
  "current" | "resultsPerPage" | "totalPages" | "setCurrent"
>;

export type PagingViewProps = Rename<
  BaseContainerProps & PagingContainerContext,
  {
    setCurrent: "onChange";
  }
>;

type PagingContainerProps = BaseContainerProps &
  PagingContainerContext & {
    view?: React.ComponentType<PagingViewProps>;
  };

export function PagingContainer({
  className,
  current,
  resultsPerPage,
  setCurrent,
  totalPages,
  view,
  ...rest
}: PagingContainerProps) {
  if (totalPages === 0) return null;

  const View: React.ComponentType<PagingViewProps> = view || Paging;

  const viewProps = {
    className,
    current,
    resultsPerPage,
    totalPages,
    onChange: setCurrent,
    ...rest
  };

  return <View {...viewProps} />;
}

export default withSearch<PagingContainerProps, PagingContainerContext>(
  ({ current, resultsPerPage, totalPages, setCurrent }) => ({
    current,
    resultsPerPage,
    totalPages,
    setCurrent
  })
)(PagingContainer);
