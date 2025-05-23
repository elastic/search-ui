import React from "react";
import { render } from "@testing-library/react";
import SingleSelectFacet from "../SingleSelectFacet";
import { FacetViewProps } from "../types";

const params: FacetViewProps = {
  label: "A Facet",
  onChange: jest.fn(),
  onRemove: jest.fn(),
  onMoreClick: jest.fn(),
  onSearch: jest.fn(),
  onSelect: jest.fn(),
  searchPlaceholder: "Search",
  showMore: false,
  showSearch: false,
  values: [],
  options: [
    {
      count: 20,
      value: {
        from: 1,
        to: 10,
        name: "Range 1"
      },
      selected: true
    },
    {
      count: 10,
      value: {
        to: 20,
        from: 11,
        name: "Range 2"
      },
      selected: false
    }
  ]
};

it("renders", () => {
  const { container } = render(<SingleSelectFacet {...params} />);
  expect(container).toMatchSnapshot();
});

it("renders falsey values correctly", () => {
  const { container } = render(
    <SingleSelectFacet
      {...params}
      options={[
        {
          value: 0,
          count: 10,
          selected: false
        },
        {
          value: false,
          count: 20,
          selected: false
        },
        {
          value: "",
          count: 30,
          selected: false
        }
      ]}
    />
  );
  expect(container).toMatchSnapshot();
});

describe("determining selected option", () => {
  it("will correctly determine which of the options is selected", () => {
    const { container } = render(<SingleSelectFacet {...params} />);
    expect(
      container.querySelector(".sui-select__single-value")
    ).toHaveTextContent("Range 1");
  });

  // This shouldn't ever happen, but if it does, it should use the first selected value
  it("will used the first selected option when multiple options are selected", () => {
    const { container } = render(
      <SingleSelectFacet
        {...params}
        options={params.options.map((o) => ({ ...o, selected: true }))}
      />
    );
    expect(
      container.querySelector(".sui-select__single-value")
    ).toHaveTextContent("Range 1");
  });

  it("will correctly determine when no value is selected", () => {
    const { container } = render(
      <SingleSelectFacet
        {...params}
        options={params.options.map((o) => ({ ...o, selected: false }))}
      />
    );
    expect(
      container.querySelector(".sui-select__placeholder")
    ).toHaveTextContent("Select...");
  });
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const { container } = render(
    <SingleSelectFacet {...params} className={customClassName} />
  );
  expect(container.firstChild).toHaveClass("sui-facet", "test-class");
});
