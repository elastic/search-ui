import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BooleanFacet from "../BooleanFacet";
import { FacetViewProps } from "../types";

const params: FacetViewProps = {
  label: "A Facet",
  onRemove: jest.fn(),
  onChange: jest.fn(),
  onMoreClick: jest.fn(),
  onSearch: jest.fn(),
  onSelect: jest.fn(),
  searchPlaceholder: "Search",
  showMore: false,
  showSearch: false,
  options: [
    {
      value: "true",
      selected: false,
      count: 10
    }
  ],
  values: []
};

afterEach(() => {
  jest.clearAllMocks();
});

it("renders", () => {
  const { container } = render(<BooleanFacet {...params} />);
  expect(container).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const { container } = render(
    <BooleanFacet className={customClassName} {...params} />
  );
  expect(container.firstChild).toHaveClass(customClassName);
});

it("onChange is called on click", () => {
  render(<BooleanFacet {...params} />);

  const checkbox = screen.getByRole("checkbox");
  fireEvent.click(checkbox);

  expect(params.onChange).toHaveBeenCalledTimes(1);
});

it("onRemove is called on click", () => {
  render(
    <BooleanFacet
      {...{
        ...params,
        options: [{ value: "true", count: 10, selected: true }]
      }}
    />
  );

  const checkbox = screen.getByRole("checkbox");
  fireEvent.click(checkbox);

  expect(params.onRemove).toHaveBeenCalledTimes(1);
});

it("onRemove is called on click when value is number", () => {
  render(
    <BooleanFacet
      {...{
        ...params,
        options: [{ value: 1, count: 10, selected: true }]
      }}
    />
  );

  const checkbox = screen.getByRole("checkbox");
  fireEvent.click(checkbox);

  expect(params.onRemove).toHaveBeenCalledTimes(1);
});

it("will not render when there are no true options", () => {
  const { container } = render(
    <BooleanFacet {...{ ...params, options: [] }} />
  );
  expect(container).toMatchSnapshot();
});
