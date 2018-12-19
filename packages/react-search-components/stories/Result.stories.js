import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Result } from "../src";

const baseProps = {
  fields: { one: 1, two: 2, highlighted: "Result with a <em>highlight</em>" },
  onClickLink: action("clicked"),
  title: "The title with <em>highlight</em>",
  url: "The URL"
};

storiesOf("Result", module)
  .add("basic", () => <Result {...{ ...baseProps }} />)
  .add("no URL", () => <Result {...{ ...baseProps, url: null }} />)
  .add("no title", () => <Result {...{ ...baseProps, title: null }} />);
