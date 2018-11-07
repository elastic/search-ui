import React from "react";
import Body from "../Body";
import { shallow } from "enzyme";

it("renders correctly", () => {
  const wrapper = shallow(<Body />);
  expect(wrapper).toMatchSnapshot();
});
