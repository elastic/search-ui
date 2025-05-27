---
navigation_title: "Basic usage"
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/guides-customizing-styles-and-html.html
applies_to:
  stack:
  serverless:
---

# Customizing Styles and HTML [guides-customizing-styles-and-html]

In this guide we’ll customize some styles of the Search UI, modify the default HTML of one of the Search UI components, and also create a completely new Result component.

:::{tip}
See this code in action in our [live CodeSandbox demo](https://codesandbox.io/embed/github/elastic/search-ui/tree/main/examples/sandbox?autoresize=1&fontsize=12&initialpath=%2Fcustomizing-styles-and-html&module=%2Fsrc%2Fpages%2Fcustomizing-styles-and-html%2Findex.jsx).
:::

## Customizing styles [guides-customizing-styles-and-html-customizing-styles]

We provide a default stylesheet to get your project started quickly.

```jsx
import "@elastic/react-search-ui-views/lib/styles/styles.css";
```

You could choose to add your own stylesheet to override or augment these styles:

```jsx
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import "your-custom-styles.css";
```

You could also choose to replace these styles completely with your own stylesheet:

```jsx
import "your-custom-styles.css";
```

When target styles to override, we generally advise that you rely only on styles that are prefixed with `.sui`. We try to keep these compatible for version upgrades so that we don’t break your custom styles. However, we do recommend that you test your styles thoroughly when upgrading versions, even within minors.

Here is an example of a simple stylesheet that overrides much of the blue in the base styles with red to create a simple red theme:

```css
.sui-search-box__submit {
  background: none;
  background-color: red;
}

.sui-layout-sidebar-toggle {
  color: red;
  border: 1px solid red;
}

.sui-result__title,
.sui-result__title-link {
  color: red;
}

.sui-facet-view-more {
  color: red;
}
```

## Customizing html [guides-customizing-styles-and-html-customizing-html]

All components in this library can be customized by providing a `view` prop.

The view prop can be used to customize a component’s look and feel while still maintaining the component’s logic.

This follows the [React Render Props](https://reactjs.org/docs/render-props.html) pattern. The `view` prop is a function. The various logic and values your view needs are passed through as parameters to the `view` function you provide.

Every component will have a different function signature for its view.

Here is an example of a custom view being provided for the `PagingInfo` component:

```jsx
<PagingInfo
  view={({ start, end }: { start: number, end: number }) => (
    <div className="paging-info">
      <strong>
        {start} - {end}
      </strong>
    </div>
  )}
/>
```

You’ll note that the `view` function here has four parameters that are available to use:

1. `searchTerm` - The search term used for this query.
2. `start` - The number of the first result shown.
3. `end` - The number of the last result shown.
4. `totalResults` - The total number of results for this query.

In this case, we’ve decided to create a simple view that shows the starting and ending result numbers on this page. We’ve chosen not to use the `totalResults` or `searchTerm` properties.

Specific documentation for customizing the view of each component can be found in the documentation for each component. For example, [the Result component](/reference/api-react-components-result.md#api-react-components-result-view-customization).
