/**
 * Set the number of results to show
 *
 * Will trigger new search
 *
 * @param resultsPerPage Integer
 */
export default function setResultsPerPage(resultsPerPage) {
  // eslint-disable-next-line no-console
  if (this.debug) console.log("Action", "setResultsPerPage", ...arguments);

  this._updateSearchResults({
    current: 1,
    resultsPerPage
  });
}
