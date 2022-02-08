import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import { shallow } from "enzyme";

const params = {
  children: <div>Child</div>,
  error: "I am an error"
};

it("renders an error when there is an error", () => {
  const wrapper = shallow(<ErrorBoundary {...params} />);
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
  );
  expect(wrapper).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <ErrorBoundary className={customClassName} {...params} />
  );
  const { className } = wrapper.props();
  expect(className).toEqual("sui-search-error test-class");
});
