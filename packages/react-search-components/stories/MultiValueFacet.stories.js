import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { MultiValueFacet } from "../src";

const baseProps = {
  label: "Label",
  onMoreClick: action("changed"),
  onRemove: action("changed"),
  onSelect: action("changed"),
  options: [
    {
      value: "value",
      count: 10
    },
    {
      value: "two",
      count: 20
    },
    {
      value: "three",
      count: 30
    }
  ],
  showMore: true,
  values: ["one", "two", "three"]
};

storiesOf("Multi-value Facet", module).add("basic", () => (
  <MultiValueFacet {...{ ...baseProps }} />
));
