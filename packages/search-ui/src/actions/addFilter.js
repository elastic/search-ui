import { matchFilter } from "../helpers";

/**
 * Filter results - Adds to current filter value
 *
 * Will trigger new search
 *
 * @param name String field name to filter on
 * @param value String field value to filter on
 * @param type String (Optional) type of filter to apply
 * @param innerType String (Optional) type of inner filter to apply
 */
export default function addFilter(
  name,
  value,
  type = "all",
  innerType = "any"
) {
  // eslint-disable-next-line no-console
  if (this.debug) console.log("Action", "addFilter", ...arguments);

  const { filters } = this.state;

  const existingFilter =
    filters.find(
      f => f.field === name && f.type === type && f.innerType === f.innerType
    ) || {};
  const allOtherFilters =
    filters.filter(
      f => f.field !== name || f.type !== type || f.innerType !== innerType
    ) || [];
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
      { field: name, values: newFilterValues, type, innerType }
    ]
  });
}
