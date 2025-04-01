/**
 * Set the current search term
 *
 * Will trigger new search
 *
 * @param searchTerm String
 * @param options Object Additional objects
 * @param autocompleteMinimumCharacters Number Only trigger autocomplete if
 * searchTerm has at least this number of characters
 * @param options.autocompleteResults Boolean Fetch autocomplete
 * results?
 * @param options.refresh Boolean Refresh search results?
 * @param options.debounce Length to debounce API calls
 * @param options.shouldClearFilters Boolean Clear all filters after search?
 */

type SetSearchTermOptions = {
  autocompleteMinimumCharacters?: number;
  autocompleteResults?: boolean;
  debounce?: number;
  refresh?: boolean;
  autocompleteSuggestions?: boolean;
  shouldClearFilters?: boolean;
};

export default function setSearchTerm(
  searchTerm: string,
  {
    autocompleteMinimumCharacters = 0,
    autocompleteResults = false,
    autocompleteSuggestions = false,
    shouldClearFilters = true,
    refresh = true,
    debounce = 0
  }: SetSearchTermOptions = {}
): void {
  if (this.debug)
    // eslint-disable-next-line no-console
    console.log("Search UI: Action", "setSearchTerm", ...arguments);

  this._setState({ searchTerm });

  if (refresh) {
    // If shouldClearFilters is true, clear all filters except persistent filters
    const filters = shouldClearFilters
      ? this.state.filters.filter((filter) => filter.persistent)
      : this.state.filters;

    this.debounceManager.runWithDebounce(
      debounce,
      "_updateSearchResults",
      this._updateSearchResults,
      {
        current: 1,
        filters
      }
    );
  }

  if (
    (autocompleteResults || autocompleteSuggestions) &&
    searchTerm.length >= autocompleteMinimumCharacters
  ) {
    this.debounceManager.runWithDebounce(
      debounce,
      "_updateAutocomplete",
      this._updateAutocomplete,
      searchTerm,
      {
        autocompleteResults,
        autocompleteSuggestions
      }
    );
  }
}
