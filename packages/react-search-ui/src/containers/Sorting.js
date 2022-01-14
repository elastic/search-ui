import PropTypes from "prop-types";
import React, { Component } from "react";
import { withSearch } from "..";
import { Sorting } from "@elastic/react-search-ui-views";
import SortList from "../types/SortList";

import { SortOption } from "../types";

function findSortOption(sortOptions, sortData) {
  if (sortData.indexOf("|||") === -1) {
    return sortOptions.find(
      option => JSON.stringify(option.value) === sortData
    );
  }

  const [value, direction] = sortData.split("|||");

  return sortOptions.find(
    option => option.value === value && option.direction === direction
  );
}

function formatValue(sortField, sortDirection, sortList) {
  if (sortList && sortList.length > 0) {
    return JSON.stringify(sortList);
  }
  return `${sortField}|||${sortDirection}`;
}

function formatSelectValues(sortOption) {
  if (Array.isArray(sortOption.value)) {
    // save value as string for comparison
    return JSON.stringify(sortOption.value);
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
    sortList: SortList,
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

    const viewProps = {
      className,
      label,
      onChange: o => {
        const sortOption = findSortOption(sortOptions, o);
        setSort(sortOption.value, sortOption.direction);
      },
      options: sortOptions.map(formatSelectOption),
      value: formatValue(sortField, sortDirection, sortList),
      ...rest
    };

    return <View {...viewProps} />;
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
