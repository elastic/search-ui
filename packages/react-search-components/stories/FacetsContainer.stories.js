import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Facets } from "../src";
import { MultiValueFacet } from "../src";
import { SingleRangeSelectFacet } from "../src";
import { SingleValueLinksFacet } from "../src";

const multiValueProps = {
  label: "The Label",
  onMoreClick: action("Clicked More"),
  onRemove: action("Removed"),
  onSelect: action("Selected"),
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
  values: ["two", "three"]
};

const rangeFacetProps = {
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

const singleValueLinksProps = {
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

storiesOf("Facets Container", module).add("facets", () => (
  <Facets>
    <SingleRangeSelectFacet {...{ ...rangeFacetProps }} />
    <MultiValueFacet {...{ ...multiValueProps }} />
    <SingleValueLinksFacet {...{ ...singleValueLinksProps }} />
  </Facets>
));
