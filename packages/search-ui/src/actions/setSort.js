/**
 * Set the current sort
 *
 * Will trigger new search
 *
 * @param sortField String
 * @param sortDirection String ["asc"|"desc"]
 */
export default function setSort(sortField, sortDirection) {
  this._updateSearchResults({
    current: 1,
    sortDirection,
    sortField
  });
}
