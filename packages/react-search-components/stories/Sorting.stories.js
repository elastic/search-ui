import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Sorting } from "../src";

const baseProps = {
  label: "Sort by",
  onChange: action("Changed"),
  options: [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" }
  ],
  value: "chocolate"
};

storiesOf("Sorting", module)
  .add("basic", () => <Sorting {...{ ...baseProps }} />)
  .add("no value", () => <Sorting {...{ ...baseProps, value: null }} />);
