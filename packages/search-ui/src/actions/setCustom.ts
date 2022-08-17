import { Custom } from "../types";

/**
 * maybe some value should saved in store and url, but don't request backend api.
 */
export default function setCustom(value: Custom) {
  // eslint-disable-next-line no-console
  if (this.debug) console.log("Search UI: Action", "setCustom", ...arguments);
  const {
    current,
    filters,
    resultsPerPage,
    searchTerm,
    sortDirection,
    sortField,
    sortList,
    custom
  } = this.state;
  const newCustom = {
    ...custom,
    ...value
  };
  this._setState({
    custom: newCustom
  });
  this.URLManager.pushStateToURL(
    {
      current,
      filters,
      resultsPerPage,
      searchTerm,
      sortDirection,
      sortField,
      sortList,
      custom: newCustom
    },
    { replaceUrl: true }
  );
}
