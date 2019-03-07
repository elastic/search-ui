## 0.1.0 (January 3, 2019)

- Initial "Alpha" Release

## 0.2.0 (January 25, 2019)

- Updated type schema of `ValueFilterValue`.

## 0.4.0 (February 11, 2019)

- Updated styles

## 0.5.0 (March 6, 2019)

- #90
- #8
- #15
- #107
- #114

Breaking Changes:

- Facet component views have been renamed:
  - SingleRangeSelectFacet > SingleSelectFacet
  - MultiValueFacet > MultiCheckboxFacet
  - SingleValueLinksFacet > SingleLinksFacet
- The PropTypes validation changed for these views. If you were explicitly
  passing `options` or `values` parameters directly to these views, then you will
  likely have conflicts.
- Generally speaking the data model changed, especially with regards to `filters`, `facets`
  and `results`. If you were working directly with either of these types of data
  you will likely need to rework your solution. The data model can be seen
  here: https://github.com/elastic/search-ui/tree/8ddad47165d17c768a024a134059f215f9096365/packages/react-search-ui-views/src/types.

## 0.5.1 (March 7, 2019)

Fixed this error: "ReferenceError: regeneratorRuntime is not defined"
