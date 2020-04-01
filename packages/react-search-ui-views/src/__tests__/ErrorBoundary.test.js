import React from "react";
import { ErrorBoundary } from "..";
import { shallow } from "enzyme";

const params = {
  children: <div>Child</div>,
  error: "I am an error"
};

it("renders an error when there is an error", () => {
  const wrapper = shallow(<ErrorBoundary {...params} />).dive("ErrorBoundary");
  expect(wrapper).toMatchSnapshot();
});

it("renders children when there is no error", () => {
  const wrapper = shallow(
    <ErrorBoundary
      {...{
        ...params,
        error: ""
      }}
    />
  ).dive("ErrorBoundary");
  expect(wrapper).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <ErrorBoundary className={customClassName} {...params} />
  ).dive("ErrorBoundary");
  const { className } = wrapper.props();
  expect(className).toEqual("sui-search-error test-class");
});
