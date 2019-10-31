/**
 * Set the number of results to show
 *
 * Will trigger new search
 *
 * @param resultsPerPage Integer
 */
export default function setResultsPerPage(resultsPerPage) {
  if (this.debug)
    // eslint-disable-next-line no-console
    console.log("Search UI: Action", "setResultsPerPage", ...arguments);

  this._updateSearchResults({
    current: 1,
    resultsPerPage
  });
}
