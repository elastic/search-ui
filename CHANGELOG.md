# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

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
