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

function getParams() {
  return {
    label: "A Facet",
    doFilterValuesMatch: jest
      .fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true),
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
        name: "Range 2"
      }
    ]
  };
}

it("renders", () => {
  const wrapper = shallow(<SingleSelectFacet {...getParams()} />);
  expect(wrapper).toMatchSnapshot();
});

describe("determining selected option from values", () => {
  it("will correctly determine which of the options is selected based on the provided value", () => {
    const wrapper = render(<SingleSelectFacet {...getParams()} />);
    expect(wrapper.find(".sui-select__single-value").text()).toEqual("Range 2");
  });

  it("will correctly determine when no value is selected", () => {
    const wrapper = render(
      <SingleSelectFacet
        {...getParams()}
        doFilterValuesMatch={jest.fn().mockReturnValue(false)}
        options={valueFacetOptions}
        values={[]}
      />
    );
    expect(wrapper.find(".sui-select__single-value").text()).toEqual("");
  });
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <SingleSelectFacet {...getParams()} className={customClassName} />
  );
  const { className } = wrapper.props();
  expect(className).toEqual("sui-facet test-class");
});
