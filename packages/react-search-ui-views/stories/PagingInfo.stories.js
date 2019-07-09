import React from "react";

import { storiesOf } from "@storybook/react";

import { PagingInfo } from "../src";

const baseProps = {
  searchTerm: "search term",
  start: 1,
  end: 10,
  totalResults: 20
};

storiesOf("Paging Info", module).add("basic", () => (
  <PagingInfo {...baseProps} />
));

storiesOf("Paging Info", module).add("page capped at total results", () => (
  <PagingInfo {...baseProps} start={15} end={30} />
));
