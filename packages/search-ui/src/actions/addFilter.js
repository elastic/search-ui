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

  const existingFilter = filters.find(f => f.field === name) || {};
  const allOtherFilters = filters.filter(f => f.field !== name) || [];
  const existingFilterValues = existingFilter.values || [];

  const newFilterValues = existingFilterValues.find(existing =>
    matchFilter(existing, value)
  )
    ? existingFilterValues
    : existingFilterValues.concat(value);

  this._updateSearchResults({
    current: 1,
    filters: [
      ...allOtherFilters,
      { field: name, values: newFilterValues, type: "all" }
    ]
  });
}
