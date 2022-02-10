export { default as addFilter } from "./addFilter";
export { default as trackAutocompleteClickThrough } from "./trackAutocompleteClickThrough";
export { default as clearFilters } from "./clearFilters";
export { default as removeFilter } from "./removeFilter";
export { default as reset } from "./reset";
export { default as setCurrent } from "./setCurrent";
export { default as setFilter } from "./setFilter";
export { default as setResultsPerPage } from "./setResultsPerPage";
export { default as setSearchTerm } from "./setSearchTerm";
export { default as setSort } from "./setSort";
export { default as trackClickThrough } from "./trackClickThrough";
export { default as a11yNotify } from "./a11yNotify";

export interface SearchDriverActions {
  addFilter: typeof import("./addFilter").default;
  trackAutocompleteClickThrough: typeof import("./trackAutocompleteClickThrough").default;
  clearFilters: typeof import("./clearFilters").default;
  removeFilter: typeof import("./removeFilter").default;
  reset: typeof import("./reset").default;
  setCurrent: typeof import("./setCurrent").default;
  setFilter: typeof import("./setFilter").default;
  setResultsPerPage: typeof import("./setResultsPerPage").default;
  setSearchTerm: typeof import("./setSearchTerm").default;
  setSort: typeof import("./setSort").default;
  trackClickThrough: typeof import("./trackClickThrough").default;
  a11yNotify: typeof import("./a11yNotify").default;
}
