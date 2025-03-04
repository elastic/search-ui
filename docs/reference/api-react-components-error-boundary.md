---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/api-react-components-error-boundary.html
---

# ErrorBoundary [api-react-components-error-boundary]

Handle unexpected errors.


## Example [api-react-components-error-boundary-example]

```jsx
import { ErrorBoundary } from "@elastic/react-search-ui";

...

<ErrorBoundary>
  <div>Some Content</div>
</ErrorBoundary>
```


## Properties [api-react-components-error-boundary-properties]

| Name | Description |
| --- | --- |
| className |  |
| children | Content to show if no error has occurred, will be replaced with error messaging if there was an error. |
| view | Used to override the default view for this Component. See [View customization](#api-react-components-error-boundary-view-customization) below. |
| * | Any other property passed will be passed through and available to use in a Custom View |


## View customization [api-react-components-error-boundary-view-customization]

A complete guide to view customization can be found in the [Customization: Component views and HTML](/reference/basic-usage.md#guides-customizing-styles-and-html-customizing-html) section.

The following properties are available in the view:

| Name | Description |
| --- | --- |
| className | Passed through from main component. |
| children | Content to show if no error has occurred, will be replaced with error messaging if there was an error. |
| error | Type: `string`. The error message to show if an error occurred. |

See [ErrorBoundary.tsx](https://github.com/elastic/search-ui/blob/main/packages/react-search-ui-views/src/ErrorBoundary.tsx) for an example.

