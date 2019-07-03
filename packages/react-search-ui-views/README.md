# react-search-ui-views

Part of the [Search UI](https://github.com/elastic/search-ui) project.

This is the view layer for [react-search-ui](../react-search-ui/README.md).

This library provides view implementations for all of React Search UI's
components along with corresponding CSS, and a few layout components.

The components provided here have no logic behind them, they are simple,
stateless, view-only components.

## Usage

```jsx
import React from "react";
import {
  Layout,
  PagingInfo,
  Result,
  SearchBox
} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

export default function App() {
  return (
    <div>
      <Layout
        header={<SearchBox value="test" />}
        bodyHeader={
          <div className="meta">
            <PagingInfo
              end={10}
              searchTerm={"test"}
              start={1}
              totalResults={100}
            />
          </div>
        }
        bodyContent={
          <div>
            <Result
              title="A Result"
              fields={{ description: "This is an example of a result" }}
            />
          </div>
        }
      />
    </div>
  );
}
```

## Storybook

A visual component reference is available locally. It is built with [Storybook](https://storybook.js.org/), and can be run locally with the following command:

```
npm run storybook
```
