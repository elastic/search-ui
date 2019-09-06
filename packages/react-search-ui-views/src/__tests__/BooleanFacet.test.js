import React from "react";
import BooleanFacet from "../BooleanFacet";
import { shallow, mount } from "enzyme";

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

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <BooleanFacet className={customClassName} {...params} />
  );
  const { className } = wrapper.props();
  expect(className.includes(customClassName)).toBe(true);
});

it("onChange is called on click", () => {
  const wrapper = mount(<BooleanFacet {...params} />);

  wrapper.find("input").simulate("change");
  expect(params.onChange).toHaveBeenCalledTimes(1);
});

it("onRemove is called on click", () => {
  params.values = ["true"];
  const wrapper = mount(<BooleanFacet {...params} />);

  wrapper.find("input").simulate("change");
  expect(params.onRemove).toHaveBeenCalledTimes(1);
});
