import PropTypes from "prop-types";
import React from "react";

import { appendClassName, ScreenReaderStatus } from "./view-helpers";

function PagingInfo({ className, end, searchTerm, start, totalResults }) {
  end = Math.min(end, totalResults);
  return (
    <>
      <div className={appendClassName("sui-paging-info", className)}>
        Showing{" "}
        <strong>
          {start} - {end}
        </strong>{" "}
        out of <strong>{totalResults}</strong> for: <em>{searchTerm}</em>
      </div>
      <ScreenReaderStatus
        render={announceToScreenReader => {
          let message = `Showing ${start} to ${end} results out of ${totalResults}`;
          if (searchTerm) message += `, searching for "${searchTerm}".`;
          return announceToScreenReader(message);
        }}
      />
    </>
  );
}

PagingInfo.propTypes = {
  end: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  start: PropTypes.number.isRequired,
  totalResults: PropTypes.number.isRequired,
  className: PropTypes.string
};

export default PagingInfo;
