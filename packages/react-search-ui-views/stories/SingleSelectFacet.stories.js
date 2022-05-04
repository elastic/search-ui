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
      },
      selected: false
    },
    {
      count: 11,
      value: {
        from: 11,
        to: 20,
        name: "The second option"
      },
      selected: false
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
  .add("no options selected", () => <SingleSelectFacet {...{ ...baseProps }} />)
  .add("with Range Facets selected", () => (
    <SingleSelectFacet
      {...{
        ...baseProps,
        options: baseProps.options.map((o) =>
          o.value.name === "The second option" ? { ...o, selected: true } : o
        )
      }}
    />
  ))
  .add("with Value Facets selected", () => (
    <SingleSelectFacet
      {...{
        ...baseProps,
        options: valueFacetOptions.map((o) =>
          o.value === "Pennsylvania" ? { ...o, selected: true } : o
        )
      }}
    />
  ))
  .add("with falsey values", () => (
    <SingleSelectFacet
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
