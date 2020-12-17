/**
 * Filter results - Replaces current filter value
 *
 * Will trigger new search
 *
 * @param name String field name to filter on
 * @param value FilterValue to apply
 * @param type String (Optional) type of filter to apply
 */
export default function setFilter(name, value, type = "all") {
  // eslint-disable-next-line no-console
  if (this.debug) console.log("Search UI: Action", "setFilter", ...arguments);

  let { filters } = this.state;
  filters = filters.filter(
    filter => filter.field !== name || filter.type !== type
  );

  this._updateSearchResults({
    current: 1,
    filters: [
      ...filters,
      {
        field: name,
        values: [value],
        type
      }
    ]
  });
}
