import deepEqual from "deep-equal";

export function removeSingleFilterValue(filters, name, value, filterType) {
  return filters.reduce((acc, filter) => {
    const { field, values, type, ...rest } = filter;
    if (field === name && (!filterType || type === filterType)) {
      const updatedFilterValues = values.filter(
        filterValue => !doFilterValuesMatch(filterValue, value)
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

/**
 * Useful for determining when filter values match. This could be used
 * when matching applied filters back to facet options, or for determining
 * whether or not a filter already exists in a list of applied filters.
 *
 * @param {*} filter1
 * @param {*} filter2
 */
export function doFilterValuesMatch(filterValue1, filterValue2) {
  if (
    filterValue1 &&
    filterValue1.name &&
    filterValue2 &&
    filterValue2.name &&
    filterValue1.name === filterValue2.name
  )
    // If two filters have matching names, then they are the same filter, there
    // is no need to do a more expensive deep equal comparison.
    //
    // This is also important because certain filters and facets will have
    // differing values than their corresponding facet options. For instance,
    // consider a time-based facet like "Last 10 Minutes". The value of the
    // filter will be different depending on when it was selected, but the name
    // will always match.
    return true;
  // We use 'strict = true' to do a '===' of leaves, rather than '=='
  return deepEqual(filterValue1, filterValue2, { strict: true });
}
