import React from "react";
import SingleSelectFacet from "../SingleSelectFacet";
import { shallow, render } from "enzyme";

const valueFacetOptions = [
  {
    count: 1,
    value: "Pennsylvania"
  },
  {
    count: 1,
    value: "Georgia"
  }
];

const params = {
  label: "A Facet",
  onChange: jest.fn(),
  options: [
    {
      count: 20,
      value: {
        from: 1,
        to: 10,
        name: "Range 1"
      }
    },
    {
      count: 10,
      value: {
        to: 20,
        from: 11,
        name: "Range 2"
      }
    }
  ],
  values: [
    {
      from: 1,
      to: 10,
      name: "Range 1"
    }
  ]
};

it("renders", () => {
  const wrapper = shallow(<SingleSelectFacet {...params} />);
  expect(wrapper).toMatchSnapshot();
});

describe("determining selected option from values", () => {
  it("will correctly determine which of the options is selected based on the provided value", () => {
    const wrapper = render(<SingleSelectFacet {...params} />);
    expect(wrapper.find(".sui-select__single-value").text()).toEqual("Range 1");
  });

  it("will correctly determine which of the options is selected even if the provided value has differently ordered props", () => {
    const wrapper = render(
      <SingleSelectFacet
        {...params}
        values={[
          {
            to: 10, // Reversed
            from: 1, // Reversed
            name: "Range 1"
          }
        ]}
      />
    );
    expect(wrapper.find(".sui-select__single-value").text()).toEqual("Range 1");
  });

  it("will correctly determine which of the options is selected when using value filters", () => {
    const wrapper = render(
      <SingleSelectFacet
        {...params}
        options={valueFacetOptions}
        values={["Pennsylvania"]}
      />
    );
    expect(wrapper.find(".sui-select__single-value").text()).toEqual(
      "Pennsylvania"
    );
  });

  it("will correctly determine when no value is selected", () => {
    const wrapper = render(
      <SingleSelectFacet {...params} options={valueFacetOptions} values={[]} />
    );
    expect(wrapper.find(".sui-select__single-value").text()).toEqual("");
  });
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <SingleSelectFacet {...params} className={customClassName} />
  );
  const { className } = wrapper.props();
  expect(className).toEqual("sui-search-facet sui-facet test-class");
});
