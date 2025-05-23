import React from "react";
import { render } from "@testing-library/react";
import ErrorBoundary from "../ErrorBoundary";

const params = {
  children: <div>Child</div>,
  error: "I am an error"
};

it("renders an error when there is an error", () => {
  const { container } = render(<ErrorBoundary {...params} />);
  expect(container).toMatchSnapshot();
});

it("renders children when there is no error", () => {
  const { container } = render(
    <ErrorBoundary
      {...{
        ...params,
        error: ""
      }}
    />
  );
  expect(container).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const { container } = render(
    <ErrorBoundary className={customClassName} {...params} />
  );
  expect(container.firstChild).toHaveClass("sui-search-error", "test-class");
});
