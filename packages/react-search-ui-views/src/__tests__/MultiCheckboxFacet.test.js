import React from "react";
import MultiCheckboxFacet from "../MultiCheckboxFacet";
import { shallow } from "enzyme";

const params = {
  label: "A Facet",
  onMoreClick: jest.fn(),
  onRemove: jest.fn(),
  onSelect: jest.fn(),
  options: [
    {
      value: "fieldValue1",
      count: 10
    },
    {
      value: "fieldValue2",
      count: 5
    }
  ],
  showMore: true,
  values: ["fieldValue2"]
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
  expect(wrapper.find(".sui-multi-checkbox-facet__view-more")).toHaveLength(1);
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

describe("determining selected option from values", () => {
  it("will correctly determine which of the options is selected based on the provided value", () => {
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

  it("will correctly determine when no value is selected", () => {
    const wrapper = shallow(<MultiCheckboxFacet {...params} values={[]} />);

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
    ).toBe(false);
  });

  it("will correctly determine which of the options is selected when using range filters", () => {
    const wrapper = shallow(
      <MultiCheckboxFacet
        {...params}
        options={rangeOptions}
        values={[
          {
            from: 1,
            to: 10,
            name: "The first option"
          }
        ]}
      />
    );

    expect(
      wrapper
        .find("input")
        .at(0)
        .prop("checked")
    ).toBe(true);

    expect(
      wrapper
        .find("input")
        .at(1)
        .prop("checked")
    ).toBe(false);
  });

  it("will correctly determine which of the options is selected even if the provided value has differently ordered props", () => {
    const wrapper = shallow(
      <MultiCheckboxFacet
        {...params}
        options={rangeOptions}
        values={[
          {
            to: 10, // Reversed
            from: 1, // Reversed
            name: "The first option"
          }
        ]}
      />
    );

    expect(
      wrapper
        .find("input")
        .at(0)
        .prop("checked")
    ).toBe(true);

    expect(
      wrapper
        .find("input")
        .at(1)
        .prop("checked")
    ).toBe(false);
  });
});
