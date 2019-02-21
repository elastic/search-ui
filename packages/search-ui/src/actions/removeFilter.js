import { removeSingleFilterValue } from "../helpers";

/**
 * Remove filter from results
 *
 * Will trigger new search
 *
 * @param name String field name for filter to remove
 * @param value String (Optional) field value for filter to remove
 */
export default function removeFilter(name, value) {
  const { filters } = this.state;

  const updatedFilters = value
    ? removeSingleFilterValue(filters, name, value)
    : filters.filter(filter => filter.field !== name);

  this._updateSearchResults({
    current: 1,
    filters: updatedFilters
  });
}
