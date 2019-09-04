import React from "react";
import BooleanFacet from "../BooleanFacet";
import { shallow } from "enzyme";

const params = {
  label: "A Facet",
  onRemove: jest.fn(),
  onChange: jest.fn(),
  options: [
    {
      value: "true",
      count: 10
    }
  ],
  values: []
};

it("renders", () => {
  const wrapper = shallow(<BooleanFacet {...params} />);
  expect(wrapper).toMatchSnapshot();
});

describe("determine selection", () => {
  it("will show count when Facet is not selected", () => {
    const wrapper = shallow(<BooleanFacet {...params} />);

    expect(wrapper.exists("span")).toBe(false);
  });

  it("will show X when Facet is selected", () => {
    const wrapper = shallow(<BooleanFacet {...params} />);
    wrapper.setProps({ values: ["true"] });

    expect(wrapper.exists("span")).toBe(true);
  });

  it("will show count once Facet is clicked twice", () => {
    const wrapper = shallow(<BooleanFacet {...params} />);

    //First click
    wrapper.setProps({ values: ["true"] });

    expect(wrapper.exists("span")).toBe(true);

    //Second click
    wrapper.setProps({ values: [] });
    expect(wrapper.exists("span")).toBe(false);
  });

  it("shows class 'selected' when Facet is selected", () => {
    const wrapper = shallow(<BooleanFacet {...params} />);

    wrapper.setProps({ values: ["true"] });

    expect(wrapper.find("div").props().className).toEqual("selected");
  });
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <BooleanFacet className={customClassName} {...params} />
  );
  const { className } = wrapper.props();
  expect(className).toEqual("test-class");
});
