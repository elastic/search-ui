---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/api-react-components-results.html
---

# Results [api-react-components-results]

Displays all search results.


## Example [api-react-components-results-example]

```jsx
import { Results } from "@elastic/react-search-ui";

...

<Results titleField="title" urlField="nps_link" />
```


## Configuring search queries [api-react-components-results-configuring-search-queries]

Certain aspects of search results can be configured in `SearchProvider`, using the `searchQuery` configuration, such as term highlighting and search fields. See the [Search Query Configuration](/reference/api-core-configuration.md#api-core-configuration-search-query-queryconfig) guide for more information.


## Properties [api-react-components-results-properties]

| Name | Description |
| --- | --- |
| className |  |
| titleField | Name of field to use as the title from each result. |
| shouldTrackClickThrough | Whether or not to track a clickthrough event when clicked. |
| clickThroughTags | Tags to send to analytics API when tracking clickthrough. |
| urlField | Name of field to use as the href from each result. |
| thumbnailField | Name of field to use for thumbnail image. Should be a valid URL and at least 220px wide. |
| resultView | See [Result component customization.](/reference/api-react-components-result.md#api-react-components-result-view-customization) |
| view | Used to override the default view for this Component. See [View customization](#api-react-components-results-view-customization) below. |
| * | Any other property passed will be passed through and available to use in a Custom View |


## View customization [api-react-components-results-view-customization]

A complete guide to view customization can be found in the [Customization: Component views and HTML](/reference/basic-usage.md#guides-customizing-styles-and-html-customizing-html) section.

This component accepts two view props: `view` and `resultView`. The `resultView` allows you to customize the individual result items that are displayed. The `view` prop allows you to customize that wrapper around those results, which by default is simply a `ul` element.

A separate guide specifically for customizing the Result component can be found [here.](/reference/api-react-components-result.md#api-react-components-result-view-customization), which can be used for providing a `resultView` prop.

The following properties are available in the view:

| Name | Description |
| --- | --- |
| className | Passed through from main component |
| children |  |

See [Results.tsx](https://github.com/elastic/search-ui/blob/main/packages/react-search-ui-views/src/Results.tsx) for an example.

