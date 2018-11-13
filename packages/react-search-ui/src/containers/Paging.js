import PropTypes from "prop-types";
import React from "react";

import { withSearch } from "..";
import { Paging } from "@elastic/react-search-components";

export function PagingContainer({
  current,
  render,
  resultsPerPage,
  setCurrent,
  totalPages
}) {
  if (totalPages === 0) return null;

  const View = render || Paging;

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
  render: PropTypes.func,
  // State
  current: PropTypes.number.isRequired,
  resultsPerPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  // Action
  setCurrent: PropTypes.func.isRequired
};

export default withSearch(PagingContainer);
