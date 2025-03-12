---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/api-react-components-sorting.html
---

# Sorting [api-react-components-sorting]

Shows a dropdown for selecting the current Sort.


## Example [api-react-components-sorting-example]

```jsx
import { Sorting } from "@elastic/react-search-ui";

...

<Sorting
  sortOptions={[
    {
      name: "Relevance",
      value: "",
      direction: ""
    },
    {
      name: "Title",
      value: "title",
      direction: "asc"
    }
  ]}
/>
```


## Properties [api-react-components-sorting-properties]

| Name | Description |
| --- | --- |
| className |  |
| label | A static label to show in the Sorting Component. |
| sortOptions |  |
| view | Used to override the default view for this Component. See [View customization](#api-react-components-sorting-view-customization) below. |
| * | Any other property passed will be passed through and available to use in a Custom View |


## View customization [api-react-components-sorting-view-customization]

A complete guide to view customization can be found in the [Customization: Component views and HTML](/reference/basic-usage.md#guides-customizing-styles-and-html-customizing-html) section.

The following properties are available in the view:

| Name | Description |
| --- | --- |
| className | Passed through from main component. |
| label | The label to display for this component. For example: "Sort by". |
| onChange | function(value: string) - Pass the value to this callback from the selected sort option |
| options | `{ value: string; label: string;}[]` - Options to display |
| value | string - The currently selected value |

See [Sorting.tsx](https://github.com/elastic/search-ui/blob/main/packages/react-search-ui-views/src/Sorting.tsx) for an example.

