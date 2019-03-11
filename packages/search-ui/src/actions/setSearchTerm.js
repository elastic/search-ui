/**
 * Set the current search term
 *
 * Will trigger new search
 *
 * @param searchTerm String
 * @param options Object Additional objects
 * @param options.autocompleteResults Fetch autocomplete results?
 * @param options.refresh Boolean Refresh search results?
 * @param options.debounce Length to debounce API calls
 */
export default function setSearchTerm(
  searchTerm,
  { autocompleteResults = false, refresh = true, debounce = 0 } = {}
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

  if (autocompleteResults) {
    this.debounceManager.runWithDebounce(
      debounce,
      this._updateAutocompleteResults,
      searchTerm
    );
  }
}
