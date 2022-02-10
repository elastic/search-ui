import React from "react";
import Sorting from "../Sorting";
import { shallow } from "enzyme";
import { SortingViewProps } from "../Sorting";

const requiredProps: SortingViewProps = {
  onChange: jest.fn(),
  options: [
    { label: "Name ASC", value: "name|||asc" },
    { label: "Name DESC", value: "name|||desc" }
  ],
  value: "name|||asc"
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
