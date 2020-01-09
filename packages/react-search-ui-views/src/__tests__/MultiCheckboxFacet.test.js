import React from "react";
import MultiCheckboxFacet from "../MultiCheckboxFacet";
import { shallow } from "enzyme";

const params = {
  label: "A Facet",
  onMoreClick: jest.fn(),
  onRemove: jest.fn(),
  onSelect: jest.fn(),
  onSearch: jest.fn(),
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
  const wrapper = shallow(<MultiCheckboxFacet {...params} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders falsey values correctly", () => {
  const wrapper = shallow(
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
  expect(wrapper).toMatchSnapshot();
});

it("renders range filters", () => {
  const wrapper = shallow(
    <MultiCheckboxFacet {...params} option={rangeOptions} />
  );
  expect(wrapper).toMatchSnapshot();
});

it("will render 'more' button if more param is true", () => {
  const wrapper = shallow(
    <MultiCheckboxFacet
      {...{
        ...params,
        showMore: true
      }}
    />
  );
  expect(wrapper.find(".sui-facet-view-more")).toHaveLength(1);
});

it("will render a no results message is no options are available", () => {
  const wrapper = shallow(
    <MultiCheckboxFacet
      {...{
        ...params,
        options: []
      }}
    />
  );
  expect(wrapper.find(".sui-multi-checkbox-facet").text()).toEqual(
    "No matching options"
  );
});

it("won't render 'more' button if more param is false", () => {
  const wrapper = shallow(
    <MultiCheckboxFacet
      {...{
        ...params,
        showMore: false
      }}
    />
  );
  expect(wrapper.find(".sui-multi-checkbox-facet__view-more")).toHaveLength(0);
});

describe("determining selected option", () => {
  it("will correctly determine which of the options is selected", () => {
    const wrapper = shallow(<MultiCheckboxFacet {...params} />);
    expect(
      wrapper
        .find("input")
        .at(0)
        .prop("checked")
    ).toBe(false);

    expect(
      wrapper
        .find("input")
        .at(1)
        .prop("checked")
    ).toBe(true);
  });
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <MultiCheckboxFacet className={customClassName} {...params} />
  );
  const { className } = wrapper.props();
  expect(className).toEqual("sui-facet test-class");
});

it("will render search input if `showSearch` param is true", () => {
  const wrapper = shallow(
    <MultiCheckboxFacet
      {...{
        ...params,
        showSearch: true
      }}
    />
  );

  expect(wrapper.find(".sui-facet-search")).toHaveLength(1);
});

it("won't render search input if `showSearch` param is false", () => {
  const wrapper = shallow(
    <MultiCheckboxFacet
      {...{
        ...params,
        showSearch: false
      }}
    />
  );

  expect(wrapper.find(".sui-facet-search")).toHaveLength(0);
});

it("should use the `searchPlaceholder` param as a search input placeholder", () => {
  const searchPlaceholder = "bingo";
  const wrapper = shallow(
    <MultiCheckboxFacet
      {...{
        ...params,
        showSearch: true,
        searchPlaceholder
      }}
    />
  );

  expect(
    wrapper.find(".sui-facet-search__text-input").prop("placeholder")
  ).toBe(searchPlaceholder);
});
