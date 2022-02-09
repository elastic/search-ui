import { SearchContextState } from "@elastic/search-ui";
import React from "react";
import { Rename, BaseContainerProps } from "./types";

import { appendClassName } from "./view-helpers";

export type PagingInfoContainerContext = Pick<
  SearchContextState,
  "pagingStart" | "pagingEnd" | "resultSearchTerm" | "totalResults"
>;

export type PagingInfoViewProps = Rename<
  BaseContainerProps & PagingInfoContainerContext,
  {
    pagingStart: "start";
    resultSearchTerm: "searchTerm";
    pagingEnd: "end";
  }
>;

export type PagingInfoContainerProps = BaseContainerProps &
  PagingInfoContainerContext & {
    view?: React.ComponentType<PagingInfoViewProps>;
  };

function PagingInfo({
  className,
  end,
  searchTerm,
  start,
  totalResults,
  ...rest
}: PagingInfoViewProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={appendClassName("sui-paging-info", className)} {...rest}>
      Showing{" "}
      <strong>
        {start} - {end}
      </strong>{" "}
      out of <strong>{totalResults}</strong>
      {searchTerm && (
        <>
          {" "}
          for: <em>{searchTerm}</em>
        </>
      )}
    </div>
  );
}

export default PagingInfo;
