import PropTypes from "prop-types";
import React from "react";
import RCPagination from "rc-pagination";
import enUsLocale from "rc-pagination/lib/locale/en_US";

import { appendClassName } from "./view-helpers";

function Paging({
  className,
  current,
  resultsPerPage,
  onChange,
  totalPages,
  ...rest
}) {
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

Paging.propTypes = {
  current: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  resultsPerPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  className: PropTypes.string
};

export default Paging;
