## 0.1.0 (January 3, 2019)

- Initial "Alpha" Release

## 0.2.0 (January 25, 2019)

- Updated to `search-ui` v0.2.0, which reworked how query filters are maintained
  in the URL. Old search results links that have been saved will be incompatible
  with this new version.
- Updated type schema of `ValueFilterValue`.

## 0.4.0 (February 11, 2019)

- Search As You Type support via a `searchAsYouType` option on `SearchBox`.

## 0.5.0 (March 6, 2019)

- #90
- #8
- #15
- #107
- #114

Breaking Changes:

- Generally speaking the data model changed, especially with regards to `filters`, `facets`
  and `results`. If you were working directly with any of these types of state
  you will likely need to rework your solution. The data model can be seen
  here: https://github.com/elastic/search-ui/tree/8ddad47165d17c768a024a134059f215f9096365/packages/react-search-ui/src/types.

## 0.5.1 (March 7, 2019)

Fixed this error: "ReferenceError: regeneratorRuntime is not defined"
