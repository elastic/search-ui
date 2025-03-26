import React from "react";
import {
  PagingInfoContainerProps,
  PagingInfo,
  PagingInfoViewProps
} from "@elastic/react-search-ui-views";
import { useSearch } from "../hooks";

export function PagingInfoContainer({
  className,
  view,
  ...rest
}: PagingInfoContainerProps) {
  const {
    driver: {
      state: { pagingStart, pagingEnd, resultSearchTerm, totalResults }
    }
  } = useSearch();
  const View = view || PagingInfo;
  const viewProps: PagingInfoViewProps = {
    className,
    searchTerm: resultSearchTerm,
    start: pagingStart,
    end: pagingEnd,
    totalResults: totalResults,
    ...rest
  };

  return <View {...viewProps} />;
}

export default PagingInfoContainer;
