import PropTypes from "prop-types";
import { Component } from "react";
import { withSearch } from "..";
import { Sorting } from "@elastic/react-search-ui-views";

import { SortOption } from "../types";

function findSortOption(sortOptions, sortString) {
  const [value, direction] = sortString.split("|||");
  return sortOptions.find(
    option => option.value === value && option.direction === direction
  );
}

function formatValue(sortField, sortDirection) {
  return `${sortField}|||${sortDirection}`;
}

function formatSelectOption(sortOption) {
  return {
    label: sortOption.name,
    value: formatValue(sortOption.value, sortOption.direction)
  };
}
export class SortingContainer extends Component {
  static propTypes = {
    // Props
    className: PropTypes.string,
    label: PropTypes.string,
    sortOptions: PropTypes.arrayOf(SortOption).isRequired,
    view: PropTypes.func,
    // State
    sortDirection: PropTypes.oneOf(["asc", "desc", ""]).isRequired,
    sortField: PropTypes.string.isRequired,
    // Actions
    setSort: PropTypes.func.isRequired
  };

  render() {
    const {
      className,
      label,
      setSort,
      sortDirection,
      sortField,
      sortOptions,
      view
    } = this.props;

    const View = view || Sorting;

    return View({
      className,
      label,
      onChange: o => {
        const sortOption = findSortOption(sortOptions, o);
        setSort(sortOption.value, sortOption.direction);
      },
      options: sortOptions.map(formatSelectOption),
      value: formatValue(sortField, sortDirection)
    });
  }
}

export default withSearch(({ sortDirection, sortField, setSort }) => ({
  sortDirection,
  sortField,
  setSort
}))(SortingContainer);
