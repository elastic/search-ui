import PropTypes from "prop-types";
import React from "react";

import { withSearch } from "..";
import { Paging } from "@elastic/react-search-ui-views";

export function PagingContainer({
  current,
  resultsPerPage,
  setCurrent,
  totalPages,
  view
}) {
  if (totalPages === 0) return null;

  const View = view || Paging;

  return (
    <div>
      <View
        current={current}
        resultsPerPage={resultsPerPage}
        totalPages={totalPages}
        onChange={setCurrent}
      />
    </div>
  );
}

PagingContainer.propTypes = {
  // Props
  view: PropTypes.func,
  // State
  current: PropTypes.number.isRequired,
  resultsPerPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  // Action
  setCurrent: PropTypes.func.isRequired
};

export default withSearch(PagingContainer);
