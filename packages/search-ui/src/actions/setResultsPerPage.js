/**
 * Set the number of results to show
 *
 * Will trigger new search
 *
 * @param resultsPerPage Integer
 */
export default function setResultsPerPage(resultsPerPage) {
  this._updateSearchResults({
    current: 1,
    resultsPerPage
  });
}
