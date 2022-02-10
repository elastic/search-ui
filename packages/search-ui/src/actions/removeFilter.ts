import { removeSingleFilterValue } from "../helpers";
import { FilterType, FilterValue } from "../types";

/**
 * Remove filter from results
 *
 * Will trigger new search
 *
 * @param name String field name for filter to remove
 * @param value String (Optional) field value for filter to remove
 * @param type String (Optional) type of filter to remove
 */
export default function removeFilter(
  name: string,
  value?: FilterValue,
  type?: FilterType
) {
  if (this.debug)
    // eslint-disable-next-line no-console
    console.log("Search UI: Action", "removeFilter", ...arguments);

  const { filters } = this.state;

  let updatedFilters = filters;

  if (!value && type) {
    updatedFilters = filters.filter(
      (filter) => !(filter.field === name && filter.type === type)
    );
  } else if (value) {
    updatedFilters = removeSingleFilterValue(filters, name, value, type);
  } else {
    updatedFilters = filters.filter((filter) => filter.field !== name);
  }

  this._updateSearchResults({
    current: 1,
    filters: updatedFilters
  });
}
