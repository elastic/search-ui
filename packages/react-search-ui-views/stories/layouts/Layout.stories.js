import React from "react";

import { storiesOf } from "@storybook/react";

import { Layout } from "../../src";

storiesOf("layouts/Layout", module)
  .add("basic", () => (
    <Layout
      header={<div>Header</div>}
      sideContent={
        <div>
          <div>Side Content</div>
        </div>
      }
      bodyContent={<div>Body Content</div>}
      bodyHeader={<div>Body Header</div>}
      bodyFooter={<div>Body Footer</div>}
    />
  ))
  .add("empty", () => <Layout />);
