import React from "react";
import Sorting from "../Sorting";
import { shallow } from "enzyme";

const requiredProps = {
  onChange: () => {},
  options: [
    { name: "Name ASC", value: "name|||asc" },
    { name: "Name DESC", value: "name|||desc" }
  ]
};

it("renders correctly when there is a value", () => {
  const wrapper = shallow(<Sorting {...requiredProps} value={"name|||desc"} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when there is not a value", () => {
  const wrapper = shallow(<Sorting {...requiredProps} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <Sorting {...requiredProps} className={customClassName} />
  );
  const { className } = wrapper.props();
  expect(className).toEqual("sui-sorting test-class");
});
