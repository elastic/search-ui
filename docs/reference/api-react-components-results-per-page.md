---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/api-react-components-results-per-page.html
applies_to:
  stack:
---

# ResultsPerPage [api-react-components-results-per-page]

Shows a dropdown for selecting the number of results to show per page.

Uses [20, 40, 60] as default options. You can use `options` prop to pass custom options.

:::{note}
When passing custom options make sure one of the option values match the current `resultsPerPageProp` value, which is 20 by default. To override `resultsPerPage` default value, use the [initial state](/reference/api-react-search-provider.md#api-react-search-provider-initial-state) property.
:::

## Example [api-react-components-results-per-page-example]

```jsx
import { ResultsPerPage } from "@elastic/react-search-ui";

...

<ResultsPerPage />
```

## Example using custom options [api-react-components-results-per-page-example-using-custom-options]

```jsx
import { SearchProvider, ResultsPerPage } from "@elastic/react-search-ui";

<SearchProvider
    config={
        ...
        initialState: {
            resultsPerPage: 5
        }
    }
>
    <ResultsPerPage options={[5, 10, 15]} />
</SearchProvider>
```

## Properties [api-react-components-results-per-page-properties]

| Name      | Description                                                                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| className |                                                                                                                                                  |
| options   | Type: `number[]`. Dropdown options to select the number of results to show per page.                                                             |
| view      | Used to override the default view for this Component. See [View customization](#api-react-components-results-per-page-view-customization) below. |
| \*        | Any other property passed will be passed through and available to use in a Custom View.                                                          |

## View customization [api-react-components-results-per-page-view-customization]

A complete guide to view customization can be found in the [Customization: Component views and HTML](/reference/basic-usage.md#guides-customizing-styles-and-html-customizing-html) section.

The following properties are available in the view:

| Name      | Description                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| className | Passed through from main component.                                                                                  |
| onChange  | function(value: number) - Call this function with the select value from `options` after a user has made a selection. |
| options   | Passed through from main component.                                                                                  |
| value     | The currently selected option.                                                                                       |

See [ResultsPerPage.tsx](https://github.com/elastic/search-ui/blob/main/packages/react-search-ui-views/src/ResultsPerPage.tsx) for an example.
