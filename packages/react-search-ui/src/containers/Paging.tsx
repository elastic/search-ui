import React from "react";

import { withSearch } from "..";
import {
  Paging,
  PagingContainerContext,
  PagingContainerProps,
  PagingViewProps
} from "@elastic/react-search-ui-views";

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
