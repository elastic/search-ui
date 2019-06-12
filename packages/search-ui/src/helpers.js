import deepEqual from "deep-equal";

export function removeSingleFilterValue(filters, name, value, filterType) {
  return filters.reduce((acc, filter) => {
    const { field, values, type, ...rest } = filter;
    if (field === name && (!filterType || type === filterType)) {
      const updatedFilterValues = values.filter(
        filterValue => !matchFilter(filterValue, value)
      );
      if (updatedFilterValues.length > 0) {
        return acc.concat({
          field,
          values: updatedFilterValues,
          type,
          ...rest
        });
      } else {
        return acc;
      }
    }
    return acc.concat(filter);
  }, []);
}

export function matchFilter(filter1, filter2) {
  if (
    filter1 &&
    filter1.name &&
    filter2 &&
    filter2.name &&
    filter1.name === filter2.name
  )
    return true;
  if (deepEqual(filter1, filter2)) return true;
  return false;
}
