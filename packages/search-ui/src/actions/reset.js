/**
 * Reset search experience to initial state
 *
 */
export default function reset() {
  // eslint-disable-next-line no-console
  if (this.debug) console.log("Search UI: Action", "reset", ...arguments);

  this._setState(this.startingState);
  if (this.trackUrlState) {
    this.URLManager.pushStateToURL(this.state);
  }
}
