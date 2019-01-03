# React Search UI testing tutorial

This tutorial guides you through a scenario where you're building a
SERP (Search Enbgine Results Page) using search-ui.

Because this is meant to solicit feedback and test the usability of the library,
it doesn't tell you explicitly _how_ to do things, it just tells you what
you need to do. Answers are linked at the bottom.

This tutorial uses a pre-existing engine, which contains Swiftype's default
data set of National Parks.

## Create a new React App

Create a new React application with `create-react-app`.

```
npm install -g create-react-app
create-react-app search-ui-tutorial
cd search-ui-tutorial
yarn start
```

That should open up a new window with http://localhost:3000/ bare bones
React App running.

Now you'll need to install `search-ui`. Visit
https://github.com/elastic/search-ui/packages/react-search-ui,
and follow the instructions for installing. We'll be building this
app with React and App Search.

<a id="question1"></a>
[Solution 1](#solution1)

Great, now you can start using the library.

In `src/App.js`:

Clear out the existing markup. Leave only:

```html
<div className="App"></div>
```

Wrap that div with a new `SearchProvider`, connected to the following App Search
account:

```js
searchKey: "search-soaewu2ye6uc45dr8mcd54v8",
engineName: "national-parks-demo",
hostIdentifier: "host-2376rb"
```

<a id="question2"></a>
[Solution 2](#solution2)

At this point, you have the bare minimum configured to get working. You can
start dropping in Components from `react-search-ui`. As long as these Components
are nested somewhere inside of `SearchProvider`, they will be connected to the
search experience.

To start off, just put a search box and results section on the page.

<a id="question3"></a>
[Solution 3](#solution3)

Now go to your browser. You should see a search box. Search for something. You
should see results appear below.

Note that in addition to the UI, you also have URL state being tracked. Try
performing a search, then refreshing the page. You get full url state management
for free. This, however, IS optional. Not everyone will want to use that. There
is a flag (`trackURLState`) to turn it off in the SearchProvider
[configuration](../search-ui/README.md#driverconfig).

## Styles and Markup

Another thing you may have noticed is that this doesn't look great.

Search UI provides both a default set of styles and a component for laying out
a simple SERP. Many people will want to provide all of their own CSS and layout,
so this is an optional step.

Now go ahead and put what you have into our out of the box layout and
use our out of the box stylesheet.

<a id="question4"></a>
[Solution 4](#solution4)

At this point, we can start adding some more behavior and customization.

`Results` has some additional parameters we can configure. Configure `Results`
so that it uses the `title` field for each result title, and `nps_link` for the
corresponding href.

Additionally, in Layout's `bodyHeader`, we should add paging info, and a results
per page selector. HINT: This will take two different components, you'll need to
and you'll need to wrap them in `React.Fragment`.

In Layout's `bodyFooter`, adding paging.

<a id="question5"></a>
[Solution 5](#solution5)

## Facets

Add 2 facet filters to the page.

1. A facet filter for `states`. It should be a value facet with a max size of
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
[Solution 6](#solution6)

OK, so, you have facets. Use them. What do you think? Personally, I don't think
that range facet is quite right. Play around with it, you'll see what I mean...

This is because that facet needs to be
[disjunctive](../search-ui/README.md#driverconfig). Add a new property in the
`SearchProvider` `config` prop, called `disjunctiveFacets`, and give it a value
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
[Solution 7](#solution7)

You should now see a Facet filter that uses links and a "remove" link, rather
than checkboxes. This is one of the big advantages of separating the view
from behavior in React. Not only can we provide multiple views for the same
component, but it allows consumers to define their own views.

Try customizing the view of `PagingInfo` so that it only shows the start and
end (ex. "0 - 20").

<a id="question8"></a>
[Solution 8](#solution8)

## Manipulating data in a component

You may wish to manipulate data from a component before rendering it. You
_could_ do this with the method we showed previously, but you could also do this
with `mapContextToProps`. In this case, you're happy with the view, you just
need to make some adjustments to the data before the component is rendered.

An example would be changing the order of facet values programmatically.

Like if we wanted to order states alphabetically:

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
  view={SingleValueLinksFacet}
/>
```

The states facet data should now be ordered alphabetically.

This looks really ugly. That's because in our core state, we're relying on the
App Search API response, which is highly nested. In the future, we plan to
normalize our state representation so this looks nicer.

Additionally, we need to make sure in our `mapContextToProps` function that
we're not mutating the underlying state. That's not going to change but it is
another reason that looks a bit ugly.

This is basically a hook to manipulate data before it is processed by
the Components.

Other hooks we could provide, but don't yet have:

- A hook to manipulate server data before it is stored in core state, so that
  this data could be ordered not just for this component, but for the entire
  app.
- A hook in each component that let's you manipulate properties before they are
  passed to the view component.

# Creating new components

There's some components we don't offer. However, creating new components is
fairly simple. See if you can figure out how to create a new component, called
"ClearFilters", which should clear all current filters.

HINT: This is covered in the READMEs.

<a id="question9"></a>
[Solution 9](#solution9)

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
[Solution 10](#solution10)

## Changing Connectors

For the last exercise in this tutorial, swap out the back-end to be SiteSearch.
Here's some credentials for you to use:

```js
engineKey: "Z43R5U3HiDsDgpKawZkA",
documentType: "national-parks",
```

<a id="question11"></a>
[Solution 11](#solution11)

That's it, happy searching!

## Solutions

### Solution 1 <a id="solution1"></a>

```shell
yarn add @elastic/react-search-ui @elastic/search-ui-app-search-connector
```

[Back](#question1)

### Solution 2 <a id="solution2"></a>

Create a [Connector](./README.md#connectors) and initialize a
[Provider](./README.md#searchprovider) with some basic configuration for
`Search UI`.

```jsx
import React from "react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import { SearchProvider } from "@elastic/react-search-ui";

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
      {() => <div className="App">{/*We'll add our components here*/}</div>}
    </SearchProvider>
  );
}
```

[Back](#question2)

### Solution 3 <a id="solution3"></a>

See the [src/containers](./src/containers) for a list of available components.

```jsx
import { SearchProvider, SearchBox, Results } from "@elastic/react-search-ui";

...

<div className="App">
  <SearchBox />
  <Results />
</div>
```

[Back](#question3)

### Solution 4 <a id="solution4"></a>

All of this is provided by `@elastic/react-search-ui-views`.

Add the following:

```jsx
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

...

<Layout header={<SearchBox />} bodyContent={<Results />} />
```

[Back](#question4)

### Solution 5 <a id="solution5"></a>

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

Do you follow what we did?

`PagingInfo`, `ResultsPerPage`, and `Paging` are pretty standard SERP
components.

`titleField` just lets us specify which field we want to use as the title, and
ditto for `urlField`, but for the link in the `Results`.

Note that using the `Results` component is really just a convenience. We could
choose to iterate over results ourselves and show results any way we choose, OR,
use the `Results` component and just override the view with our own markup.

[Back](#question5)

### Solution 6 <a id="solution6"></a>

To add a facet, we won't just drop a new Component on the page. We'll first
need to configure the Provider so it fetches the data we need for our
new Component.

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

### Solution 7 <a id="solution7"></a>

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

### Solution 8 <a id="solution8"></a>

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

For each Component, a `view` prop will simply be a function that takes a fixed
set of parameters and returns some markup.

You can think of this just like swapping out a view template in Rails.

For instance, `PagingInfo` takes the following parameters:

- end
- searchTerm
- start
- totalResults

You could see this by looking at the default
[view component](../react-search-ui-views/src/PagingInfo.js).

NOTE: in React, your view prop could be expressed using a functional component
instead:

```jsx
const PagingInfoView = ({ start, end }) => (
  <div className="paging-info">
    <strong>
      {start} - {end}
    </strong>
  </div>
);

<PagingInfo view={PagingInfoView} />
/>
```

[Back](#question8)

### Solution 9 <a id="solution9"></a>

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

Using `withSearch` gives us access to all state properties and all actions. In
this example, we simply pulled out `filters` from state and an action
called `clearFilters`.

If you select a state, then click "ClearFilters", it should clear out all of
your current filters.

[Back](#question9)

### Solution 10 <a id="solution10"></a>

We'll use `additionalOptions` for this.

So on your connector object, you could use the following for app search...

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

### Solution 11 <a id="solution11"></a>

```shell
yarn add @elastic/search-ui-site-search-connector
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

[Back](#question11)
