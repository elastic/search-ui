import React from "react";
import { render } from "@testing-library/react";
import PagingInfo from "../PagingInfo";

const props = {
  end: 20,
  searchTerm: "grok",
  start: 0,
  totalResults: 1000
};

it("renders correctly", () => {
  const { container } = render(<PagingInfo {...props} />);
  expect(container).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const { container } = render(
    <PagingInfo className={customClassName} {...props} />
  );
  expect(container.firstChild).toHaveClass("sui-paging-info", "test-class");
});
