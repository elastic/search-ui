import PropTypes from "prop-types";

import { withSearch } from "..";
import { Paging } from "@elastic/react-search-ui-views";

export function PagingContainer({
  className,
  current,
  resultsPerPage,
  setCurrent,
  totalPages,
  view
}) {
  if (totalPages === 0) return null;

  const View = view || Paging;

  return View({
    className,
    current,
    resultsPerPage,
    totalPages,
    onChange: setCurrent
  });
}

PagingContainer.propTypes = {
  // Props
  className: PropTypes.string,
  view: PropTypes.func,
  // State
  current: PropTypes.number.isRequired,
  resultsPerPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  // Action
  setCurrent: PropTypes.func.isRequired
};

export default withSearch(
  ({ current, resultsPerPage, totalPages, setCurrent }) => ({
    current,
    resultsPerPage,
    totalPages,
    setCurrent
  })
)(PagingContainer);
