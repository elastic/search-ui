import React from "react";
import { shallow } from "enzyme";
import { PagingContainer } from "../Paging";

const params = {
  current: 1,
  resultsPerPage: 20,
  setCurrent: jest.fn(),
  totalResults: 100
};

beforeEach(() => {
  params.setCurrent = jest.fn();
});

it("renders correctly", () => {
  const wrapper = shallow(<PagingContainer {...params} />);
  expect(wrapper).toMatchSnapshot();
});

it("limits total results if they would result in over 100 pages", () => {
  const wrapper = shallow(
    <PagingContainer
      {...{
        ...params,
        resultsPerPage: 10,
        totalResults: 398183013080
      }}
    />
  );

  expect(wrapper.find("Pagination").prop("total")).toEqual(1000);
});

it("renders empty when there are no results", () => {
  const wrapper = shallow(
    <PagingContainer
      {...{
        ...params,
        totalResults: 0
      }}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

it("will call back when a the page is changed", () => {
  const wrapper = shallow(<PagingContainer {...params} />);

  wrapper.find("Pagination").prop("onChange")(2);

  const current = params.setCurrent.mock.calls[0][0];
  expect(current).toEqual(2);
});
