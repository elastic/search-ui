import { PagingInfoViewProps } from "@elastic/react-search-ui";
import React from "react";

import { appendClassName } from "./view-helpers";

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
