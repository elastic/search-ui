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

## 0.5.3 (April 10, 2019)

- Fixed inter-package dependencies so they are fixed to current version.
- Reverted breaking change introduced in version 0.5.2, which moved
  certain configuration in the SearchDriver to a 'queryConfig' property.

## 0.6.0 (April 16, 2019)

- Added autocomplete support to Search UI #113
  - The SearchBox component now has many additional configuration options available for using Autocomplete
  - Autocomplete queries can now be configured much like a the main search query via configuration on the SearchDriver / SearchProvider.
- `SearchBox` view now uses Downshift library #135
- The `Result` view component signature changed in order to accept primarily just a single `results` #82
- Query configuration options were moved out of the main configuration in SearchDriver / SearchProvider and are now nested under a `searchQuery` field. Described in Autocomplete Spec: #113, commit 902b431338ece6c5b759f35af2688f85638663b0
- The `searchQuery` allows adding static configuration to search queries, like `filters`, etc., which are applied to queries regardless statically, and not from application state. Describe in Autocomplete spec: #113, commit: 121616c4d6647a9f4bc059869d620c083e0b90eb
- Fixed a number of issues that were occurring when using custom views: #160
- Added a debug option to SearchDriver #169
- Fixed unmount / history issues when using client side routing: #174 #177 #178
