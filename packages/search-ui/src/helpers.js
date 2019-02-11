export function removeSingleFilterValue(filters, name, value) {
  return filters.reduce((acc, filter) => {
    if (filter[name]) {
      const currentFilterValues = filter[name];
      const updatedFilterValues = currentFilterValues.filter(
        filterValue => !matchFilter(filterValue, value)
      );
      if (updatedFilterValues.length > 0) {
        return acc.concat({
          [name]: updatedFilterValues
        });
      } else {
        return acc;
      }
    }
    return acc.concat(filter);
  }, []);
}

export function matchFilter(filter1, filter2) {
  return (
    filter1 === filter2 ||
    (filter1.from &&
      filter1.from === filter2.from &&
      filter1.to &&
      filter1.to === filter2.to)
  );
}
