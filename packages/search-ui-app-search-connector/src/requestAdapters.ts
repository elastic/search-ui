import type {
  RequestState,
  Filter,
  SortDirection,
  SortOption,
  FilterValue
} from "@elastic/search-ui";
import { helpers } from "@elastic/search-ui";

function removeName(v: FilterValue) {
  if (helpers.isFilterValueRange(v)) {
    // eslint-disable-next-line
    const { name, ...rest } = v;
    return {
      ...rest
    };
  }

  return v;
}

function rollup(f: Filter) {
  const hasRangeInValues = f.values.some(helpers.isFilterValueRange);
  const isAllType = f.type === "all";
  let values;

  if (isAllType || hasRangeInValues || f.values.length === 1) {
    values = f.values.map(removeName).map((v) => ({
      [f.field]: v
    }));
  } else {
    // Used for "any" and "none" types that have multiple values and are not ranges
    values = [
      {
        [f.field]: f.values.map(removeName).map((v) => v)
      }
    ];
  }
  return {
    [f.type || "any"]: values
  };
}

function adaptFilters(filters: Filter[]) {
  if (!filters || filters.length === 0) return {};
  const all = filters.map(rollup);
  return {
    all
  };
}

function getSort(
  sortDirection: SortDirection,
  sortField: string,
  sortList: SortOption[]
) {
  if (sortList && sortList.length) {
    return sortList.map((sortItem) => ({
      [sortItem.field]: sortItem.direction
    }));
  } else if (sortField && sortDirection) {
    return {
      [sortField]: sortDirection
    };
  } else {
    return undefined;
  }
}

export function adaptRequest(request: RequestState) {
  const {
    current,
    resultsPerPage,
    searchTerm,
    sortDirection,
    sortField,
    sortList
  } = request;

  const sort = getSort(sortDirection, sortField, sortList);
  return {
    query: searchTerm,
    ...(sort !== undefined && { sort }),
    page: {
      ...(resultsPerPage !== undefined && { size: resultsPerPage }),
      ...(current !== undefined && { current })
    },
    filters: adaptFilters(request.filters)
  };
}
