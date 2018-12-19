# React Search UI tutorial

## Basics

Create a new React application with create-react-app

```
npm install -g create-react-app
create-react-app search-ui-tutorial
cd search-ui-tutorial
yarn start
```

That should open up a new window with http://localhost:3000/ running.

Now you'll need to install `search-ui`. Because it's not published to npm yet, the install will be a little weird:

```shell
# From the search-ui-tutorial directory
# Stop your running server
cd ..
git clone git@github.com:elastic/search-ui.git
cd search-ui
npm install
npx lerna bootstrap
cd ../search-ui-tutorial
rm -r node_modules
npm install # Switching from yarn to npm now
npm install ../search-ui/packages/search-ui-app-search-connector/
npm install ../search-ui/packages/search-ui/
npm install ../search-ui/packages/react-search-components/
npm install ../search-ui/packages/react-search-ui/
npm start
```

Once this is published this process would just be a 1 liner:

```shell
npm install @elastic/react-search-ui @elastic/search-ui-app-search-connector
```

Cool. Now back to your `search-ui-tutorial`, you can start using the library.

In `src/App.js`

Create a [Connector](https://github.com/elastic/search-ui#the-service-connectors-), create some basic configuration for `Search UI`, and initialize a [Provider](https://github.com/elastic/search-ui/tree/master/packages/react-search-ui#searchprovider).

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
      {_ => <div className="App">{/*We'll add our components here*/}</div>}
    </SearchProvider>
  );
}
```

At this point, you have the bare minimum configured to get working. You can start dropping in Components from `react-search-ui`. As long as these Components are nested somewhere inside of `SearchProvider`, they will be connected to the search experience.

(More on SearchProvider here: https://github.com/elastic/search-ui/tree/master/packages/react-search-ui#searchprovider, including available configuration)

I haven't documented all of the components yet, so you'll have to look here to see the list:
https://github.com/elastic/search-ui/tree/master/packages/react-search-ui/src/containers

To start off, just put a `SearchBox` and a `Results` container on the page.

```jsx
import { SearchProvider, SearchBox, Results } from "@elastic/react-search-ui";

...

<div className="App">
  <SearchBox />
  <Results />
</div>
```

Now go to your browser. You should see a search box. Search for something. You should see results appear below.

Whaaat?? You see that? How cool is that? Super easy right?

Note that in addition to the UI, you also have URL state being tracked. Try performing a search, then refreshing the page. Rad right? You get full url state management for free. This, however, IS optional. Not everyone will want to use that. There is a flag (`trackURLState`) to turn it off in the SearchProvider [configuration](https://github.com/elastic/search-ui/blob/master/packages/search-ui/README.md#driverconfig).

## Styles and Markup

Another thing you may have noticed is that this looks like shit. We'll provide the following for Search UI:

1. A stylesheet containing basic styles for all components and layout
2. A few layout components to help layout a basic search page. Basically, enough to implement the Reference UI.

Many people will want to provide all of their own CSS and layout, so this is an optional step.

All of this is provided by `@elastic/react-search-components`.

Add the following:

```jsx
import { Body, Header } from "@elastic/react-search-components";
import "@elastic/react-search-components/lib/styles/styles.css";

<Header>
  <SearchBox />
</Header>
<Body bodyContent={<Results />}/>
```

OK, now you should see the same functionality, but with some styles. `Results`
has some additional parameters we can configure. Additionally, we could now
add `Paging` and `PagingInfo`.

```jsx
import {
  ...
  PagingInfo,
  ResultsPerPage,
  Paging
} from "@elastic/react-search-ui";

...

<Header>
  <SearchBox />
</Header>
<Body
  bodyContent={<Results titleField="title" urlField="nps_link" />}
  bodyHeader={
    <div className="meta">
      <PagingInfo />
      <ResultsPerPage />
    </div>
  }
  bodyFooter={<Paging />}
/>
```

Do you follow what we did? We just used `Header` and `Body` to layout the page.
Most people probably wouldn't event use these, unless they're really expecting
something completely out of the box.

`PagingInfo`, `ResultsPerPage`, and `Paging` are pretty standard search ui
components.

`titleField` just lets use specify which field we want to use as the title, and
ditto for `urlField`, but for the link in the `Results`.

Note that using the `Results` component is really just a convenience. We could
choose to iterate over results ourselves and show results any way we choose, OR,
use the `Results` component and just override the view with our own markup.

## Facets

To add a facet, we won't just drop a new component on the page. We'll first
need to configure the provider so it fetches that data that we need for our
new component.

Let's add a facet filter on states. And let's also add a range filter for acres.
Adding facet config is just like configuring facets for the API, but we support
a couple of additional [options].(https://github.com/elastic/search-ui/tree/master/packages/search-ui#facet-configuration-)

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
to add components on the page in order to take advantage of those facets.

```jsx
import {
  ...
  Facet
} from "@elastic/react-search-ui";
import {
  ...
  MultiValueFacet,
  SingleRangeSelectFacet
} from "@elastic/react-search-components";

