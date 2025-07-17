---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/solutions-ecommerce-search-page.html
applies_to:
  stack:
  serverless:
---

# Search Page [solutions-ecommerce-search-page]

:::{warning}
This example uses the App Search connector, which is now deprecated and will no longer be supported. Please use [Elasticsearch Connector](/reference/api-connectors-elasticsearch.md).
:::

The most important part of the search page is the relevance of the displayed results.

There are many ways to improve the relevance. In this article we’ll cover:

- tools available in the admin interface,
- combining similar results with variants,
- sorting — improved relevance achieved by a user.

## Improving relevance [solutions-ecommerce-search-page-improving-relevance]

App Search offers many tools to improve the relevance of your search results.

### Start with a language optimization [solutions-ecommerce-search-page-start-with-a-language-optimization]

Choosing the correct language during the engine creation is the easiest way to improve the relevance.

Language optimization will fine-tune features like **stemming**, **bigram matching\***, **\*phrase matching**, and **typo tolerance** for your chosen language.

Follow this guide for the exact steps: [Language optimization guide](https://www.elastic.co/guide/en/app-search/current/language-optimization-guide.html).

### Set up relevance tuning [solutions-ecommerce-search-page-set-up-relevance-tuning]

App Search’s relevance tuning feature allows you to fine-tune the order of the results for any given query.

Follow the [Relevance tuning guide](https://www.elastic.co/guide/en/app-search/current/relevance-tuning-guide.html) for the full feature description.

### Add synonyms [solutions-ecommerce-search-page-add-synonyms]

This step is optional but can also improve the relevance.

Sometimes users will use a query that doesn’t _exactly_ match your results. You’re selling **couches**, but a user searches for **sofa**? Tough luck!

To solve this problem, App Search offers a Synonyms feature. It lets you create groups of synonyms that will be used for matching.

Our [Synonyms guide](https://www.elastic.co/guide/en/app-search/current/relevance-tuning-guide.html) goes into more detail about the feature.

### Create curations [solutions-ecommerce-search-page-create-curations]

Curations allow you to

- promote some results to always show up at the top of the search results for a specific query
- hide some results from showing up in the search results for a specific query

Learn more about curations in our [Curations guide](https://www.elastic.co/guide/en/app-search/current/curations-guide.html)

## Variants [solutions-ecommerce-search-page-variants]

You might have several products that are essentially the same but have one different attribute. For example, it could be shirts of different colors. In our demo, it’s the same TV models but with different diagonal sizes.

If you have such products in your store, consider combining them into a single result. That will prevents users from being overwhelmed by the number of options.

:::{tip}
[Try the demo in CodeSandbox](https://codesandbox.io/embed/github/elastic/search-ui/tree/main/examples/sandbox?autoresize=1&fontsize=12&initialpath=%2Fecommerce%2Fcategory%2FTVs&module=%2Fsrc%2Fpages%2Fecommerce%2Findex.jsx).
:::

To implement this in Search UI, you’ll need to do the following:

1. Enrich your dataset.
2. Enable grouping in Search UI config.
3. Add variants rendering into your Result component.

### Enriching dataset [solutions-ecommerce-search-page-enriching-dataset]

Add a new field to all documents in your dataset that will be used for grouping search results. Here’s the example:

```json
[
  {
    "name": "Samsung TV 55 inch",
    "product_group": "[GROUP_ID_1]"
  },
  {
    "name": "Samsung TV 45 inch",
    "product_group": "[GROUP_ID_1]"
  },
  {
    "name": "LG TV 55 inch",
    "product_group": "[GROUP_ID_2]"
  }
]
```

Make sure to add that new field to all the documents in a dataset! Otherwise, API will combine all the documents missing that field into a single group.

### Enabling grouping in Search UI config [solutions-ecommerce-search-page-enabling-grouping-in-search-ui-config]

Search UI does not directly support the grouping, but it is supported by the underlying [App Search API](https://www.elastic.co/guide/en/app-search/current/grouping.html). So instead of enabling it in the Search UI config, we’ll enable it in the App Search connector config. Here’s an example:

```js
const connector = new AppSearchAPIConnector({
  searchKey: "search-key",
  engineName: "engine-name",
  endpointBase: "endpointBase",
  // enabling grouping in App Search connector config
  beforeSearchCall: (existingSearchOptions, next) =>
    next({
      ...existingSearchOptions,
      group: { field: "product_group", collapse: true }
    })
});

export const config = {
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector
  // other config properties
};
```

### Adding variants rendering into your Result component [solutions-ecommerce-search-page-adding-variants-rendering-into-your-result-component]

Once the grouping is enabled, the variants will be available via the `_group` field in your result document. Here’s a simplified example of how to use it:

```jsx
{
  result._group && result._group.length > 0 && (
    <ul>
      {result._group.map((variant) => (
        <li>
          <a href={variant.url.raw} target="_blank">
            <span dangerouslySetInnerHTML={{ __html: variant.name.snippet }} />
          </a>
        </li>
      ))}
    </ul>
  );
}
```

## Sorting [solutions-ecommerce-search-page-sorting]

% TO DO: Use `:class: screenshot`
![Sorting component](images/sorting.png)

Adding sorting is simple — just use our `<Sorting/>` component, like so:

```js
import { Sorting } from "@elastic/react-search-ui";

<Sorting
  label={"Sort by"}
  sortOptions={[
    {
      name: "Relevance",
      value: []
    },
    {
      name: "Price: Low to High",
      value: [{ field: "price", direction: "asc" }]
    },
    {
      name: "Price: High to Low",
      value: [{ field: "price", direction: "desc" }]
    }
  ]}
/>;
```

A good starting point for sorting options is to have these three:

- Relevance / Featured / Best Match (usually the default option)
- Price: Low to High
- Price: High to Low

Consider adding some of these if they apply to your data:

- Popularity
- User rating
- Distance (to the user)
- Newest first

:::{tip}
Check out sorting in action in our [CodeSandbox demo](https://codesandbox.io/embed/github/elastic/search-ui/tree/main/examples/sandbox?autoresize=1&fontsize=12&initialpath=%2Fecommerce%2Fsearch&module=%2Fsrc%2Fpages%2Fecommerce%2Findex.jsx).
:::

## Related Articles [solutions-ecommerce-search-page-related-articles]

- [Connectors API](/reference/api-connectors-app-search.md)
- [Sorting](/reference/api-react-components-sorting.md)
- [Creating Components](/reference/guides-creating-own-components.md): Build your own components for Search UI.
