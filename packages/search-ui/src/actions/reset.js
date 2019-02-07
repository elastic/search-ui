/**
 * Reset search experience to initial state
 *
 */
export default function reset() {
  this._setState(this.startingState);
  if (this.trackUrlState) {
    this.URLManager.pushStateToURL(this.state);
  }
}
