import React from "react";
import Result from "../Result";
import { shallow } from "enzyme";

const requiredProps = {
  fields: { field: "value" },
  onClickLink: () => {}
};

it("renders correctly when there is a URL", () => {
  const wrapper = shallow(
    <Result {...requiredProps} url="http://www.example.com" />
  );
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when there is not a URL or title", () => {
  const wrapper = shallow(<Result {...requiredProps} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when there is a title", () => {
  const wrapper = shallow(<Result {...requiredProps} title="Title" />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when there is a title and url", () => {
  const wrapper = shallow(
    <Result {...requiredProps} title="Title" url="http://www.example.com" />
  );
  expect(wrapper).toMatchSnapshot();
});
