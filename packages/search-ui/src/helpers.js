import deepEqual from "deep-equal";

export function removeSingleFilterValue(filters, name, value) {
  return filters.reduce((acc, filter) => {
    const { field, values, ...rest } = filter;
    if (field === name) {
      const updatedFilterValues = values.filter(
        filterValue => !matchFilter(filterValue, value)
      );
      if (updatedFilterValues.length > 0) {
        return acc.concat({
          field,
          values: updatedFilterValues,
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
  return deepEqual(filter1, filter2);
}
