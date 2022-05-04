import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { ResultsPerPage } from "../src";

const baseProps = {
  onChange: action("Changed"),
  options: [10, 20, 50, 100],
  value: 100
};

storiesOf("Results per page", module)
  .addDecorator((story) => <div style={{ display: "flex" }}>{story()}</div>)
  .add("basic", () => <ResultsPerPage {...{ ...baseProps }} />)
  .add("no value", () => <ResultsPerPage {...{ ...baseProps, value: null }} />);
