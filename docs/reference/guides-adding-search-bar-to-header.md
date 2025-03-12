---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/guides-adding-search-bar-to-header.html
---

# Adding search bar to header [guides-adding-search-bar-to-header]

It’s a common pattern to have a search bar in the header of your website. Submitting a query in this search bar usually redirects user to a separate search results page.

To implement this with Search UI use the `<SearchBar>` component and add `onSubmit` prop that redirects user to the search page:

```js
<SearchBox
  onSubmit={(searchTerm) => {
    window.location.href = `${PATH_TO_YOUR_SEARCH_PAGE}?q=${searchTerm}`;
  }}
/>
```

Once the redirect happens, Search UI will pick up the query from the URL and display the results.

:::{tip}
View this implementation in our [CodeSandbox example](https://codesandbox.io/embed/github/elastic/search-ui/tree/main/examples/sandbox?autoresize=1&fontsize=12&initialpath=%2Fsearch-bar-in-header&module=%2Fsrc%2Fpages%2Fsearch-bar-in-header%2Findex.js).
:::

Related documentation:

* [SearchBox component](/reference/api-react-components-search-box.md)

