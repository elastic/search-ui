/**
 * Remove all filters
 *
 * Will trigger new search
 *
 * @param except Array[String] field name of any filters that should remain
 */
export default function clearFilters(except = []) {
  if (this.debug)
    // eslint-disable-next-line no-console
    console.log("Search UI: Action", "clearFilters", ...arguments);

  const { filters } = this.state;

  const updatedFilters = filters.filter(filter => {
    const filterField = filter.field;
    return except.includes(filterField);
  });

  this._updateSearchResults({
    current: 1,
    filters: updatedFilters
  });
}
