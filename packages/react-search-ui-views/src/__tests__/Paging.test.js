import React from "react";
import { Paging } from "..";
import { shallow } from "enzyme";

const params = {
  current: 1,
  onChange: () => {},
  resultsPerPage: 10,
  totalPages: 100
};

it("renders correctly", () => {
  const wrapper = shallow(<Paging {...params} />).dive("Paging");
  expect(wrapper).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <Paging className={customClassName} {...params} />
  ).dive("Paging");
  const { className } = wrapper.dive().props();
  expect(className).toEqual("rc-pagination sui-paging test-class");
});
