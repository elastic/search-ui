import PropTypes from "prop-types";
import { Component } from "react";
import { withSearch } from "..";
import { Sorting } from "@elastic/react-search-ui-views";
import SortList from "../types/SortList";

import { SortOption } from "../types";

function findSortOption(sortOptions, sortData) {
  let value;
  let direction;
  if (Array.isArray(sortData)) {
    value = sortData;
    // direction is contained inside of value
    direction = "";
  } else {
    [value, direction] = sortData.split("|||");
  }
  return sortOptions.find(
    option =>
      JSON.stringify(option.value) === JSON.stringify(value) &&
      option.direction === direction
  );
}

function formatValue(sortField, sortDirection) {
  return `${sortField}|||${sortDirection}`;
}

function formatSelectValues(sortOption) {
  if (Array.isArray(sortOption.value)) {
    return sortOption.value;
  } else {
    return formatValue(sortOption.value, sortOption.direction);
  }
}

function formatSelectOption(sortOption) {
  return {
    label: sortOption.name,
    value: formatSelectValues(sortOption)
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
    sortDirection: PropTypes.oneOf(["asc", "desc", ""]),
    sortField: PropTypes.string,
    sortList: PropTypes.arrayOf(SortList),
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
      sortList,
      sortOptions,
      view,
      ...rest
    } = this.props;

    const View = view || Sorting;

    return View({
      className,
      label,
      onChange: o => {
        const sortOption = findSortOption(sortOptions, o);
        if (Array.isArray(sortOption.value)) {
          setSort("", "", sortOption.value);
        } else {
          setSort(sortOption.value, sortOption.direction);
        }
      },
      options: sortOptions.map(formatSelectOption),
      value: sortList ? sortList : formatValue(sortField, sortDirection),
      ...rest
    });
  }
}

export default withSearch(
  ({ sortDirection, sortField, sortList, setSort }) => ({
    sortDirection,
    sortField,
    sortList,
    setSort
  })
)(SortingContainer);
