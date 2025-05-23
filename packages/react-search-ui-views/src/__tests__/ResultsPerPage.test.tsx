import React from "react";
import { render } from "@testing-library/react";
import ResultsPerPage from "../ResultsPerPage";

const requiredProps = {
  onChange: () => ({}),
  options: [20, 40]
};

it("renders correctly when there is a selected value", () => {
  const { container } = render(
    <ResultsPerPage {...requiredProps} value={40} />
  );
  expect(container).toMatchSnapshot();
});

it("renders correctly when there is not a selected value", () => {
  const { container } = render(<ResultsPerPage {...requiredProps} />);
  expect(container).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const { container } = render(
    <ResultsPerPage {...requiredProps} className={customClassName} />
  );
  expect(container.firstChild).toHaveClass(
    "sui-results-per-page",
    "test-class"
  );
});
