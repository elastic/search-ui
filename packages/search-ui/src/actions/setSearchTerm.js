/**
 * Set the current search term
 *
 * Will trigger new search
 *
 * @param searchTerm String
 * @param options Object Additional objects
 * @param options.refresh Boolean Refresh search results?
 * @param options.wait Boolean Refresh search results?
 */
export default function setSearchTerm(
  searchTerm,
  { refresh = true, debounce = 0 } = {}
) {
  this._setState({ searchTerm });

  if (refresh) {
    this.debounceManager.runWithDebounce(
      debounce,
      this._updateSearchResults,
      {
        current: 1,
        filters: []
      },
      { ignoreIsLoadingCheck: true }
    );
  }
}
