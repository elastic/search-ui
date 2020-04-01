import PropTypes from "prop-types";
import React from "react";

function PagingInfo({
  viewHelpers,
  className,
  end,
  searchTerm,
  start,
  totalResults,
  ...rest
}) {
  return (
    <div
      className={viewHelpers.appendClassName("sui-paging-info", className)}
      {...rest}
    >
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

PagingInfo.propTypes = {
  viewHelpers: PropTypes.object.isRequired,
  end: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  start: PropTypes.number.isRequired,
  totalResults: PropTypes.number.isRequired,
  className: PropTypes.string
};

export default PagingInfo;
