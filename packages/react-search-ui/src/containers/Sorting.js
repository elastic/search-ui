import PropTypes from "prop-types";
import React, { Component } from "react";
import { withSearch } from "..";
import { Sorting } from "@elastic/react-search-components";

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
    render: PropTypes.func,
    sortOptions: PropTypes.arrayOf(SortOption).isRequired,
    // State
    results: PropTypes.arrayOf(PropTypes.object).isRequired,
    searchTerm: PropTypes.string.isRequired,
    sortDirection: PropTypes.oneOf(["asc", "desc", ""]).isRequired,
    sortField: PropTypes.string.isRequired,
    // Actions
    setSort: PropTypes.func.isRequired
  };

  render() {
    const {
      render,
      results,
      searchTerm,
      setSort,
      sortDirection,
      sortField,
      sortOptions
    } = this.props;

    if (!searchTerm && results.length === 0) return null;

    const View = render || Sorting;

    return (
      <View
        onChange={o => {
          const sortOption = findSortOption(sortOptions, o);
          setSort(sortOption.value, sortOption.direction);
        }}
        options={sortOptions.map(formatSelectOption)}
        value={formatValue(sortField, sortDirection)}
      />
    );
  }
}

export default withSearch(SortingContainer);
