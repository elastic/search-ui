/**
 * Set the current sort
 *
 * Will trigger new search
 *
 * @param sortField String
 * @param sortDirection String ["asc"|"desc"]
 * @param sortList Array
 */
export default function setSort(sortField, sortDirection, sortList) {
  // eslint-disable-next-line no-console
  if (this.debug) console.log("Search UI: Action", "setSort", ...arguments);
  this._updateSearchResults({
    current: 1,
    sortDirection,
    sortField,
    sortList
  });
}
