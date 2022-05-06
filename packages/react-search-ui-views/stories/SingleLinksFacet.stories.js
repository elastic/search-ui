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
      count: 100,
      value: "Compact Cars",
      selected: false
    },
    {
      count: 150,
      value: "Subcompact Cars",
      selected: false
    },
    {
      count: 300,
      value: "Mini Compact Cars",
      selected: false
    },
    {
      count: 120,
      value: "Hatchback",
      selected: false
    },
    {
      count: 80,
      value: "Sport Utility Vehicles",
      selected: false
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
    <SingleLinksFacet
      {...{
        ...baseProps,
        options: baseProps.options.map((o) =>
          o.value === "Compact Cars" ? { ...o, selected: true } : o
        )
      }}
    />
  ))
  .add("with Range Facets not selected", () => (
    <SingleLinksFacet {...{ ...baseProps, options: rangeOptions }} />
  ))
  .add("with Range Facets selected", () => (
    <SingleLinksFacet
      {...{
        ...baseProps,
        options: rangeOptions.map((o) =>
          o.value.name === "The second option" ? { ...o, selected: true } : o
        )
      }}
    />
  ))
  .add("with falsey values", () => (
    <SingleLinksFacet
      {...{
        ...baseProps,
        options: [
          {
            value: 0,
            count: 10,
            selected: false
          },
          {
            value: false,
            count: 20,
            selected: false
          },
          {
            value: "",
            count: 30,
            selected: false
          },
          {
            value: undefined,
            count: 30,
            selected: false
          },
          {
            value: null,
            count: 30,
            selected: false
          }
        ]
      }}
    />
  ));
