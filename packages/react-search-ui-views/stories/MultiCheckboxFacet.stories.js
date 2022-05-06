import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { MultiCheckboxFacet } from "../src";

const baseProps = {
  label: "The Label",
  onMoreClick: action("Clicked More"),
  onRemove: action("Removed"),
  onSelect: action("Selected"),
  onSearch: action("Searching"),
  options: [
    {
      value: "value",
      count: 10,
      selected: false
    },
    {
      value: "two",
      count: 20,
      selected: false
    },
    {
      value: "three",
      count: 30,
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

storiesOf("Facets/MultiCheckboxFacet", module)
  .add("with Value Facets not selected", () => (
    <MultiCheckboxFacet {...{ ...baseProps }} />
  ))
  .add("with Value Facets selected", () => (
    <MultiCheckboxFacet
      {...{
        ...baseProps,
        options: baseProps.options.map((o) => ({ ...o, selected: true }))
      }}
    />
  ))
  .add("with Range Facets not selected", () => (
    <MultiCheckboxFacet
      {...{
        ...baseProps,
        options: rangeOptions
      }}
    />
  ))
  .add("with Range Facets selected", () => (
    <MultiCheckboxFacet
      {...{
        ...baseProps,
        options: rangeOptions.map((o) => ({ ...o, selected: true }))
      }}
    />
  ))
  .add("basic", () => (
    <MultiCheckboxFacet {...{ showMore: false, ...baseProps }} />
  ))
  .add("with More", () => (
    <MultiCheckboxFacet {...{ ...baseProps, showMore: true, values: [] }} />
  ))
  .add("with Search", () => (
    <MultiCheckboxFacet
      {...{
        ...baseProps,
        showSearch: true,
        searchPlaceholder: "Search..."
      }}
    />
  ))
  .add("with falsey values", () => (
    <MultiCheckboxFacet
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
