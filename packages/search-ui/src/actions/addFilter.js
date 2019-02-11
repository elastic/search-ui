import { matchFilter } from "../helpers";

/**
 * Filter results - Adds to current filter value
 *
 * Will trigger new search
 *
 * @param name String field name to filter on
 * @param value String field value to filter on
 */
export default function addFilter(name, value) {
  const { filters } = this.state;

  const existingFilterValues = (filters.find(f => f[name]) || {})[name] || [];

  const newFilterValues = existingFilterValues.find(existing =>
    matchFilter(existing, value)
  )
    ? existingFilterValues
    : existingFilterValues.concat(value);

  const filtersWithoutTargetFilter = filters.filter(f => !f[name]);

  this._updateSearchResults({
    current: 1,
    filters: [...filtersWithoutTargetFilter, { [name]: newFilterValues }]
  });
}
