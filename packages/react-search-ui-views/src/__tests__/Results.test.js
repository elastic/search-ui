import React from "react";
import { Results } from "..";
import { shallow } from "enzyme";

it("renders correctly", () => {
  const wrapper = shallow(
    <Results>
      <div>Children</div>
    </Results>
  ).dive("Results");
  expect(wrapper).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <Results className={customClassName}>
      <div>Children</div>
    </Results>
  ).dive("Results");
  const { className } = wrapper.props();
  expect(className).toEqual("sui-results-container test-class");
});
