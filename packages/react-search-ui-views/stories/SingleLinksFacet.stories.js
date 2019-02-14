import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { SingleLinksFacet } from "../src";

const baseProps = {
  onChange: action("changed"),
  onSelect: action("selected"),
  onRemove: action("removed"),
  label: "The label",
  options: [
    {
      value: "Compact Cars",
      count: 100
    },
    {
      value: "Subcompact Cars",
      count: 150
    },
    {
      value: "Mini Compact Cars",
      count: 300
    },
    {
      value: "Hatchback",
      count: 120
    },
    {
      value: "Sport Utility Vehicles",
      count: 80
    }
  ]
};

storiesOf("Facets: Single Value", module)
  .add("none selected", () => <SingleLinksFacet {...{ ...baseProps }} />)
  .add("selected", () => (
    <SingleLinksFacet {...{ values: ["Compact Cars"], ...baseProps }} />
  ));
