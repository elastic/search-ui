import React from "react";
import Paging from "../Paging";
import { shallow } from "enzyme";
import { PagingViewProps } from "../Paging";

const params = {
  current: 1,
  onChange: () => ({}),
  resultsPerPage: 10,
  totalPages: 100
};

it("renders correctly", () => {
  const wrapper = shallow(<Paging {...params} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow<typeof Paging>(
    <Paging className={customClassName} {...params} />
  );
  const { className } = wrapper.dive().props() as PagingViewProps;
  expect(className).toEqual("rc-pagination sui-paging test-class");
});
