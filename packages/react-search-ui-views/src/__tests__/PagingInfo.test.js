import React from "react";
import PagingInfo from "../PagingInfo";
import { shallow } from "enzyme";

const props = {
  end: 20,
  searchTerm: "grok",
  start: 0,
  totalResults: 1000
};

it("renders correctly", () => {
  const wrapper = shallow(<PagingInfo {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <PagingInfo className={customClassName} {...props} />
  );
  const { className } = wrapper.props();
  expect(className).toEqual("sui-paging-info test-class");
});

it("does not render a higher end than the total # of results", () => {
  const wrapper = shallow(<PagingInfo {...props} totalResults={15} />);
  expect(wrapper).toMatchSnapshot();
});
