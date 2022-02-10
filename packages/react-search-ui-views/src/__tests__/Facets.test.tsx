import React from "react";
import Facets from "../Facets";
import { shallow } from "enzyme";

it("renders correctly", () => {
  const wrapper = shallow(
    <Facets>
      <div>Children</div>
    </Facets>
  );
  expect(wrapper).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <Facets className={customClassName}>
      <div>Children</div>
    </Facets>
  );
  const { className } = wrapper.props();
  expect(className).toEqual("sui-facet-container test-class");
});
