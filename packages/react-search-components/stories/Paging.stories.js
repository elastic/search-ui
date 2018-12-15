import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Paging } from "../src";

const baseProps = {
  current: 1,
  onChange: action("changed"),
  resultsPerPage: 10,
  totalPages: 100
};

storiesOf("Paging", module).add("Basic", () => (
  <Paging {...{ ...baseProps }} />
));
