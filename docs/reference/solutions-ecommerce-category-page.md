---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/solutions-ecommerce-category-page.html
---

# Category Page [solutions-ecommerce-category-page]

This is a category page:

:::{image} images/category-page.png
:alt: Category page
:class: screenshot
:::

At first glance, the category page looks very similar to a search page — they display a list of products and have facets to help users refine the results. But while the search page is made for "searching" the entire catalog by typing a query, the category page is made for "exploring" a small subset of products with the help of filters.

On the screenshot above, we are only exploring the "Women’s Athletic Shoes" section of the catalog.

In this article, we will talk about how to implement a product category page with Search UI.

:::{tip}
See the category page demo in action in [CodeSandbox](https://codesandbox.io/embed/github/elastic/search-ui/tree/main/examples/sandbox?autoresize=1&fontsize=12&initialpath=%2Fecommerce%2Fcategory%2FTVs&module=%2Fsrc%2Fpages%2Fecommerce%2Findex.js).
:::

## Applying Filters to the Category Page [solutions-ecommerce-category-page-applying-filters-to-the-category-page]

It’s important to consider the SEO of a category page. Some of your customers will come from search engines, and having a good-looking URL will help you rank higher.

Let’s say we want to have a category page for TVs. You can do it by taking a search page and applying a filter to only show TVs.

Now, if we do so on a search page, we’ll have a URL like this:

```txt
mystore.com/search?filters%5B0%5D%5Bfield%5D=categories&filters%5B0%5D%5Bvalues%5D%5B0%5D=TVs
```

Not very readable!

What we want instead is to have a URL like this:

```txt
mystore.com/category/tvs/
```

To achieve that, we’ll need to:

1. Create the category page in our application;
2. Apply a filter via Search UI config.

The first part is highly dependent on your application’s framework. Refer to its documentation for creating a new page.

For the second part, copy the Search UI config from the search page and add the `searchQuery.filters` value. Then pass the new config to your `SearchProvider`:

```jsx
// import your Search UI config
import { config } from "./config";
import { SearchProvider, WithSearch } from "@elastic/react-search-ui";

const categoryTvsConfig = {
  ...config,
  searchQuery: {
    ...config.searchQuery,
    // adding a filter to only show TVs
    filters: [{ field: "parent_category", values: ["TVs"] }]
  }
};

export default function CategoryPageTvs() {
  return (
    // Pass the new config to SearchProvider
    <SearchProvider config={categoryTvsConfig}>
      <WithSearch mapContextToProps={() => ({})}>
        {() => {
          // The components you want to render go here
        }}
      </WithSearch>
    </SearchProvider>
  );
}
```

That’s it! The new category page has a good URL and only shows results that match the filter.


## Facets [solutions-ecommerce-category-page-facets]

:::{image} images/facets.png
:alt: Facets
:class: screenshot
:::

Facets are the essential part of the category page. Since category pages typically don’t have a search box, facets become the primary tool for finding the products.

*Facets let users **explore** what’s available in your store rather than **search** for a specific product.*

It’s best to provide facets that are unique to the presented category.

In our example of the TVs category page, in addition to common facets, like:

* Price
* Brand
* Rating

we also have TV-specific facets:

* Smart TV *(boolean)*
* TV resolution *(string: "Full HD", "4k", etc.)*
* TV diagonal *(number)*

These TV-specific facets are not useful on the search page since they are not relevant to most of the results.

<hr>
There are several ways to implement this in Search UI. They offer different levels of control and flexibility.

1. All category pages share a single config. It is the simplest option to implement but is also the least flexible and performant.
2. All category pages share a single config, but the facets are shown conditionally. It is a middle ground in simplicity and flexibility and is as performant as the next option.
3. Each category page uses a separate config. It is the most flexible and most performant option, but it requires more work to implement.


### Single config [solutions-ecommerce-category-page-single-config]

You can use a single Search UI config on the search page and all category pages. However, it comes with a performance drawback: the facets data will be requested on every page even if it’s not used. The decision is up to you: a single config will work as well as separate configs if most of your documents share the same properties.

To implement this, you’ll need to:

1. Add new result fields to `searchQuery.resultFields`
2. Add new facets to `searchQuery.facets`
3. (optional) Add new disjunctiveFacets `searchQuery.disjunctiveFacets`

Then, add the `Facet` components to UI.

The resulting code will look something like this:

```jsx
// import your Search UI config
import { SearchProvider, WithSearch } from "@elastic/react-search-ui";

const config = {
  searchQuery: {
    // 1. Adding new resilt fields, these will be used for the facets
    result_fields: {
      tv_size: { raw: {} },
      tv_smart_tv: { raw: {} },
      tv_resolution: { raw: {} }
      // some other fields
    },
    // 2. Adding the new facets
    facets: {
      tv_size: {
        type: "value",
        sort: { value: "asc" }
      },
      tv_smart_tv: {
        type: "value"
      },
      tv_resolution: {
        type: "value",
        sort: { value: "asc" }
      }
      // some other facets
    },
    // 3. Making some of newly added facets disjunctive
    disjunctiveFacets: ["tv_size", "tv_resolution"]
  }
};

export default function CategoryPage() {
  return (
    // Pass the config to SearchProvider
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={() => ({})}>
        {() => {
          return (
            // The components you want to render go here
            // For the sake of brevity, we're only showing the new facets
            <>
              <Facet field="tv_smart_tv" label="Smart TV" view={BooleanFacet} />
              <Facet field="tv_resolution" label="Resolution" />
              <Facet field="tv_size" label="Diagonal size" />
            </>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
```


### Conditional facets [solutions-ecommerce-category-page-conditional-facets]

Search UI allows you to show facets conditionally based on the applied filters. Follow the main guide for more info and code examples: [Conditional facets](/reference/guides-conditional-facets.md).


### Separate configs [solutions-ecommerce-category-page-separate-configs]

This option closely follows the single config option but requires you to make a copy of the main Search UI config (that you use on the search page) first.

1. Import and make a copy of the main Search UI config
2. Add new result fields to `searchQuery.resultFields`
3. Add new facets to `searchQuery.facets`
4. (optional) Add new disjunctiveFacets `searchQuery.disjunctiveFacets`

Then, add the `Facet` components to UI.

Here’s how to do it all at once:

```jsx
// import your Search UI config
import { config } from "./config";
import { SearchProvider, WithSearch } from "@elastic/react-search-ui";

const categoryTvsConfig = {
  ...config,
  searchQuery: {
    ...config.searchQuery,
    filters: [{ field: "parent_category", values: ["TVs"] }],
    // 1. Adding new resilt fields, these will be used for the facets
    result_fields: {
      ...config.searchQuery.result_fields,
      tv_size: { raw: {} },
      tv_smart_tv: { raw: {} },
      tv_resolution: { raw: {} }
    },
    // 2. Adding the new facets
    facets: {
      ...config.searchQuery.facets,
      tv_size: {
        type: "value",
        sort: { value: "asc" }
      },
      tv_smart_tv: {
        type: "value"
      },
      tv_resolution: {
        type: "value",
        sort: { value: "asc" }
      }
    },
    // 3. Making some of newly added facets disjunctive
    disjunctiveFacets: [
      ...config.searchQuery.disjunctiveFacets,
      "tv_size",
      "tv_resolution"
    ]
  }
};

export default function CategoryPageTvs() {
  return (
    // Pass the new config to SearchProvider
    <SearchProvider config={categoryTvsConfig}>
      <WithSearch mapContextToProps={() => ({})}>
        {() => {
          return (
            // The components you want to render go here
            // For the sake of brevity, we're only showing the new facets
            <>
              <Facet field="tv_smart_tv" label="Smart TV" view={BooleanFacet} />
              <Facet field="tv_resolution" label="Resolution" />
              <Facet field="tv_size" label="Diagonal size" />
            </>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
```


### Example [solutions-ecommerce-category-page-example]

Search UI offers several kinds of facets out-of-the-box:

* MultiCheckboxFacet
* BooleanFacet
* SingleLinksFacet

Here’s an example of how to use them:

```jsx
import { BooleanFacet, SingleLinksFacet } from "@elastic/react-search-ui-views";

<Facet
  field="tv_smart_tv"
  label="Smart TV"
  view={BooleanFacet}
/>
<Facet
  field="tv_resolution"
  label="Resolution"
  view={SingleLinksFacet}
/>
<Facet
  field="tv_size"
  label="Diagonal size"
  filterType="any" // accepts "all", "any" and "none"
  // Using the default view={MultiCheckboxFacet}
/>
```

And the resulting UI:

:::{image} images/facet-views.png
:alt: Facet views
:class: screenshot
:::

You might need a facet that Search UI doesn’t offer, for example, a dedicated color-picker. With Search UI, you can build a custom facet that will work like a native one. Refer to the [Creating custom components guide](/reference/guides-creating-own-components.md) to learn how.


## Variants [solutions-ecommerce-category-page-variants]

See the main guide for more info about variants: [Variants guide](/reference/solutions-ecommerce-search-page.md#solutions-ecommerce-search-page-variants).


## Sorting [solutions-ecommerce-category-page-sorting]

See the main guide for more info about sorting: [Sorting guide](/reference/solutions-ecommerce-search-page.md#solutions-ecommerce-search-page-sorting).


## Related Articles [solutions-ecommerce-category-page-related-articles]

* [Core API](/reference/api-core-configuration.md): Search UI Configuration API.
* [Facet](/reference/api-react-components-facet.md)
* [Creating Components](/reference/guides-creating-own-components.md): Build your own components for Search UI.
