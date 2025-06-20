---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/api-react-components-facet.html
applies_to:
  stack:
  serverless:
---

# Facet [api-react-components-facet]

Show a Facet filter for a particular field.

Must configure the corresponding field in the `SearchProvider` [facets](/reference/api-core-configuration.md#api-core-configuration-facets) object.

## Example [api-react-components-facet-example]

```jsx
import { Facet } from "@elastic/react-search-ui";
import { MultiCheckboxFacet } from "@elastic/react-search-ui-views";

...

<SearchProvider config={{
  ...otherConfig,
  searchQuery: {
    facets: {
     states: { type: "value", size: 30 }
    }
  }
}}>
  {() => (
    <Facet field="states" label="States" view={MultiCheckboxFacet} />
  )}
</SearchProvider>
```

## Example of an OR based Facet filter [api-react-components-facet-example-of-an-or-based-facet-filter]

Certain configuration of the `Facet` Component will require a "disjunctive" facet to work correctly. "Disjunctive" facets are facets that do not change when a selection is made. Meaning, all available options will remain as selectable options even after a selection is made.

```jsx
import { Facet } from "@elastic/react-search-ui";
import { MultiCheckboxFacet } from "@elastic/react-search-ui-views";

...

<SearchProvider config={{
  ...otherConfig,
  searchQuery: {
    disjunctiveFacets: ["states"],
    facets: {
     states: { type: "value", size: 30 }
    }
  }
}}>
  {() => (
    <Facet field="states" label="States" view={MultiCheckboxFacet} filterType="any" />
  )}
</SearchProvider>
```

## Properties [api-react-components-facet-properties]

| Name           | Description                                                                                                                                                                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className`    |                                                                                                                                                                                                                                                            |
| `field`        | Field name corresponding to this filter. This requires that the corresponding field has been configured in `facets` on the top level Provider.                                                                                                             |
| `filterType`   | The type of filter to apply with the selected values. I.e., should "all" of the values match, or just "any" of the values, or "none" of the values. Note: See the example above which describes using "disjunctive" facets in conjunction with filterType. |
| `label`        | A static label to show in the facet filter.                                                                                                                                                                                                                |
| `show`         | The number of facet filter options to show before concatenating with a "Show more" link.                                                                                                                                                                   |
| `isFilterable` | Whether or not to show Facet quick filter.                                                                                                                                                                                                                 |
| `persistent`   | Whether the facet filter should persist across searches. When true, the facet filter will not be cleared when a new search is performed.                                                                                                                   |
| `view`         | Used to override the default view for this Component. See [View customization](#api-react-components-facet-view-customization) below.                                                                                                                      |
| `*`            | Any other property passed will be passed through and available to use in a Custom View                                                                                                                                                                     |

## View customization [api-react-components-facet-view-customization]

A complete guide to view customization can be found in the [Customization: Component views and HTML](/reference/basic-usage.md#guides-customizing-styles-and-html-customizing-html) section.

The following properties are available in the view:

| Name                | Description                                                                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className`         | Passed through from main component.                                                                                                                            |
| `label`             | Type: `string`. Passed through from main component.                                                                                                            |
| `onMoreClick`       | Type: `() => void`. Used for a "Show more" link. Call this to show more options.                                                                               |
| `onRemove`          | Type: `(value: FieldValue) => void`. Call this when a user removes a facet filter selection. Pass the `value` from the corresponding selection from `options`. |
| `onChange`          | Type: `(value: FieldValue) => void`. Call this when a user changes a facet filter selection. Pass the `value` from the corresponding selection from `options`. |
| `onSelect`          | Type: `(value: FieldValue) => void`. Call this when a user adds a facet filter selection. Pass the `value` from the corresponding selection from `options`.    |
| `options`           | Type: `FacetValue[]`. The options to show available for selection for this facet. `selected` property will be true if this values is selected.                 |
| `showMore`          | Type: `boolean`. Whether or not to show a "Show more" link. If there are no more options available to show, then this will be `false`.                         |
| `values`            | Type: `FilterValue[]`. A list of all the selected values. This can also be deduced be inspected the `selected` properties of the `options`.                    |
| `showSearch`        | Type: `boolean`. Whether or not the compopnent is `isFilterable`. This would indicates that a filter search box should be shown.                               |
| `onSearch`          | Type: `(value: string) => void`. Call this to filter down the facet options shown. Used if there is a search box shown in relation to `showSearch`.            |
| `searchPlaceholder` | Type: `string`. The placeholder fo show in the filter search box when `showSearch` is true.                                                                    |

See [MultiCheckboxFacet.tsx](https://github.com/elastic/search-ui/blob/main/packages/react-search-ui-views/src/MultiCheckboxFacet.tsx) for an example.

When overriding Facet views, note that there are pre-built options that you can choose from, in addition to providing your own:

```jsx
import {
  BooleanFacet,
  SingleSelectFacet,
  SingleLinksFacet
} from "@elastic/react-search-ui-views";

// Default out-of-the-box view
<Facet
  field="acres"
  label="Acres"
/>

// Choose an alternate out-of-the-box view
<Facet
  field="acres"
  label="Acres"
  view={SingleSelectFacet}
/>
```
