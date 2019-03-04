import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { MultiCheckboxFacet } from "../src";

const baseProps = {
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

storiesOf("Facets/MultiCheckboxFacet", module)
  .add("with Value Facets not selected", () => (
    <MultiCheckboxFacet {...{ ...baseProps, values: [] }} />
  ))
  .add("with Value Facets selected", () => (
    <MultiCheckboxFacet {...{ ...baseProps }} />
  ))
  .add("with Range Facets not selected", () => (
    <MultiCheckboxFacet
      {...{ ...baseProps, values: [], options: rangeOptions }}
    />
  ))
  .add("with Range Facets selected", () => (
    <MultiCheckboxFacet
      {...{
        ...baseProps,
        values: [
          {
            from: 11,
            to: 20,
            name: "The second option"
          }
        ],
        options: rangeOptions
      }}
    />
  ))
  .add("basic", () => (
    <MultiCheckboxFacet {...{ showMore: false, ...baseProps }} />
  ))
  .add("with More", () => (
    <MultiCheckboxFacet {...{ ...baseProps, showMore: true, values: [] }} />
  ));
