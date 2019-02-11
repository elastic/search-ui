/**
 * Filter results - Replaces current filter value
 *
 * Will trigger new search
 *
 * @param name String field name to filter on
 * @param value String field value to filter on
 */
export default function setFilter(name, value) {
  let { filters } = this.state;
  filters = filters.filter(filter => Object.keys(filter)[0] !== name);

  this._updateSearchResults({
    current: 1,
    filters: [...filters, { [name]: [value] }]
  });
}
