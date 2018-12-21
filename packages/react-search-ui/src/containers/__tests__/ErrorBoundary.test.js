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

it("supports a render prop", () => {
  // eslint-disable-next-line react/prop-types
  const render = ({ error }) => {
    return <div>{error}</div>;
  };
  const wrapper = shallow(<ErrorBoundaryContainer {...params} view={render} />);
  expect(wrapper.find(render).dive()).toMatchSnapshot();
});
