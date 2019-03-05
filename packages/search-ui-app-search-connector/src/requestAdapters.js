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

export function adaptRequest(request) {
  const {
    current,
    resultsPerPage,
    searchTerm,
    sortDirection,
    sortField
  } = request;

  const sort =
    sortField && sortDirection
      ? {
          [sortField]: sortDirection
        }
      : undefined;

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
