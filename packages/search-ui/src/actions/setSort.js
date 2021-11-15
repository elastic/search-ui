/**
 * Set the current sort
 *
 * Will trigger new search
 *
 * @param sort SortList | string
 * @param sortDirection String ["asc"|"desc"]
 */
export default function setSort(sort, sortDirection) {
  // eslint-disable-next-line no-console
  if (this.debug) console.log("Search UI: Action", "setSort", ...arguments);

  const update = { current: 1 };

  if (Array.isArray(sort)) {
    update.sortList = sort;
    update.sortField = null;
    update.sortDirection = null;
  } else {
    update.sortList = null;
    update.sortField = sort;
    update.sortDirection = sortDirection;
  }

  this._updateSearchResults(update);
}
