import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { SingleRangeSelectFacet } from "../src";

const baseProps = {
  onChange: action("changed"),
  label: "The label",
  options: [
    {
      count: 1,
      from: 1,
      to: 10,
      name: "The first option"
    },
    {
      count: 11,
      from: 11,
      to: 20,
      name: "The second option"
    }
  ],
  values: [
    {
      from: 1,
      to: 10
    },
    {
      from: 11,
      to: 20
    }
  ]
};

storiesOf("Facets: Rangle Select", module).add("option selected", () => (
  <SingleRangeSelectFacet {...{ ...baseProps }} />
));
