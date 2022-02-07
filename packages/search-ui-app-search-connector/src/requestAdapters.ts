function removeName(v) {
  if (v && v.name) {
    // eslint-disable-next-line
    const { name, ...rest } = v;
    return {
      ...rest
    };
  }

  return v;
}

function rollup(f) {
  const values = f.values.map(removeName).map(v => ({
    [f.field]: v
  }));

  return {
    [f.type || "any"]: values
  };
}

function adaptFilters(filters) {
  if (!filters || filters.length === 0) return {};
  const all = filters.map(rollup);
  return {
    all
  };
}

function getSort(sortDirection, sortField, sortList) {
  if (sortList && sortList.length) {
    return sortList.map(sortItem => ({ [sortItem.field]: sortItem.direction }));
  } else if (sortField && sortDirection) {
    return {
      [sortField]: sortDirection
    };
  } else {
    return undefined;
  }
}

export function adaptRequest(request) {
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
