<p align="center"><a href="https://circleci.com/gh/elastic/search-ui/tree/master"><img src="https://circleci.com/gh/elastic/search-ui/tree/master.svg?style=svg&circle-token=c637bc2af60035a1f4cb5367071999ced238be76" alt="CircleCI buidl"></a>
<img src="https://img.shields.io/badge/version-beta-red.svg" alt="BETA" /></p>

> A library for the fast development of modern, engaging search experiences. :tada:

## Contents

- [About Search UI](#about-search-ui-rocket)
- [Getting started](#getting-started-)
- [Configuration](#configuration)
- [Customization](#customization)
- [FAQ](#faq-)
- [Contribute](#contribute-)
- [License](#license-)

---

## About Search UI :rocket:

Search UI allows you to quickly implement search experiences without re-inventing the wheel.

It supports **[React](https://reactjs.org)** and **works with any search API**.

### Features :+1:

- **You know, for search**: Maintained by [Elastic](https://elastic.co), the team behind Elasticsearch.
- **Speedy Implementation** - Build search with a search box, results view, sorting, and more, with a few lines of code.
- **Highly customizable** - Customize Components, markup, styles, and behavior.
- **URL query string synchronization** - Searches, filtering, and more, are captured in the URL for direct result linking.
- **Headless core** - Leverage our application logic, provide your own Components or views.
- **Not just for React** - Can be used used with any JavaScript library, even vanilla JavaScript.

<img src="packages/react-search-ui/resources/screenshot.png" width="600">

## Getting started 🐣

**Looking for a great search API?** [Elastic App Search](https://www.elastic.co/cloud/app-search-service) has a slick dashboard, powerful features, and leading relevance.

Install the **React Search UI** and the **App Search** connector.

```sh
# Install React Search UI
npm install --save @elastic/react-search-ui

# Install a Connector, like the Elastic's App Search Connector
# You can use a custom connector to use any search API.
npm install --save  @elastic/search-ui-app-search-connector
```

_Note: The Search UI is in beta. We do not recommend production use._

## Creating a Search UI

<a id="search-ui"></a>

Use out of the box components, styles, and layouts to build a search experience quickly.

```jsx
import React from "react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import { SearchProvider, Results, SearchBox } from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";

import "@elastic/react-search-ui-views/lib/styles/styles.css";

const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  hostIdentifier: "host-2376rb"
});

export default function App() {
  return (
    <SearchProvider
      config={{
        apiConnector: connector
      }}
    >
      {() => (
        <div className="App">
          <Layout
            header={<SearchBox />}
            bodyContent={<Results titleField="title" urlField="nps_link" />}
          />
        </div>
      )}
    </SearchProvider>
  );
}
```

A search UI is made up of four key areas, which you can expand and customize:

1. [Connectors](#1-connectors)
2. [SearchProvider](#2-searchprovider)
3. [Components](#3-components)
4. [Styles and Layout](#4-styles-and-layout)

---

### 1. Connectors

Connectors are modules that tell Search UI how to connect and communicate with a particular API.

Search UI currently provides two Connectors:

1. **Elastic App Search**: [search-ui-app-search-connector](packages/search-ui-app-search-connector)
2. **Elastic Site Search**: [search-ui-site-search-connector](packages/search-ui-site-search-connector)

The [example search UI](#search-ui) above uses the Elastic App Search Connector:

```js
const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  hostIdentifier: "host-2376rb"
});
```

Search UI can connect to **any** web based Search API. Read [the wiki](#buildaconnector) for more information.

### 2. SearchProvider

The `SearchProvider` object will tie all of your Components together so that they
work as a cohesive application. As users take actions using your Components,
like submitting a search box or applying a filter, `SearchProvider` will then
trigger API calls via the Connector you've configured to fetch Search Results.

The flow is like this:

```
Components -> SearchProvider -> Connector -> Search API (App Search)
```

`SearchProvider` is lightweight:

```jsx
<SearchProvider
  config={{
    apiConnector: connector
  }}
>
  {() => <div className="App">{/* Place Components here! */}</div>}
</SearchProvider>
```

### 3. Components

Components are the building blocks from which craft your search experience.

Each Component - like `SearchBox` and `Results` - is a child of the `SearchProvider` object:

```jsx
<SearchProvider
  config={{
    apiConnector: connector
  }}
>
  {() => (
    <div className="App">
      <Layout
        header={<SearchBox />}
        bodyContent={<Results titleField="title" urlField="nps_link" />}
      />
    </div>
  )}
</SearchProvider>
```

The following Components are available:

- [SearchBox](#searchbox)
- [Results](#results)
- [ResultsPerPage](#resultsperpage)
- [Facet](#facet)
- [Sorting](#sorting)
- [Paging](#paging)
- [PagingInfo](#paginginfo)
- [ErrorBoundary](#errorboundary)

---

#### SearchBox

Input element which accepts search terms and triggers a new search.

##### Example

```jsx

import { SearchBox } from "@elastic/react-search-ui";

...

<SearchBox inputProps={{ placeholder: "custom placeholder" }}/>
```

##### Properties

| Name            | type      | Required? | Default                                                | Options | Description                                                                                                                                                                  |
| --------------- | --------- | --------- | ------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| inputProps      | Object    | no        |                                                        |         | Props for underlying 'input' element. I.e., `{ placeholder: "Enter Text"}`                                                                                                   |
| searchAsYouType | Boolean   | no        | false                                                  |         | Executes a new search query with every key stroke. You can fine tune the number of queries made by adjusting the `debounceLength` parameter.                                 |
| debounceLength  | Number    | no        | 200                                                    |         | When using `searchAsYouType`, it can be useful to "debounce" search requests to avoid creating an excessive number of requests. This controls the length to debounce / wait. |
| view            | Component | no        | [SearchBox](../react-search-ui-views/src/SearchBox.js) |         | Used to override the default view for this Component. See the [Customization: Component views and HTML](#component-views-and-html) section for more information.    

---

#### Results

Displays all search results.

You can also iterate over the results yourself and render each result.

##### Example

```jsx

import { Results } from "@elastic/react-search-ui";

...

<Results titleField="title" urlField="nps_link" />
```

##### Properties

| Name         | type      | Required? | Default                                            | Options | Description                                                                                                                                         |
| ------------ | --------- | --------- | -------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| renderResult | Component | no        | [Result](../react-search-ui-views/src/Result.js)   |         | Used to override individual Result views. See the Customizing Component views and html section for more information.                                |
| titleField   | String    | no        |                                                    |         | Name of field to use as the title from each result.                                                                                                 |
| urlField     | String    | no        |                                                    |         | Name of field to use as the href from each result.                                                                                                  |
| view         | Component | no        | [Results](../react-search-ui-views/src/Results.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information.|

---

#### ResultsPerPage

Shows a dropdown for selecting the number of results to show per page.

Uses 20, 40, 60 as options.

##### Example

```jsx

import { ResultsPerPage } from "@elastic/react-search-ui";

...

<ResultsPerPage />
```

##### Properties

| Name | type      | Required? | Default                                                          | Options | Description                                                                                                                                         |
| ---- | --------- | --------- | ---------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| view | Component | no        | [ResultsPerPage](../react-search-ui-views/src/ResultsPerPage.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

                      |

---

#### Facet

Show a Facet filter for a particular field.

Must configure the corresponding field in the `SearchProvider` [facets](#config) object.

##### Example

```jsx
import { Facet } from "@elastic/react-search-ui";
import { MultiCheckboxFacet } from "@elastic/react-search-ui-views";

...

<SearchProvider config={{
  ...otherConfig,
  facets: {
    states: { type: "value", size: 30 }
  }
}}>
  {() => (
    <Facet field="states" label="States" view={MultiCheckboxFacet} />
  )}
</SearchProvider>
```

##### Properties

| Name  | type      | Required? | Default                                                                  | Options                                                                                                                                           | Description                                                                                                                                         |
| ----- | --------- | --------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| field | String    | yes       |                                                                          |                                                                                                                                                   | Field name corresponding to this filter. This requires that the corresponding field has been configured in `facets` on the top level Provider.      |
| label | String    | yes       |                                                                          |                                                                                                                                                   | A static label to show in the facet filter.                                                                                                         |
| show  | Number    | no        | 10                                                                       |                                                                                                                                                   | The number of facet filter options to show before concatenating with a "more" link.                                                                 |
| view  | Component | no        | [MultiCheckboxFacet](../react-search-ui-views/src/MultiCheckboxFacet.js) | [SingleLinksFacet](../react-search-ui-views/src/SingleLinksFacet.js) <br/> [SingleSelectFacet](../react-search-ui-views/src/SingleSelectFacet.js) | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

---

#### Sorting

Shows a dropdown for selecting the current Sort.

##### Example

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

##### Properties

| Name | type                                           | Required? | Default                                            | Options | Description                                                                                                                                         |
| ---- | ---------------------------------------------- | --------- | -------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| view | Array[[SortOption](./src/types/SortOption.js)] | yes       |                                                    |         |                                                                                                                                                     |
| view | Component                                      | no        | [Sorting](../react-search-ui-views/src/Sorting.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

---

#### Paging

Navigate through pagination.

##### Example

```jsx

import { Paging } from "@elastic/react-search-ui";

...

<Paging />
```

##### Properties

| Name | type      | Required? | Default                                          | Options | Description                                                                                                                                         |
| ---- | --------- | --------- | ------------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| view | Component | no        | [Paging](../react-search-ui-views/src/Paging.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

---

#### PagingInfo

Paging details, like "1 - 20 of 100 results".

##### Example

```jsx

import { PagingInfo } from "@elastic/react-search-ui";

...

<PagingInfo />
```

##### Properties

| Name | type      | Required? | Default                                                  | Options | Description                                                                                                                                         |
| ---- | --------- | --------- | -------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| view | Component | no        | [PagingInfo](../react-search-ui-views/src/PagingInfo.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

---

#### ErrorBoundary

Handle unexpected errors.

##### Example

```jsx
import { ErrorBoundary } from "@elastic/react-search-ui";

...

<ErrorBoundary>
  <div>Some Content</div>
</ErrorBoundary>
```

##### Properties

| Name     | type       | Required? | Default                                                        | Options | Description                                                                                                                                         |
| -------- | ---------- | --------- | -------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| children | React node | yes       |                                                                |         | Content to show if no error has occurred, will be replaced with error messaging if there was an error.                                              |
| view     | Component  | no        | [ErrorBoundary](../react-search-ui-views/src/ErrorBoundary.js) |         | Used to override the default view for this Component. See [Customization: Component views and HTML](#component-views-and-html) for more information. |

---

### 4. Styles and Layout

For basic styles, include:

```jsx
import "@elastic/react-search-ui-views/lib/styles/styles.css";
```

For a basic layout, which helps quickly get a UI bootstrapped,
use the [Layout](../react-search-ui-views/src/layouts/Layout.js) Component.

```jsx
import { Layout } from "@elastic/react-search-ui-views";

<Layout header={<SearchBox />} bodyContent={<Results />} />;
```

The provided styles and layout can be found in the [react-search-ui-views](../react-search-ui-views) package.

For more information on customizing styles, see the [Customization: Custom Styles and Layout](#custom-styles-and-layout).

## Configuration

All configuration for Search UI is provided in a single configuration object.

```jsx
const configurationOptions = {
  apiConnector: connector,
  disjunctiveFacets: ["acres"],
  disjunctiveFacetsAnalyticsTags: ["Ignore"],
  search_fields: {
    title: {},
    description: {}
  },
  result_fields: {
    title: {
      snippet: {
        size: 100,
        fallback: true
      }
    },
    nps_link: {
      raw: {}
    },
    description: {
      snippet: {
        size: 100,
        fallback: true
      }
    }
  },
  facets: {
    states: { type: "value", size: 30 },
    acres: {
      type: "range",
      ranges: [
        { from: -1, name: "Any" },
        { from: 0, to: 1000, name: "Small" },
        { from: 1001, to: 100000, name: "Medium" },
        { from: 100001, name: "Large" }
      ]
    }
  }
};

return (
  <SearchProvider config={configurationOptions}>
    {() => (
      <div className="App">
        <Layout
          header={<SearchBox />}
          bodyContent={<Results titleField="title" urlField="nps_link" />}
        />
      </div>
    )}
  </SearchProvider>
);
```

There are 3 types of configuration:

- [Application Config](#application-config)
- [Query Config](#query-config)
- [API Config](#)

### Application Config

| option          | type         | required? | source                                                                                                                                                                                                                    |
| --------------- | ------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiConnector`  | APIConnector | required  | Instance of a [Connector](#connectors). For instance, [search-ui-app-search-connector](../search-ui-app-search-connector).                                                                                               |
| `initialState`  | Object       | optional  | Set initial [State](#state) of the search. Any [Request State](#requeststate) can be set here. This is useful for defaulting a search term, sort, etc.<br/><br/>Example:<br/>`{ searchTerm: "test", resultsPerPage: 40 }` |
| `trackURLState` | boolean      | optional  | By default, [Request State](#requeststate) will be synced with the browser url. To turn this off, pass `false`.                                                                                                           |

### Query Config

Query configuration for Search UI largely follows the same API as the
[App Search Search API](https://swiftype.com/documentation/app-search/api/search)

For example, if you add a `search_fields` configuration option, it will control which
fields are actually returned from the API.

| option                           | type                     | required? | source                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------------- | ------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `facets`                         | Object                   | optional  | [App Search Facets API Reference](https://swiftype.com/documentation/app-search/api/search/facets). Tells Search UI to fetch facet data that can be used to build [Facet](#componentfacet) Components. <br /><br />Example, using `states` field for faceting:<br/>`facets: {states: { type: "value", size: 30 }`                                                                                                              |
| `disjunctiveFacets`              | Array[String]            | optional  | An array of field names. Every field listed here must have been configured in the `facets` field first. It denotes that a facet should be considered disjunctive. When returning counts for disjunctive facets, the counts will be returned as if no filter is applied on this field, even if one is applied. <br /><br />Example, specifying `states` field as disjunctive:<br/>`disjunctiveFacets: ['states']`               |
| `disjunctiveFacetsAnalyticsTags` | Array[String]            | optional  | Used in conjunction with the `disjunctiveFacets` parameter. Adding `disjunctiveFacets` can cause additional API requests to be made to your API, which can create deceiving analytics. These queries will be tagged with "Facet-Only" by default. This field lets you specify a different tag for these. <br /><br />Example, use `junk` as a tag on all disjunctive API calls:<br/>`disjunctiveFacetsAnalyticsTags: ['junk']` |
| `conditionalFacets`              | Object[String, function] | optional  | This facet will only be fetched if the condition specified returns `true`, based on the currently applied filters. This is useful for creating hierarchical facets.<br/><br/>Example: don't return `states` facet data unless `parks` is a selected filter.<br/> `{ states: filters => isParkSelected(filters) }`                                                                                                              |
| `search_fields`                  | Object[String, Object]   | optional  | Fields which should be searched with search term.<br/><br/>[App Search search_fields API Reference](https://swiftype.com/documentation/app-search/api/search/search-fields)                                                                                                                                                                                                                                                    |
| `result_fields`                  | Object[String, Object]   | optional  | Fields which should be returned in results.<br/><br/>[App Search result_fields API Reference](https://swiftype.com/documentation/app-search/api/search/result-fields)                                                                                                                                                                 
### API Config

Search UI makes all of the search API calls for your application.

You can control what these API calls look like to some degree with options like `search_fields`, `result_fields`, and `facets`.

But there may be cases where certain API operations are not supported by Search UI.

For example, [App Search](https://www.elastic.co/cloud/app-search-service) supports a "grouping" feature, which Search UI does not support out of the box.

We can work around that by using the `additionalOptions` hook on the particular Connector.

```js
const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  hostIdentifier: "host-2376rb",
  additionalOptions: existingSearchOptions => {
    const additionalSearchOptions = {
      group: { field: "title" }
    };
    return additionalSearchOptions;
  }
});
```

## Customization

* [Custom Styles and Layout](#custom-styles-and-layout)
* [Component Views and HTML](#component-views-and-html)
* [Component Behaviour](#component-behaviour--mapcontexttoprops-and-mapviewprops)

### Custom Styles and Layout

Styling is up to you.

You can choose use the out of the box styles, or customize them.

To provide custom styles:

1. Write your own styles that target the class names in the individual Components. Do **NOT** include `styles.css`.
2. Override the default styles. Include `styles.css`, and then overwrite with your own styles.

For layout, provide your own layout instead of using the `Layout` Component.

For views and HTML, see the next section.

### Component Views and HTML

All Components in this library can be customized by providing a `view` prop.

Each Component's `view` will have a custom signature.

This follows the [React Render Props](https://reactjs.org/docs/render-props.html) pattern.

The clearest way to determine a Component's `view` function signature is to
look at the corresponding view Component's source code in
[react-search-ui-views](../react-search-ui-views). Each Component in that
library implements a `view` function for a Component in the React library, so it
serves as a great reference.

For example, if we were to customize the `PagingInfo` Component...

We'd look up the default view from the [Components](#componentpaginginfo) section for the
`PagingInfo` Component.

The corresponding view is
[PagingInfo](../react-search-ui-views/src/PagingInfo.js). (See how the naming matches up?).

After viewing that Component's source, you'll see it accepts 4 props:

1. `end`
2. `searchTerm`
3. `start`
4. `totalResults`

In our case, we care about the `start` and `end` values.

We provide a view function that uses those two props:

```jsx
<PagingInfo
  view={({ start, end }) => (
    <div className="paging-info">
      <strong>
        {start} - {end}
      </strong>
    </div>
  )}
/>
```

We could also accomplish this with a functional Component:

```jsx
const PagingInfoView = ({ start, end }) => (
  <div className="paging-info">
    <strong>
      {start} - {end}
    </strong>
  </div>
);

return <PagingInfo view={PagingInfoView} />;
```

### Component behavior - mapContextToProps and mapViewProps

All [Components](#components) support two hooks for customizing their behavior.

1. `mapContextToProps` - Override the [Context](#context) before it is passed to your Component as
  props.
2. `mapViewProps` - Lets you overrides view props before they are passed to the view.

These allow you to override, modify, or even add completely new props.

* These follow the same patterns as `mapStateToProps` in [Redux](https://redux.js.org/).
* These **MUST** be immutable functions, if you directly update the props or context, you will have major issues in your application.

To visualize these hooks:

```
Search UI
  |
  | { searchTerm, setSearchTerm } <- This is the "Context"
  v
  // Updates the searchTerm before passing it to the SearchBox Component
  mapContextToProps( context => { ...context, searchTerm: "new search terms" } )
  |
  |
  v
SearchBox
  |
  | { isFocused, inputProps, onChange, onSubmit, value } <- View props
  v
  // Modify the onChange handler so that it logs events.
  mapViewProps( props => { ...props, onChange: e => { console.log(e); onChange(e) } })
  |
  |
  v
view (SearchBox or custom view)
```

A practical example might be putting a custom sort on your facet data.

This example orders a list of states by name:

```jsx
<Facet
  mapContextToProps={context => {
    if (!context.facets.states) return context;
    return {
      ...context,
      facets: {
        ...(context.facets || {}),
        states: context.facets.states.map(s => ({
          ...s,
          data: s.data.sort((a, b) => {
            if (a.value > b.value) return 1;
            if (a.value < b.value) return -1;
            return 0;
          })
        }))
      }
    };
  }}
  field="states"
  label="States"
  show={10}
/>
```

## FAQ 🔮

### Is Search UI only for React?

Nope. Search UI is "headless".

You can write support for it into any JavaScript framework. You can even use vanilla JavaScript.

[Read the wiki](https://github.com/elastic/search-ui/wiki/Headless-Core) for more information.

### Can I build my own Components?

Yes! Absolutely.

[Check out the wiki](https://github.com/elastic/search-ui/wiki/Build-Your-Own-Component).

### Does Search UI only work with App Search?

Nope! We do have two first party connectors: Site Search and App Search.

But Search UI is headless. You can use _any_ search API.

[See the wiki](https://github.com/elastic/search-ui/wiki/Build-Your-Own-Connector) to learn how to build your own Connectors.

### Where do I report issues with the Search UI?

If something is not working as expected, please open an [issue](https://github.com/elastic/search-ui/issues/new).

### Where can I go to get help?

If you are using an Elastic product as your connector, try the Elastic community...

- [Elastic App Search discuss forums](https://discuss.elastic.co/c/app-search)
- [Elastic Site search discuss forums](https://discuss.elastic.co/c/site-search)

## Contribute 🚀

We welcome contributors to the project. Before you begin, a couple notes...

- Read the [Search UI Contributor's Guide](https://github.com/elastic/search-ui/wiki/Search-UI-Contributor's-Guide).
- Prior to opening a pull request, please create an issue to [discuss the scope of your proposal](https://github.com/elastic/search-ui/issues).
- Please write simple code and concise documentation, when appropriate.

## License 📗

[Apache-2.0](https://github.com/elastic/search-ui/blob/master/LICENSE) © [Elastic](https://github.com/elastic)

Thank you to all the [contributors](https://github.com/elastic/search-ui/graphs/contributors)!
