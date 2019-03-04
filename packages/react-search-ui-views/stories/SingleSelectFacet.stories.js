import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { SingleSelectFacet } from "../src";

const baseProps = {
  onChange: action("changed"),
  label: "The label",
  options: [
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
  ],
  values: [
    {
      from: 11,
      to: 20,
      name: "The second option"
    }
  ]
};

const valueFacetOptions = [
  {
    count: 1,
    value: "Pennsylvania"
  },
  {
    count: 1,
    value: "Georgia"
  }
];

storiesOf("Facets/SingleSelectFacet", module)
  .add("no options selected", () => (
    <SingleSelectFacet {...{ ...baseProps, values: [] }} />
  ))
  .add("with Range Facets selected", () => (
    <SingleSelectFacet {...{ ...baseProps }} />
  ))
  .add("with Value Facets selected", () => (
    <SingleSelectFacet
      {...{
        ...baseProps,
        options: valueFacetOptions,
        values: ["Pennsylvania"]
      }}
    />
  ));
