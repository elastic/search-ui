/**
 * Set the current page
 *
 * Will trigger new search
 *
 * @param current Integer
 */
export default function setCurrent(current) {
  // eslint-disable-next-line no-console
  if (this.debug) console.log("Action", "setCurrent", ...arguments);

  this._updateSearchResults({
    current
  });
}
