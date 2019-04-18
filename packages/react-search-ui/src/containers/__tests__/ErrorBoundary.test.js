import React from "react";
import { shallow } from "enzyme";
import { ErrorBoundaryContainer } from "../ErrorBoundary";

const params = {
  children: <div>Child</div>,
  error: "I am an error"
};

it("supports a render prop", () => {
  // eslint-disable-next-line react/prop-types
  const render = ({ error }) => {
    return <div>{error}</div>;
  };
  const wrapper = shallow(<ErrorBoundaryContainer {...params} view={render} />);
  expect(wrapper).toMatchSnapshot();
});

it("passes className through to the view", () => {
  let viewProps;
  const className = "test-class";
  shallow(
    <ErrorBoundaryContainer
      {...params}
      className={className}
      view={props => (viewProps = props)}
    />
  );
  expect(viewProps.className).toEqual(className);
});
