---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/guides-using-search-as-you-type.html
---

# Using search-as-you-type [guides-using-search-as-you-type]

Usually, the search query is executed when the user presses the enter key or clicks the search button.

Search-as-you-type feature allows search queries to be executed on every keystroke.

To implement this in Search UI, you’ll need to add a `searchAsYouType={{true}}` prop to `<SearchBox/>` component.

It’s a good idea to add a debounce time — the Search UI will wait for users to finish typing before issuing the request. You can do it by adding a `debounceLength={{300}}` prop to `<SearchBox/>` component.

:::{tip}
See how search-as-you-type works in our [CodeSandbox demo](https://codesandbox.io/embed/github/elastic/search-ui/tree/main/examples/sandbox?autoresize=1&fontsize=12&initialpath=%2Fsearch-as-you-type&module=%2Fsrc%2Fpages%2Fsearch-as-you-type%2Findex.js).
:::

Related documentation:

- [SearchBox component](/reference/api-react-components-search-box.md)
