import React from "react";
import { shallow } from "enzyme";
import { PagingContainer } from "../Paging";

const params = {
  current: 1,
  resultsPerPage: 20,
  setCurrent: jest.fn(),
  totalPages: 5
};

beforeEach(() => {
  params.setCurrent = jest.fn();
});

it("supports a render prop", () => {
  // eslint-disable-next-line react/prop-types
  const render = ({ current }) => {
    return <div>{current}</div>;
  };
  const wrapper = shallow(<PagingContainer {...params} view={render} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders empty when there are no results", () => {
  const wrapper = shallow(
    <PagingContainer
      {...{
        ...params,
        totalPages: 0
      }}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

it("will call back when a the page is changed", () => {
  let viewProps;

  shallow(<PagingContainer {...params} view={props => (viewProps = props)} />);

  const { onChange } = viewProps;
  onChange(2);

  const current = params.setCurrent.mock.calls[0][0];
  expect(current).toEqual(2);
});
