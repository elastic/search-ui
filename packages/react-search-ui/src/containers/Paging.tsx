import React from "react";

import {
  Paging,
  PagingContainerProps,
  PagingViewProps
} from "@elastic/react-search-ui-views";
import { useSearch } from "../hooks";

export function PagingContainer({
  className,
  view,
  ...rest
}: PagingContainerProps) {
  const { current, resultsPerPage, totalPages, setCurrent } = useSearch();

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
export default PagingContainer;
