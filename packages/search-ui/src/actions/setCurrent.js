/**
 * Set the current page
 *
 * Will trigger new search
 *
 * @param current Integer
 */
export default function setCurrent(current) {
  this._updateSearchResults({
    current
  });
}
