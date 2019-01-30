# React Search UI testing tutorial

This tutorial guides you through a scenario where you're building a
SERP (Search Engine Results Page) using search-ui.

Because this is meant to solicit feedback and test the usability of the library,
it doesn't tell you explicitly _how_ to do things, it just tells you what
you need to do. Solutions are linked at the bottom.

This tutorial uses a pre-existing Engine, which contains Swiftype's default
data set of National Parks.

## Create a new React App

Create a new React application with `create-react-app`.

```
npm install -g create-react-app
create-react-app search-ui-tutorial --use-npm
cd search-ui-tutorial
npm start
```

That should open up a new window with a bare bones
React App running at http://localhost:3000/ .

## Install Search UI

Now you'll need to install `search-ui`. Visit
[react-search-ui](./README.md),
and follow the instructions for installing. We'll be building this
app with App Search.

<a id="question1"></a>
[Solution 1](#solution1)

Great, now you can start using the library.

## Build a simple UI

In `src/App.js`:

Clear the file out and replace it with this:

```jsx
import React, { Component } from "react";

class App extends Component {
  render() {
    return <div className="App" />;
  }
}

export default App;
```

Now update this interface to contains a Search Box, and a Results section,
connected to the following App Search account:

```js
searchKey: "search-soaewu2ye6uc45dr8mcd54v8",
engineName: "national-parks-demo",
hostIdentifier: "host-2376rb"
```

<a id="question3"></a>
[Solution](#solution3)

Check out your app in the browser. You should see a search box. Search for
something. You should see results appear below.

Note that in addition to the UI, you also have URL state being tracked. Try
performing a search, then refreshing the page. You get full url state management
for free. This, however, IS optional. Not everyone will want to use that. There
is a flag (`trackURLState`) to turn it off in the SearchProvider
[configuration](./README.md#config).

## Styles and Markup

As you may have noticed, this doesn't look great.

Search UI provides some styles and layout to help build a simple SERP. Many
people will want to provide all of their own CSS and layout, so this is an
optional step.

Go ahead and add our provided styles and layout.

<a id="question4"></a>
[Solution](#solution4)

At this point, we can start adding some more behavior and customization.

1. Our results currently say "undefined" in their title. Change it to use the
   `title` field for each result.
2. Change the title's link for each result to use the `nps_link` field for each
   result.
3. Add paging info above the results.
4. Add results per page above the results.
5. Add paging navigation below the results.

<a id="question5"></a>
[Solution](#solution5)

## Facets

Add 2 facet filters to the page. They should go in the Layout's sidebar.

1. A facet filter for `states`. It should be a value facet.
2. A facet filter for `acres`. It should be a range facet with the following
   ranges:

   ```js
   ranges: [
     { from: -1, name: "Any" },
     { from: 0, to: 1000, name: "Small" },
     { from: 1001, to: 100000, name: "Medium" },
     { from: 100001, name: "Large" }
   ];
   ```

<a id="question6"></a>
[Solution](#solution6)

OK, so, you have facets. Use them. What do you think? Personally, I don't think
that range facet is quite right. There's no way to "unselect" an option after
making a selection. Additionally, most dropdowns work in a "disjunctive" way,
where making a selection won't change the options in that dropdown, the options
need to remain available so that the selection can be easily changed.

This is because that facet needs to be declared as
disjunctive. See `disjunctiveFacets` configuration option in the [README](./README.md#config). Add a new property in the `SearchProvider` `config` prop, called `disjunctiveFacets`, and give it a value
of `["acres"]`, to specify that we want to treat the `acres` facet as
a disjunctive.

```jsx
<SearchProvider
    config={{
      ...
      disjunctiveFacets: ["acres"]
      ,,,
```

## View customization

OK, so, one more thing. Functionality is great, but let's change the view
component for the `states` facet. ALL components in `react-search-ui` will
support a `view` prop, which lets you customize the view. We're just going to
swap in another view component that provides slightly different markup.

Change the `states` facet filter to use the `SingleValueLinksFacet` view.

<a id="question7"></a>
[Solution](#solution7)

You should now see a Facet filter that uses links and a "remove" link, rather
than checkboxes. This is one of the big advantages of separating the view
from behavior in React. Not only can we provide multiple views for the same
component, but it allows consumers to define their own views as well.

Try customizing the view of `PagingInfo` so that it only shows the start and
end (ex. "0 - 20").

<a id="question8"></a>
[Solution](#solution8)

# Creating new components

There's some components we don't offer. However, creating new components is
fairly simple. See if you can figure out how to create a new component, called
"ClearFilters", which should clear all current filters.

<a id="question9"></a>
[Solution](#solution9)

## Customizing API calls

Some configuration we're normalizing in the Provider configuration. For example,
the `facets` configuration you provide to the Provider is _normalized_ by
the Connector, so that the same `facet` configuration provided to Provider
will work, regardless of the Connector you're using.

Other configuration, however, is not supported. For instance, from App Search:

- Analytics tags
- Grouping

See if you can figure out how to send analytics tags on your App Search call,
even thought it's not supported in the Provider configuration.

<a id="question10"></a>
[Solution](#solution10)

## Changing Connectors

For the last exercise in this tutorial, swap out the back-end to be SiteSearch.
Here's some credentials for you to use:

```js
engineKey: "Z43R5U3HiDsDgpKawZkA",
documentType: "national-parks",
```

<a id="question11"></a>
[Solution](#solution11)

That's it, happy searching!

## Solutions

### Solution <a id="solution1"></a>

```shell
npm install --save @elastic/react-search-ui @elastic/search-ui-app-search-connector
```

[Back](#question1)

### Solution <a id="solution3"></a>

To create a Search UI connected to your App Search Engine, you'll need to create
a [Connector](./README.md#connectors) and a
[Provider](./README.md#searchprovider).

See the [README](./README.md#components) for a list of available components. Use `SearchBox` and `Results`. As long as they are placed anywhere within the bounds
of your `SearchProvider`, they will work.

```jsx
import React from "react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import { SearchProvider, SearchBox, Results } from "@elastic/react-search-ui";

const connector = new AppSearchAPIConnector({
  searchKey: "search-soaewu2ye6uc45dr8mcd54v8",
  engineName: "national-parks-demo",
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
          <SearchBox />
          <Results />
        </div>
      )}
    </SearchProvider>
  );
}
```

[Back](#question3)

### Solution <a id="solution4"></a>

All of this is provided by `@elastic/react-search-ui-views`.

Add the following:

```jsx
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

...

<Layout header={<SearchBox />} bodyContent={<Results />} />
```

[Back](#question4)

### Solution <a id="solution5"></a>

```jsx
import {
  ...
  PagingInfo,
  ResultsPerPage,
  Paging
} from "@elastic/react-search-ui";

...

<Layout
  header={<SearchBox />}
  bodyContent={<Results titleField="title" urlField="nps_link" />}
  bodyHeader={
    <React.Fragment>
      <PagingInfo />
      <ResultsPerPage />
    </React.Fragment>
  }
  bodyFooter={<Paging />}
/>
```

The `Results` component accepts a `titleField` and `urlField` property
which lets you control which fields are used for the title and link.

In order to get know what field names are available to check here, you'll
need to be familiar with your Schema. For App Search, simply check out the
fields available in the Schema view in the Dashboard.

Note that using the `Results` component is really just a convenience. We could
choose to iterate over results ourselves and show results any way we choose, OR,
use the `Results` component and just override the view with our own markup.

`PagingInfo`, `ResultsPerPage`, and `Paging` can be added to your layout.
The `Layout` component happens to have a `bodyHeader` and
`bodyFooter` properties for placing content above and below results.

[Back](#question5)

### Solution <a id="solution6"></a>

To figure this one out, you'd need to look at the
[components](./README.md#components) section in the README.

To add a facet, we won't just drop a new `Facet` Component on the page.
We'll first need to configure the Provider so it fetches the data we need
for our component.

Adding facet config is just like configuring facets for the App Search API, but
we support a couple of additional
[options](https://github.com/elastic/search-ui/tree/master/packages/search-ui#facet-configuration-).

```jsx
<SearchProvider
  config={{
    apiConnector: connector,
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
  }}
>
```

Adding that config just makes the data available. We'll actually need
to add Components on the page in order to take advantage of those facets.

```jsx
import {
  ...
  Facet
} from "@elastic/react-search-ui";
import {
  ...
  MultiValueFacet,
  SingleRangeSelectFacet
} from "@elastic/react-search-ui-views";

...

<Layout
  sideContent={
    <div>
      <Facet field="states" label="States" view={MultiValueFacet} />
      <Facet
        field="acres"
        label="Acres"
        view={SingleRangeSelectFacet}
      />
    </div>
  }
  ...
</Body>
```

FYI, Facet components are one area that still need work. The way we name them,
the way we consume them, etc. Additionally, all facets now are considered "AND"
filters. I'm thinking we should add a configuration at the component level to
configure whether making a selection makes an OR selection or an AND filter.

[Back](#question6)

### Solution <a id="solution7"></a>

```jsx
import {
  ...
  SingleValueLinksFacet
} from "@elastic/react-search-ui-views";

...

<Facet
  field="states"
  label="States"
  show={10}
  view={SingleValueLinksFacet}
/>
```

[Back](#question7)

### Solution <a id="solution8"></a>

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

The details for how this work can be found in the
[Customizing component views and html](./README.md#customizeviews) section of the README.

[Back](#question8)

### Solution <a id="solution9"></a>

Let's add a new component called "ClearFilters".

Under src create `ClearFilters.js`.

```jsx
import React from "react";
import { withSearch } from "@elastic/react-search-ui";

function ClearFilters({ filters, clearFilters }) {
  return (
    <div>
      <button onClick={() => clearFilters()}>
        Clear {filters.length} Filters
      </button>
    </div>
  );
}

export default withSearch(ClearFilters);
```

Then in App.js add:

```jsx
import ClearFilters from "./ClearFilters";

...

<Body>
  sideContent={
    <div>
      <ClearFilters />
      ...
```

The details for how this work can be found in the
[Creating your own components](./README.md#customcomponents)
section of the README.

[Back](#question9)

### Solution <a id="solution10"></a>

We'll use `additionalOptions` for this.

The details for how this work can be found in the
[Customizing API calls - additionalOptions](./README.md#apicalls)
section of the README.

So on your connector object, you could use the following for App Search:

```js
const connector = new AppSearchAPIConnector({
  ...
  additionalOptions: () => ({
    group: {
      field: "title"
    }
  })
});
```

[Back](#question10)

### Solution <a id="solution11"></a>

```shell
npm install --save @elastic/search-ui-site-search-connector
```

```js
import SiteSearchAPIConnector from "@elastic/search-ui-site-search-connector";
```

```js
const connector = new SiteSearchAPIConnector({
  engineKey: "Z43R5U3HiDsDgpKawZkA",
  documentType: "national-parks",
  additionalOptions: () => ({})
});
```

Most behavior should have worked. Some, however, is not supported
by Site Search. In this case, you should see a warning message
in your browser console.

For example, range facets are not supported by Site Search's API, so you
will see a message about that in the console, and that facet filter simply will
not appear in your UI.

The details for how this work can be found in the
[Connectors](./README.md#connectors)
section of the README.

[Back](#question11)
