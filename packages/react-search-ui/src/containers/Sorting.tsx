import React, { Component } from "react";
import { withSearch } from "..";
import {
  Sorting,
  SortingContainerContext,
  SortingContainerProps,
  SortingViewProps
} from "@elastic/react-search-ui-views";

function findSortOption(sortOptions, sortData) {
  if (sortData.indexOf("|||") === -1) {
    return sortOptions.find(
      (option) => JSON.stringify(option.value) === sortData
    );
  }

  const [value, direction] = sortData.split("|||");

  return sortOptions.find(
    (option) => option.value === value && option.direction === direction
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
    return formatValue(sortOption.value, sortOption.direction, null);
  }
}

function formatSelectOption(sortOption) {
  return {
    label: sortOption.name,
    value: formatSelectValues(sortOption)
  };
}

export class SortingContainer extends Component<SortingContainerProps> {
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

    const viewProps: SortingViewProps = {
      className,
      label,
      onChange: (o) => {
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

export default withSearch<SortingContainerProps, SortingContainerContext>(
  ({ sortDirection, sortField, sortList, setSort }) => ({
    sortDirection,
    sortField,
    sortList,
    setSort
  })
)(SortingContainer);
