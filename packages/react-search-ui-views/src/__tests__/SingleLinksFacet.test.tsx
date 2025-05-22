import React from "react";
import { render } from "@testing-library/react";
import SingleLinksFacet from "../SingleLinksFacet";
import { FacetViewProps } from "../types";

const params: FacetViewProps = {
  label: "Facet",
  onRemove: jest.fn(),
  onSelect: jest.fn(),
  options: [
    { value: "1", count: 1, selected: false },
    { value: "2", count: 1, selected: false }
  ],
  onChange: jest.fn(),
  onMoreClick: jest.fn(),
  onSearch: jest.fn(),
  searchPlaceholder: "Search",
  showMore: false,
  showSearch: false,
  values: []
};

it("renders correctly", () => {
  const { container } = render(<SingleLinksFacet {...params} />);
  expect(container).toMatchSnapshot();
});

it("renders falsey values correctly", () => {
  const { container } = render(
    <SingleLinksFacet
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
    const { container } = render(
      <SingleLinksFacet
        {...params}
        options={[
          { value: "1", count: 1, selected: true },
          { value: "2", count: 1, selected: false }
        ]}
      />
    );
    const listItems = container.querySelectorAll("li");
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent("1 (Remove)");
  });

  it("will used the first selected option when multiple options are selected", () => {
    const { container } = render(
      <SingleLinksFacet
        {...params}
        options={[
          { value: "1", count: 1, selected: true },
          { value: "2", count: 1, selected: true }
        ]}
      />
    );
    const listItems = container.querySelectorAll("li");
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent("1 (Remove)");
  });

  it("will correctly determine when no value is selected", () => {
    const { container } = render(
      <SingleLinksFacet
        {...params}
        options={[
          { value: "1", count: 1, selected: false },
          { value: "2", count: 1, selected: false }
        ]}
      />
    );
    expect(container.querySelectorAll("li")).toHaveLength(2);
  });
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const { container } = render(
    <SingleLinksFacet {...params} className={customClassName} />
  );
  expect(container.firstChild).toHaveClass("sui-facet", "test-class");
});
