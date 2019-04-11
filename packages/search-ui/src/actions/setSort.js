/**
 * Set the current sort
 *
 * Will trigger new search
 *
 * @param sortField String
 * @param sortDirection String ["asc"|"desc"]
 */
export default function setSort(sortField, sortDirection) {
  // eslint-disable-next-line no-console
  if (this.debug) console.log("Action", "setSort", ...arguments);

  this._updateSearchResults({
    current: 1,
    sortDirection,
    sortField
  });
}
