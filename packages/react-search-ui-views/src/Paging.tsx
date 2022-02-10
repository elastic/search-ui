import React from "react";
import RCPagination from "rc-pagination";
import enUsLocale from "rc-pagination/lib/locale/en_US";

import { appendClassName } from "./view-helpers";
import { SearchContextState } from "@elastic/search-ui";
import { Rename, BaseContainerProps } from "./types";

export type PagingContainerContext = Pick<
  SearchContextState,
  "current" | "resultsPerPage" | "totalPages" | "setCurrent"
>;

export type PagingViewProps = Rename<
  BaseContainerProps & PagingContainerContext,
  {
    setCurrent: "onChange";
  }
>;

export type PagingContainerProps = BaseContainerProps &
  PagingContainerContext & {
    view?: React.ComponentType<PagingViewProps>;
  };

function Paging({
  className,
  current,
  resultsPerPage,
  onChange,
  totalPages,
  ...rest
}: PagingViewProps) {
  return (
    <RCPagination
      current={current}
      onChange={onChange}
      pageSize={resultsPerPage}
      total={totalPages * resultsPerPage}
      className={appendClassName("sui-paging", className)}
      locale={enUsLocale}
      {...rest}
    />
  );
}

export default Paging;
