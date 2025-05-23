import React from "react";
import { render } from "@testing-library/react";
import MultiCheckboxFacet from "../MultiCheckboxFacet";
import { FacetViewProps } from "../types";

const params: FacetViewProps = {
  label: "A Facet",
  onMoreClick: jest.fn(),
  onRemove: jest.fn(),
  onSelect: jest.fn(),
  onSearch: jest.fn(),
  onChange: jest.fn(),
  searchPlaceholder: "Search",
  showSearch: false,
  values: [],
  options: [
    {
      value: "fieldValue1",
      count: 10,
      selected: false
    },
    {
      value: "fieldValue2",
      count: 5,
      selected: true
    }
  ],
  showMore: true
};

const rangeOptions = [
  {
    count: 1,
    value: {
      from: 1,
      to: 10,
      name: "The first option"
    }
  },
  {
    count: 11,
    value: {
      from: 11,
      to: 20,
      name: "The second option"
    }
  }
];

it("renders", () => {
  const { container } = render(<MultiCheckboxFacet {...params} />);
  expect(container).toMatchSnapshot();
});

it("renders falsey values correctly", () => {
  const { container } = render(
    <MultiCheckboxFacet
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

it("renders range filters", () => {
  const { container } = render(
    <MultiCheckboxFacet {...params} options={rangeOptions} />
  );
  expect(container).toMatchSnapshot();
});

it("will render 'more' button if more param is true", () => {
  const { container } = render(
    <MultiCheckboxFacet
      {...{
        ...params,
        showMore: true
      }}
    />
  );
  expect(container.querySelector(".sui-facet-view-more")).toBeInTheDocument();
});

it("will render a no results message is no options are available", () => {
  const { container } = render(
    <MultiCheckboxFacet
      {...{
        ...params,
        options: []
      }}
    />
  );
  expect(
    container.querySelector(".sui-multi-checkbox-facet")
  ).toHaveTextContent("No matching options");
});

it("won't render 'more' button if more param is false", () => {
  const { container } = render(
    <MultiCheckboxFacet
      {...{
        ...params,
        showMore: false
      }}
    />
  );
  expect(
    container.querySelector(".sui-multi-checkbox-facet__view-more")
  ).not.toBeInTheDocument();
});

describe("determining selected option", () => {
  it("will correctly determine which of the options is selected", () => {
    const { container } = render(<MultiCheckboxFacet {...params} />);
    const checkboxes = container.querySelectorAll("input[type='checkbox']");
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const { container } = render(
    <MultiCheckboxFacet className={customClassName} {...params} />
  );
  expect(container.firstChild).toHaveClass("sui-facet", "test-class");
});

it("will render search input if `showSearch` param is true", () => {
  const { container } = render(
    <MultiCheckboxFacet
      {...{
        ...params,
        showSearch: true
      }}
    />
  );
  expect(container.querySelector(".sui-facet-search")).toBeInTheDocument();
});

it("won't render search input if `showSearch` param is false", () => {
  const { container } = render(
    <MultiCheckboxFacet
      {...{
        ...params,
        showSearch: false
      }}
    />
  );
  expect(container.querySelector(".sui-facet-search")).not.toBeInTheDocument();
});

it("should use the `searchPlaceholder` param as a search input placeholder", () => {
  const searchPlaceholder = "bingo";
  const { container } = render(
    <MultiCheckboxFacet
      {...{
        ...params,
        showSearch: true,
        searchPlaceholder
      }}
    />
  );
  expect(
    container.querySelector(".sui-facet-search__text-input")
  ).toHaveAttribute("placeholder", searchPlaceholder);
});
