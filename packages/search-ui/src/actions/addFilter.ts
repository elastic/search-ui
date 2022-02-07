import { doFilterValuesMatch } from "../helpers";
import { FilterType, FilterValue } from "../types";

/**
 * Filter results - Adds to current filter value
 *
 * Will trigger new search
 *
 * @param name String field name to filter on
 * @param value String field value to filter on
 * @param type String (Optional) type of filter to apply
 */
export default function addFilter(
  name: string,
  value: FilterValue,
  type: FilterType = "all"
): void {
  // eslint-disable-next-line no-console
  if (this.debug) console.log("Search UI: Action", "addFilter", ...arguments);

  const { filters } = this.state;

  const existingFilter =
    filters.find((f) => f.field === name && f.type === type) || {};
  const allOtherFilters =
    filters.filter((f) => f.field !== name || f.type !== type) || [];
  const existingFilterValues = existingFilter.values || [];

  const newFilterValues = existingFilterValues.find((existing) =>
    doFilterValuesMatch(existing, value)
  )
    ? existingFilterValues
    : existingFilterValues.concat(value);

  this._updateSearchResults({
    current: 1,
    filters: [
      ...allOtherFilters,
      { field: name, values: newFilterValues, type }
    ]
  });
}
