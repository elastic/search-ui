import React from "react";
import { render } from "@testing-library/react";
import Paging from "../Paging";

const params = {
  current: 1,
  onChange: () => ({}),
  resultsPerPage: 10,
  totalPages: 100
};

it("renders correctly", () => {
  const { container } = render(<Paging {...params} />);
  expect(container).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const { container } = render(
    <Paging className={customClassName} {...params} />
  );
  expect(container.firstChild).toHaveClass(
    "rc-pagination",
    "sui-paging",
    "test-class"
  );
});
