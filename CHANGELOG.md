# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.24.0] - 2025-05-28

### ✨ Added

- Replaced Searchkit SDK with a new internal `ApiClient` architecture for the Elasticsearch Connector. This significantly improves maintainability, customizability, and bundle size. [#1143](https://github.com/elastic/search-ui/pull/1143)
- Added support for filters in Autocomplete results. [#1150](https://github.com/elastic/search-ui/pull/1150)
- Introduced new advanced query customization options via `getQueryFn` and `interceptSearchRequest`, `interceptAutocompleteResultsRequest`, `interceptAutocompleteSuggestionsRequest` hooks. [#1161](https://github.com/elastic/search-ui/pull/1161)
- Added support for `fuzziness: true` in `searchQuery` and `autocomplete`, enabling typo-tolerant matching. [#1159](https://github.com/elastic/search-ui/pull/1159)
- Added support for range filters in the Elasticsearch Connector. [#1157](https://github.com/elastic/search-ui/pull/1157)
- Introduced a dedicated entry point for `ApiProxyConnector` to optimize bundle usage. [#1146](https://github.com/elastic/search-ui/pull/1146)

### 🧱 Changed

- **React 19 Support:** Upgraded `react` and `react-dom` peer dependencies to version 19. [#1162](https://github.com/elastic/search-ui/pull/1162)

### 🐛 Fixed

- Fixed issue where queries with no matches would still return results from filters — filters are now applied in conjunction with matching queries. [#1151](https://github.com/elastic/search-ui/pull/1151)
- Fixed incorrect behavior for facet filter types (`none`, `any`, `all`) in the Elasticsearch Connector. [#1153](https://github.com/elastic/search-ui/pull/1153)

### 🧹 Removed

- Fully removed the `searchkit` dependency from the Elasticsearch Connector. [#1143](https://github.com/elastic/search-ui/pull/1143)
- Deprecated `postProcessRequestBodyFn` in favor of new `interceptSearchRequest`, `interceptAutocompleteResultsRequest`, `interceptAutocompleteSuggestionsRequest` hooks. [#1161](https://github.com/elastic/search-ui/pull/1161)

### 🛠 Internal

- Migrated CI from CircleCI to GitHub Actions.
- Updated internal dev tooling: TypeScript, Jest, Replaced Enzyme with React Testing Library, ESLint, Prettier. [#1162](https://github.com/elastic/search-ui/pull/1162)
- Minified production bundles using `tsup`, excluded source maps from production output. [#1148](https://github.com/elastic/search-ui/pull/1148)
- Improved docs for Elasticsearch Connector, de-emphasized App Search and Workplace Search connectors. [#1149](https://github.com/elastic/search-ui/pull/1149)

---

## [1.23.0] - 2025-04-01

### ✨ Added

- Added the ability to preserve selected filters when performing a new search. This provides more flexibility in managing filter states between queries. [#1131](https://github.com/elastic/search-ui/pull/1131)  
  _Related to [#89](https://github.com/elastic/search-ui/issues/89)_
- Introduced `useSearch` hook for React functional components. [#1130](https://github.com/elastic/search-ui/pull/1130)
- Added `APIProxyConnector` to the Elasticsearch Connector to enable server-side integration using Node.js and Express. This enhances security by hiding API keys and other sensitive data. [#1126](https://github.com/elastic/search-ui/pull/1126)
- Added TypeScript support to the sandbox example. [#1126](https://github.com/elastic/search-ui/pull/1126)
- Updated sandbox structure, React version, and example organization. [#1126](https://github.com/elastic/search-ui/pull/1126)

### 🐛 Fixed

- Fixed export module compatibility issues by introducing bundling using `tsup`, ensuring correct behavior in both ESM and CommonJS environments. [#1114](https://github.com/elastic/search-ui/pull/1114)  
  _Fixes [#1046](https://github.com/elastic/search-ui/issues/1046)_
- Fixed sorting logic when using `sortField` and `sortDirection` in state. Addressed inconsistencies in `setSort()` behavior. [#1112](https://github.com/elastic/search-ui/pull/1112)  
  _Fixes [#1109](https://github.com/elastic/search-ui/issues/1109)_
- Fixed issue in `BooleanFacet` for numeric facet values (e.g., 0/1 or true/false), improving compatibility with Elasticsearch Connector. [#1111](https://github.com/elastic/search-ui/pull/1111)  
  _Fixes [#851](https://github.com/elastic/search-ui/issues/851)_

### 🧹 Removed

- Removed “Technical preview” label for Elasticsearch Connector as it is now generally available (GA). 🎉 [#1125](https://github.com/elastic/search-ui/pull/1125)
- Deprecated `@elastic/search-ui-analytics-plugin` package. [#1120](https://github.com/elastic/search-ui/pull/1120)

### 🛠 Internal

- Switched to `tsup` for consistent module bundling across packages. [#1114](https://github.com/elastic/search-ui/pull/1114)
- Applied shared TypeScript and bundling configurations across the repo. [#1114](https://github.com/elastic/search-ui/pull/1114)
