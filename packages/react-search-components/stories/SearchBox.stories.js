import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { SearchBox } from "../src";

const baseProps = {
  onChange: action("changed"),
  onSubmit: e => {
    e.preventDefault();
    action("submitted")();
  }
};

storiesOf("SearchBox", module)
  .add("no value", () => <SearchBox {...{ ...baseProps }} />)
  .add("with value", () => <SearchBox {...{ value: "value", ...baseProps }} />)
  .add("with focus", () => <SearchBox {...{ isFocused: true, ...baseProps }} />)
  .add("with inputProps", () => (
    <SearchBox
      {...{ inputProps: { placeholder: "custom placeholder" }, ...baseProps }}
    />
  ));
