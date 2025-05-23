import React from "react";
import { render } from "@testing-library/react";
import Facets from "../Facets";

it("renders correctly", () => {
  const { container } = render(
    <Facets>
      <div>Children</div>
    </Facets>
  );
  expect(container).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const { container } = render(
    <Facets className={customClassName}>
      <div>Children</div>
    </Facets>
  );
  expect(container.firstChild).toHaveClass("sui-facet-container", "test-class");
});
