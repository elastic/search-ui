## 0.12.1 (July 3, 2019)

- Fixed a CSS bug (@JasonStoltz in 301)
- Apply passed className prop to Layout component (@constancecchen in #310)

## 0.12.0 (July 1, 2019)

- Removed Roboto font (@JasonStoltz in #296)

### Breaking Changes

The Roboto font is no longer used by this library. We default to system fonts
instead. We do this to minimize the size, number of dependencies, and overall
surface area for this library. When you get this latest version, you may
see a visual difference due to the font changes.

## 0.11.0 (June 27, 2019)

- Fixed issue with state not updating (@JasonStoltz in #291)
- `_meta` field is now returned in results for App Search Connector (@JasonStoltz in #277)
- Added a inputView option to SearchBox component (@JasonStoltz in #273)
- Loosened the "Result" object schema (@JasonStoltz in #271)
- Removed "additionalOptions" from connectors and replaced with before\* hooks (@JasonStoltz in #270)

### Breaking Changes

The `additionalOptions` was removed from `SiteSearchAPIConnector`, and `AppSearchAPIConnector`.

They were replaced with 3 separate hooks:
`beforeAutocompleteSuggestionsCall`
`beforeAutocompleteResultsCall`
`beforeSearchCall`

Please check the `ADVANCED.md` guide for more information. Generally speaking, the new API
signature looks like the following:

```js
// Example of using beforeSearchCall to append an additional option on an API request
const connector = new AppSearchAPIConnector({
  searchKey: "search-xxxxxxxxxxxxxxxxxxxx",
  engineName: "search-data",
  hostIdentifier: "host-xxxxxx",
  beforeSearchCall: (existingSearchOptions, next) =>
    next({
      ...existingSearchOptions,
      group: { field: "title" }
    })
});
```

## 0.10.0 (June 17, 2019)

- Cursor fix on autocomplete (@zumwalt in #259)
- Added Geo Facet filter support (@JasonStoltz in #260)
- Fixed layout issue in Results css (@JasonStoltz in #266)
- Fixed core-js error (@JasonStoltz in #267)

## 0.9.3 (June 10, 2019)

- Republishing because 0.9.2 was missing style assets due to a bad publish.

## 0.9.2 (June 10, 2019)

- Fixed withSearch CDM (@JasonStoltz in #257)

## 0.9.1 (June 5, 2019)

- Republishing because 0.9.0 was missing style assets due to a bad publish.

## 0.9.0 (June 4, 2019)

- Updated Facet component to support quick search filter options (@m-sureshraj in #248)
- Performance fixes (@JasonStoltz in #249)

### Breaking Changes

The performance fixes PR introduced significant changes to the Search UI API.

- Search UI now has a peer dependency on react 16.8, bumped from 16.6.
- **`SearchProvider` no longer accepts a function as a child.** This will affect
  EVERY Search UI implementation. If you were previously accessing State or Actions
  in that render prop, you will now need to instead use the `WithSearch` component.

  ex.

  Before:

  ```
  <SearchProvider config={config}>
    {({ searchTerm, setSearchTerm, results }) => {
      ...
    }}
  </SearchProvider>
  ```

  After:

  ```
  <SearchProvider config={config}>
    <WithSearch
        mapContextToProps={({ searchTerm, setSearchTerm, results }) => ({
          searchTerm,
          setSearchTerm,
          results
        })}
      >
      {({ searchTerm, setSearchTerm, results }) => {
        ...
      }}
    </WithSearch>
  </SearchProvider>
  ```

- The API for `withSearch` has changed. You now must specify which actions and state you need in a
  mapContextToProps function.

Before:

```
export default withSearch(ResultsContainer);
```

After:

```
export default withSearch(({ results }) => ({ results }))(ResultsContainer);
```

- All components in this library, and components created with `withSearch` are now
  "Pure Components". It is possible that if you were mutating state incorrectly with `setState`, that the components
  no longer update. See this guide for more information: https://reactjs.org/docs/optimizing-performance.html#examples.
- `SearchConsumer` was renamed to `WithSearch` and now requires a `mapContextToProps` parameter.

Before:

```
<SearchConsumer>
  {({ searchTerm, setSearchTerm, results }) => {
    ...
  }}
</SearchConsumer>
```

After:

```
<WithSearch
    mapContextToProps={({ searchTerm, setSearchTerm, results }) => ({
      searchTerm,
      setSearchTerm,
      results
    })}
  >
  {({ searchTerm, setSearchTerm, results }) => {
    ...
  }}
</WithSearch>
```

## 0.8.0 (May 2, 2019)

- Configurable `ResultsPerPage` component options (@m-sureshraj in #224)
- Connector-less usage (@JasonStoltz in #225)
- Swapped autocomplete and autosuggest ordering in Autocomplete (@JasonStoltz in #222)
- Added cursor pointer to facet checkbox on hover (@JasonStoltz in #221)
- Containers no longer hide themselves by default before first search (@byronhulcher in #203)
- Fix warning message about importing browserHistory (@byronhulcher in #215)

### Breaking Changes

- Connector-less usage introduces breaking changes for the **Connector layer**. This would impact anyone who has
  implemented any sort of Connector directly (#225). The following interface methods have been renamed:
  - `click` -> `onResultClick`
  - `autocompleteClick` -> `onAutocompleteResultClick`
  - `search` -> `onSearch`
  - `autocomplete` -> `onAutocomplete`
- The ordering of "autocompleteResults" and "autocompleteSuggestions" has been swapped in the default view of
  `Autocomplete`. If you are using the default view these will be visibly different (#222).
- Some components will no longer automatically hide themselves until search results are rendered (#203). This means
  you may need to manually hide them using the `wasSearched` property from state in order to maintain this behavior.
  This affects the following components:
  - `PagingInfo`
  - `Sorting`
  - `ResultsPerPage`

## 0.7.0 (April 19, 2019)

- All components now accept a `className` property #56
- SearchBox `inputProps` now accepts a `className` property #191
- Facet components now accept a `filterType` prop of "all", "or", or "none" #53 #10
- Filter related actions now accept a `filterType of "all", "or", or "none" #53 #10

## 0.6.1 (April 17, 2019)

- Fixed `autocompleteView` prop in `SearchBox`

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

## 0.5.3 (April 10, 2019)

- Fixed inter-package dependencies so they are fixed to current version.
- Reverted breaking change introduced in version 0.5.2, which moved
  certain configuration in the SearchDriver to a 'queryConfig' property.

## 0.5.1 (March 7, 2019)

Fixed this error: "ReferenceError: regeneratorRuntime is not defined"

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

## 0.4.0 (February 11, 2019)

- Search As You Type support via a `searchAsYouType` option on `SearchBox`.

## 0.2.0 (January 25, 2019)

- Updated to `search-ui` v0.2.0, which reworked how query filters are maintained
  in the URL. Old search results links that have been saved will be incompatible
  with this new version.
- Updated type schema of `ValueFilterValue`.

## 0.1.0 (January 3, 2019)

- Initial "Alpha" Release