...

<Body
  sideContent={
    <div>
      <Facet field="states" label="States" render={MultiValueFacet} />
      <Facet
        field="acres"
        label="Acres"
        render={SingleRangeSelectFacet}
      />
    </div>
  }
  ...
</Body>
```

FYI, Facet components are one area that still need work. The way we name them,
the way we consume them, etc. Additionally, all facets now are considered "AND"
filters. I'm thinking we should add a configuration at the component level to
configure whether making a selection makes an OR selection or an AND selection.

OK, so, you have facets. Use them. What do you think? Personally, I don't think
that range facet is quite right. Play around with it, you'll see what I mean...

This is because that facet needs to be disjunctive. Add `disjunctive: true` to
the `acres` config in `facetConfig`. That should help

## View customization

OK, so, one more thing. Functionality is great, but let's change the view component
for the `states` facet. ALL components in `react-search-ui` will support a
`render` prop, which lets you customize the view. We're just going to swap in
another view component that provides slightly different markup.

```jsx
import {
  ...
  SingleValueLinksFacet
} from "@elastic/react-search-components";

...

<Facet
  field="states"
  label="States"
  show={10}
  render={SingleValueLinksFacet}
/>
```

You should now see a Facet filter that uses links and a "remove" link, rather
than checkboxes.

Here's another example of how you might use the render prop to customize the view. Let's update the paging info so it just says "1 - 20", because we'd like something a little more concise.

```jsx
<PagingInfo
  render={({ start, end }) => (
    <div className="paging-info">
      <strong>
        {start} - {end}
      </strong>
    </div>
  )}
/>
```

For each Component, a `render` prop will simply be a function that takes a fixed
set of parameters and returns some markup.

You can think of this just like swapping out a view template in Rails.

For instance, `PagingInfo` takes the following parameters:

- end
- searchTerm
- start
- totalResults

You could see this by looking at the default view component: https://github.com/elastic/search-ui/blob/master/packages/react-search-components/src/PagingInfo.js.

Sidenote: in React, your render prop could be expressed using a functional component instead.

```jsx
const PagingInfoView = ({ start, end }) => (
  <div className="paging-info">
    <strong>
      {start} - {end}
    </strong>
  </div>
);

<PagingInfo render={PagingInfoView} />
/>
```

# Manipulating data in a component

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
  render={SingleValueLinksFacet}
/>
```

The states facet data should now be ordered alphabetically.

This looks really ugly. That's because in our core state, we're relying on the
App Search API response, which is highly nested. If we can normalize our state
this should look nicer.

Additionally, we need to make sure in our mapContextToProps function that
we're not mutating the underlying state. That's not going to change but it is
another reason that looks a bit ugly above.

This is basically a hook to manipulate data before it is processed by
the Components.

Other hooks we could provide.

- A hook to manipulate server data before it is stored in core state, so that
  this data could be ordered not just for this component, but for the entire store.
- A hook in each component that let's you manipulate properties before they are
  passed to the view component.

# Creating new components

There's some components we just don't offer. You can easily create a new component
with an HOC we provide called `withState`.

Let's add a new component called "ClearFilters".

Under src create `ClearFilters.js`

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

## Customizing API calls

Some configuration we're normalizing in the Provider configuration.

Like `facetConfig`. No matter what Connector or Back-end you're using, the
configuration would be the same.

There's some stuff that won't be normalized right now, and just need to be
passed through to your API call.

We'll use `searchOptions` for this, for now.

So on your configuration object, you could use the following for app search...

```js
searchOptions: {
  search_fields: {
    title: {},
    description: {}
  },
  result_fields: {
    nps_link: {
      raw: {}
    },
    title: {
      raw: {},
      snippet: {
        size: 100,
        fallback: true
      }
    },
    description: {
      raw: {},
      snippet: {
        size: 100,
        fallback: true
      }
    }
  }
}
```

So, some configuration will be normalized, other configuration will just be
pass through.

## Things to consider

- Naming things, do the package names make sense? Is "Search UI" the right name?
- What was clunky about this?
- What could be improved?
- Do these patterns seem flexible?
- What would adding an AutoComplete to this look like, where it's performing
  a separate query?
- Do we need to namespace data? Like if we had a page that needed multiple queries,
  or would we just configure two separate providers?
- What am I missing?
- Would it make sense to move Reference UI into the monolith?
- At what point should we make this public?

## Things still to do

https://github.com/elastic/search-ui/projects/1

- SiteSearch and ES connectors POC
- Instead of providing ALL custom component, rely on EUI for as much as we can
- Create actual styles for all of these components.
- Determine minimum set of components we should have.
- Normalize state configuration - It's hard to work with right now
- Facets need work -- OR filters, different use cases.
- Use Typescript
- Managed mode - Just a pass through. Support for Redux / React Router.
