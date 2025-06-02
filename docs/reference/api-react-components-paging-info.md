---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/api-react-components-paging-info.html
applies_to:
  stack:
---

# PagingInfo [api-react-components-paging-info]

Paging details, like "1 - 20 of 100 results".

## Example [api-react-components-paging-info-example]

```jsx
import { PagingInfo } from "@elastic/react-search-ui";

...

<PagingInfo />
```

## Properties [api-react-components-paging-info-properties]

| Name      | Description                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| className |                                                                                                                                             |
| view      | Used to override the default view for this Component. See [View customization](#api-react-components-paging-info-view-customization) below. |
| \*        | Any other property passed will be passed through and available to use in a Custom View                                                      |

## View customization [api-react-components-paging-info-view-customization]

A complete guide to view customization can be found in the [Customization: Component views and HTML](/reference/basic-usage.md#guides-customizing-styles-and-html-customizing-html) section.

The following properties are available in the view:

| Name         | Description                                                                     |
| ------------ | ------------------------------------------------------------------------------- |
| className    | Passed through from main component.                                             |
| end          | Type: `number`. The position of the last result shown on this page of reuslts.  |
| searchTerm   | Type: `string`. The current search term.                                        |
| start        | Type: `number`. The position of the first result shown on this page of reuslts. |
| totalResults | Type: `number`. The total number of results.                                    |

See [PagingInfo.tsx](https://github.com/elastic/search-ui/blob/main/packages/react-search-ui-views/src/PagingInfo.tsx) for an example.
