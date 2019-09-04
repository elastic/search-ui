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

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <BooleanFacet className={customClassName} {...params} />
  );
  const { className } = wrapper.props();
  expect(className.includes(customClassName)).toBe(true);
});
