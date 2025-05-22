import React from "react";
import { render } from "@testing-library/react";
import Results from "../Results";

it("renders correctly", () => {
  const { container } = render(
    <Results>
      <div>Children</div>
    </Results>
  );
  expect(container).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const { container } = render(
    <Results className={customClassName}>
      <div>Children</div>
    </Results>
  );
  expect(container.firstChild).toHaveClass(
    "sui-results-container",
    "test-class"
  );
});
