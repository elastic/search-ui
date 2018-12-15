import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { SingleValueLinksFacet } from "../src";

const baseProps = {
  onChange: action("changed"),
  onSelect: action("selected"),
  onRemove: action("removed"),
  label: "The label",
  options: [
    {
      value: "One",
      count: 10
    },
    {
      value: "Two",
      count: 20
    },
    {
      value: "Three",
      count: 30
    }
  ],
  values: ["one", "two", "three"]
};

storiesOf("Single Facet Value with Link", module).add("basic", () => (
  <SingleValueLinksFacet {...{ ...baseProps }} />
));
