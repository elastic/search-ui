import React from "react";
import SingleSelectFacet from "../SingleSelectFacet";
import { shallow, render } from "enzyme";

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
  const wrapper = shallow(<SingleSelectFacet {...params} />);
  expect(wrapper).toMatchSnapshot();
});

describe("determining selected option", () => {
  it("will correctly determine which of the options is selected", () => {
    const wrapper = render(<SingleSelectFacet {...params} />);
    expect(wrapper.find(".sui-select__single-value").text()).toEqual("Range 1");
  });

  // This shouldn't ever happen, but if it does, it should use the first selected value
  it("will used the first selected option when multiple options are selected", () => {
    const wrapper = render(
      <SingleSelectFacet
        {...params}
        options={params.options.map(o => ({ ...o, selected: true }))}
      />
    );
    expect(wrapper.find(".sui-select__single-value").text()).toEqual("Range 1");
  });

  it("will correctly determine when no value is selected", () => {
    const wrapper = render(
      <SingleSelectFacet
        {...params}
        options={params.options.map(o => ({ ...o, selected: false }))}
      />
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
  expect(className).toEqual("sui-facet test-class");
});
