import PropTypes from "prop-types";
import React from "react";
import RCPagination from "rc-pagination";

function Paging({ current, resultsPerPage, onChange, totalPages }) {
  return (
    <RCPagination
      current={current}
      onChange={onChange}
      pageSize={resultsPerPage}
      total={totalPages * resultsPerPage}
      className="sui-paging"
    />
  );
}

Paging.propTypes = {
  current: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  resultsPerPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired
};

export default Paging;
