import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Results } from "../src";
import { Result } from "../src";

const baseProps = {
  fields: {
    one: 1,
    two: 2,
    highlighted: "Result with a <em>highlight</em>"
  },
  onClickLink: action("clicked"),
  title: "The title with <em>highlight</em>",
  url: "The URL"
};

const moreFields = {
  zéro: 0,
  un: 1,
  deux: 2,
  trois: 3,
  quatre: 4,
  cinq: 5,
  six: 6,
  sept: 7,
  huit: 8,
  neuf: 9,
  dix: 10,
  onze: 11,
  douze: 12,
  treize: 13,
  quatorze: 14,
  quinze: 15,
  seize: 16,
  "dix-sept": 17,
  "dix-huit": 18,
  "dix-neuf": 19,
  vingt: 20
};

storiesOf("Results Container", module)
  .add("results", () => (
    <Results>
      <Result {...{ ...baseProps }} />
      <Result {...{ ...baseProps }} />
      <Result {...{ ...baseProps }} />
      <Result {...{ ...baseProps }} />
      <Result {...{ ...baseProps }} />
    </Results>
  ))
  .add("long results", () => (
    <Results>
      <Result {...{ ...baseProps, fields: moreFields }} />
      <Result {...{ ...baseProps, fields: moreFields }} />
      <Result {...{ ...baseProps, fields: moreFields }} />
      <Result {...{ ...baseProps, fields: moreFields }} />
      <Result {...{ ...baseProps, fields: moreFields }} />
    </Results>
  ))
  .add("results without titles", () => (
    <Results>
      <Result {...{ ...baseProps, title: null }} />
      <Result {...{ ...baseProps, title: null }} />
      <Result {...{ ...baseProps, title: null }} />
      <Result {...{ ...baseProps, title: null }} />
      <Result {...{ ...baseProps, title: null }} />
    </Results>
  ))
  .add("results without urls", () => (
    <Results>
      <Result {...{ ...baseProps, url: null }} />
      <Result {...{ ...baseProps, url: null }} />
      <Result {...{ ...baseProps, url: null }} />
      <Result {...{ ...baseProps, url: null }} />
      <Result {...{ ...baseProps, url: null }} />
    </Results>
  ));
