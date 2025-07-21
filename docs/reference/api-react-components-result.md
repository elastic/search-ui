---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/api-react-components-result.html
applies_to:
  stack:
  serverless:
---

# Result [api-react-components-result]

## Result [api-react-components-result-result]

Displays a search result.

### Example [api-react-components-result-example]

```jsx
import { Result } from "@elastic/react-search-ui";

...

<SearchProvider config={config}>
  {({ results }) => {
    return (
      <div>
        {results.map(result => (
          <Result key={result.id.raw}
            result={result}
            titleField="title"
            urlField="nps_link"
          />
        ))}
      </div>
    );
  }}
</SearchProvider>
```

### Configuring search queries [api-react-components-result-configuring-search-queries]

Certain aspects of search results can be configured in `SearchProvider`, using the `searchQuery` configuration, such as term highlighting and search fields. See the [Search Query Configuration](/reference/api-core-configuration.md#api-core-configuration-search-query-queryconfig) guide for more information.

### Properties [api-react-components-result-properties]

| Name                    | Description                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| className               |                                                                                                                                        |
| titleField              | Name of field to use as the title from each result.                                                                                    |
| shouldTrackClickThrough | Whether or not to track a clickthrough event when clicked.                                                                             |
| clickThroughTags        | Tags to send to analytics API when tracking clickthrough.                                                                              |
| urlField                | Name of field to use as the href from each result.                                                                                     |
| result                  | Type: `SearchResult`. An object representing the search result to render.                                                              |
| view                    | Used to override the default view for this Component. See [View customization](#api-react-components-result-view-customization) below. |
| \*                      | Any other property passed will be passed through and available to use in a Custom View                                                 |

### View customization [api-react-components-result-view-customization]

A complete guide to view customization can be found in the [Customization: Component views and HTML](/reference/basic-usage.md#guides-customizing-styles-and-html-customizing-html) section.

Example:

```jsx
const CustomResultView = ({
  result,
  onClickLink
}: {
  result: SearchResult,
  onClickLink: () => void
}) => (
  <li className="sui-result">
    <div className="sui-result__header">
      <h3>
        {/* Maintain onClickLink to correct track click throughs for analytics*/}
        <a onClick={onClickLink} href={result.nps_link.raw}>
          {result.title.snippet}
        </a>
      </h3>
    </div>
    <div className="sui-result__body">
      {/* use 'raw' values of fields to access values without snippets */}
      <div className="sui-result__image">
        <img src={result.image_url.raw} alt="" />
      </div>
      {/* Use the 'snippet' property of fields with dangerouslySetInnerHtml to render snippets */}
      <div
        className="sui-result__details"
        dangerouslySetInnerHTML={{ __html: result.description.snippet }}
      ></div>
    </div>
  </li>
);

<Results resultView={CustomResultView} />;
```

The following properties are available in the view:

| Name           | Description                                                                                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className      | Passed through from main component.                                                                                                                         |
| result         | Type: `SearchResult`. An object representing the search result to render.                                                                                   |
| onClickLink    | function() - Call this when a link is clicked to trigger click tracking. Only triggered if `shouldTrackClickThrough` was set to true on the main component. |
| titleField     | Passed through from main component. Not usually needed for custom views.                                                                                    |
| urlField       | Passed through from main component. Not usually needed for custom views.                                                                                    |
| thumbnailField | Passed through from main component. Not usually needed for custom views.                                                                                    |

See [Result.tsx](https://github.com/elastic/search-ui/blob/main/packages/react-search-ui-views/src/Result.tsx) for an example.
