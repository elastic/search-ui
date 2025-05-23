import React from "react";
import { render } from "@testing-library/react";
import Sorting from "../Sorting";
import { SortingViewProps } from "../Sorting";

const requiredProps: SortingViewProps = {
  onChange: jest.fn(),
  options: [
    { label: "Name ASC", value: "name|||asc" },
    { label: "Name DESC", value: "name|||desc" }
  ],
  value: "name|||asc"
};

it("renders correctly when there is a value", () => {
  const { container } = render(
    <Sorting {...requiredProps} value={"name|||desc"} />
  );
  expect(container).toMatchSnapshot();
});

it("renders correctly when there is not a value", () => {
  const { container } = render(<Sorting {...requiredProps} />);
  expect(container).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const { container } = render(
    <Sorting {...requiredProps} className={customClassName} />
  );
  expect(container.firstChild).toHaveClass("sui-sorting", "test-class");
});
