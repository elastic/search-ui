import PropTypes from "prop-types";
import RCPagination from "rc-pagination";
import React from "react";
import { withSearch } from "..";

// TODO CSS import should move to component library
import "rc-pagination/assets/index.css";

// App Search is currently limited to 100 pages, so we need to make sure
// that our pager only shows up to 100 pages.
function limitedTo100Pages(totalResults, resultsPerPage) {
  return Math.min(resultsPerPage * 100, totalResults);
}

export function PagingContainer({
  current,
  render,
  resultsPerPage,
  setCurrent,
  totalResults
}) {
  if (totalResults === 0) return null;

  const View = render || RCPagination;

  // TODO: RCPagination should move to components library and out
  // of this container. This container is currently converting our
  // params to paras that RCPagination expects. That translation
  // should happen in the components library
  // TODO: Don't need to do the limitedTo100Pages thing if we use the
  // total number of pages provides by the API responses rather than
  // the total count to determine
  return (
    <div>
      <View
        pageSize={resultsPerPage}
        current={current}
        total={limitedTo100Pages(totalResults, resultsPerPage)}
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
