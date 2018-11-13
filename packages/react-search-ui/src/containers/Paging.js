import PropTypes from "prop-types";
import React from "react";

import { withSearch } from "..";
import { Paging } from "@elastic/react-search-components";

// App Search is currently limited to 100 pages, so we need to make sure
// that our pager only shows up to 100 pages.
function limitedTo100Pages(totalResults, resultsPerPage) {
  return Math.min(100, Math.ceil(totalResults / resultsPerPage));
}

export function PagingContainer({
  current,
  render,
  resultsPerPage,
  setCurrent,
  totalResults
}) {
  if (totalResults === 0) return null;

  const View = render || Paging;

  // TODO: Don't need to do the limitedTo100Pages thing if we use the
  // total number of pages provides by the API responses rather than
  // the total count to determine
  return (
    <div>
      <View
        current={current}
        resultsPerPage={resultsPerPage}
        totalPages={limitedTo100Pages(totalResults, resultsPerPage)}
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
  totalResults: PropTypes.number.isRequired,
  // Action
  setCurrent: PropTypes.func.isRequired
};

export default withSearch(PagingContainer);
