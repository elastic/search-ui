import React from "react";
import { PagingInfo } from "..";
import { shallow } from "enzyme";

const props = {
  end: 20,
  searchTerm: "grok",
  start: 0,
  totalResults: 1000
};

it("renders correctly", () => {
  const wrapper = shallow(<PagingInfo {...props} />).dive("PagingInfo");
  expect(wrapper).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <PagingInfo className={customClassName} {...props} />
  ).dive("PagingInfo");
  const { className } = wrapper.props();
  expect(className).toEqual("sui-paging-info test-class");
});
