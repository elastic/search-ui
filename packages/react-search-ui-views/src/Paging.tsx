import React from "react";
import RCPagination from "rc-pagination";
import { PagingViewProps } from "@elastic/react-search-ui";
import enUsLocale from "rc-pagination/lib/locale/en_US";

import { appendClassName } from "./view-helpers";

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
