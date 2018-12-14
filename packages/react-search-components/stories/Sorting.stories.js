import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Sorting } from "../src";

const baseProps = {
  onChange: action("changed"),
  options: [
    { name: "one", value: "1" },
    { name: "two", value: "2" },
    { name: "three", value: "3" }
  ],
  value: "value"
};

storiesOf("Sorting", module).add("Basic", () => (
  <Sorting {...{ ...baseProps }} />
));
