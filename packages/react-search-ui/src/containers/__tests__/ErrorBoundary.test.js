import React from "react";
import { shallow } from "enzyme";
import { ErrorBoundaryContainer } from "../ErrorBoundary";

const params = {
  children: <div>Child</div>,
  error: "I am an error"
};

it("renders correctly", () => {
  const wrapper = shallow(<ErrorBoundaryContainer {...params} />);
  expect(wrapper).toMatchSnapshot();
});
