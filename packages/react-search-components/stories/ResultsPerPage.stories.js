import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { ResultsPerPage } from "../src";

const baseProps = {
  onChange: action("changed"),
  options: [10, 20, 50, 100],
  value: 10
};

storiesOf("Results per page", module).add("Basic", () => (
  <ResultsPerPage {...{ ...baseProps }} />
));
