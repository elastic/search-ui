import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { SingleRangeSelectFacet } from "../src";

const baseProps = {
  onChange: action("changed"),
  label: "The label",
  options: [
    {
      count: 100,
      from: 1,
      to: 10,
      name: "One"
    },
    {
      count: 1000,
      from: 1,
      to: 10,
      name: "Two"
    }
  ],
  values: [
    {
      from: 1,
      to: 10
    },
    {
      from: 30,
      to: 40
    }
  ]
};

storiesOf("Rangle Select Facet", module).add("basic", () => (
  <SingleRangeSelectFacet {...{ ...baseProps }} />
));
