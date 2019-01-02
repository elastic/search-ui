import PropTypes from "prop-types";
import React from "react";

function PagingInfo({ end, searchTerm, start, totalResults }) {
  return (
    <div className="sui-paging-info">
      Showing{" "}
      <strong>
        {start} - {end}
      </strong>{" "}
      out of <strong>{totalResults}</strong> for: <em>{searchTerm}</em>
    </div>
  );
}

PagingInfo.propTypes = {
  end: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  start: PropTypes.number.isRequired,
  totalResults: PropTypes.number.isRequired
};

export default PagingInfo;
