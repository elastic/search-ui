import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Results } from "../src";
import { Result } from "../src";

const baseProps = {
  onClickLink: action("clicked"),
  result: {
    title: { raw: "The title with <em>highlight</em>" },
    url: { raw: "The URL" },
    one: { raw: 1 },
    two: { raw: 2 },
    highlighted: { raw: "Result with a <em>highlight</em>" }
  },
  titleField: "title",
  urlField: "url"
};

const expandedResult = {
  title: { raw: "The title with <em>highlight</em>" },
  url: { raw: "The URL" },
  zéro: { raw: 0 },
  un: { raw: 1 },
  deux: { raw: 2 },
  trois: { raw: 3 },
  quatre: { raw: 4 },
  cinq: { raw: 5 },
  six: { raw: 6 },
  sept: { raw: 7 },
  huit: { raw: 8 },
  neuf: { raw: 9 },
  dix: { raw: 10 },
  onze: { raw: 11 },
  douze: { raw: 12 },
  treize: { raw: 13 },
  quatorze: { raw: 14 },
  quinze: { raw: 15 },
  seize: { raw: 16 },
  "dix-sept": { raw: 17 },
  "dix-huit": { raw: 18 },
  "dix-neuf": { raw: 19 },
  vingt: { raw: 20 }
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
      <Result {...{ ...baseProps, result: expandedResult }} />
      <Result {...{ ...baseProps, result: expandedResult }} />
      <Result {...{ ...baseProps, result: expandedResult }} />
      <Result {...{ ...baseProps, result: expandedResult }} />
      <Result {...{ ...baseProps, result: expandedResult }} />
    </Results>
  ))
  .add("results without titles", () => (
    <Results>
      <Result
        {...{
          ...baseProps,
          result: { ...baseProps.result, title: undefined },
          titleField: undefined
        }}
      />
      <Result
        {...{
          ...baseProps,
          result: { ...baseProps.result, title: undefined },
          titleField: undefined
        }}
      />
      <Result
        {...{
          ...baseProps,
          result: { ...baseProps.result, title: undefined },
          titleField: undefined
        }}
      />
      <Result
        {...{
          ...baseProps,
          result: { ...baseProps.result, title: undefined },
          titleField: undefined
        }}
      />
      <Result
        {...{
          ...baseProps,
          result: { ...baseProps.result, title: undefined },
          titleField: undefined
        }}
      />
    </Results>
  ))
  .add("results without urls", () => (
    <Results>
      <Result
        {...{
          ...baseProps,
          result: { ...baseProps.result, url: undefined },
          urlField: undefined
        }}
      />
      <Result
        {...{
          ...baseProps,
          result: { ...baseProps.result, url: undefined },
          urlField: undefined
        }}
      />
      <Result
        {...{
          ...baseProps,
          result: { ...baseProps.result, url: undefined },
          urlField: undefined
        }}
      />
      <Result
        {...{
          ...baseProps,
          result: { ...baseProps.result, url: undefined },
          urlField: undefined
        }}
      />
      <Result
        {...{
          ...baseProps,
          result: { ...baseProps.result, url: undefined },
          urlField: undefined
        }}
      />
    </Results>
  ));
