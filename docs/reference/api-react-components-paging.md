---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/api-react-components-paging.html
---

# Paging [api-react-components-paging]

Navigate through pagination.

## Example [api-react-components-paging-example]

```jsx
import { Paging } from "@elastic/react-search-ui";

...

<Paging />
```

## Properties [api-react-components-paging-properties]

| Name      | Description                                                                                                                            |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| className |                                                                                                                                        |
| view      | Used to override the default view for this Component. See [View customization](#api-react-components-paging-view-customization) below. |
| \*        | Any other property passed will be passed through and available to use in a Custom View                                                 |

## View customization [api-react-components-paging-view-customization]

A complete guide to view customization can be found in the [Customization: Component views and HTML](/reference/basic-usage.md#guides-customizing-styles-and-html-customizing-html) section.

The following properties are available in the view:

| Name           | Description                                                             |
| -------------- | ----------------------------------------------------------------------- |
| className      | Passed through from main component.                                     |
| current        | Type: `number`. The current page                                        |
| resultsPerPage | Type: `number`. The number of results that are shown per page.          |
| onChange       | function(value: number) - call this with the newly selected page number |
| totalPages     | Type: `number`. The total number of pages.                              |

See [Paging.tsx](https://github.com/elastic/search-ui/blob/main/packages/react-search-ui-views/src/Paging.tsx) for an example.
