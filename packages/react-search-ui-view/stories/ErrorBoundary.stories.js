import React from "react";

import { storiesOf } from "@storybook/react";

import { ErrorBoundary } from "../src";

const baseProps = {
  children: <div className="sui-search-error no-error">No error.</div>
};

storiesOf("Search Error", module)
  .add("basic error", () => (
    <ErrorBoundary {...{ error: "I am an error", ...baseProps }} />
  ))
  .add("no error", () => <ErrorBoundary {...{ error: null, ...baseProps }} />);
