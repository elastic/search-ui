import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { SingleLinksFacet } from "../src";

const baseProps = {
  onChange: action("changed"),
  onSelect: action("selected"),
  onRemove: action("removed"),
  label: "The label",
  values: [],
  options: [
    {
      count: 100,
      value: "Compact Cars"
    },
    {
      count: 150,
      value: "Subcompact Cars"
    },
    {
      count: 300,
      value: "Mini Compact Cars"
    },
    {
      count: 120,
      value: "Hatchback"
    },
    {
      count: 80,
      value: "Sport Utility Vehicles"
    }
  ]
};

const rangeOptions = [
  {
    count: 1,
    value: {
      from: 1,
      to: 10,
      name: "The first option"
    }
  },
  {
    count: 11,
    value: {
      from: 11,
      to: 20,
      name: "The second option"
    }
  }
];

storiesOf("Facets/SingleLinksFacet", module)
  .add("with Value Facets not selected", () => (
    <SingleLinksFacet {...{ ...baseProps }} />
  ))
  .add("with Value Facets selected", () => (
    <SingleLinksFacet {...{ ...baseProps, values: ["Compact Cars"] }} />
  ))
  .add("with Range Facets not selected", () => (
    <SingleLinksFacet {...{ ...baseProps, options: rangeOptions }} />
  ))
  .add("with Range Facets selected", () => (
    <SingleLinksFacet
      {...{
        ...baseProps,
        options: rangeOptions,
        values: [
          {
            from: 11,
            to: 20,
            name: "The second option"
          }
        ]
      }}
    />
  ));
