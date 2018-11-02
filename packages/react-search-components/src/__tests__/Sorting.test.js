import React from "react";
import Sorting from "../Sorting";
import { shallow } from "enzyme";

const requiredProps = {
  onChange: () => {},
  options: [
    { name: "Name ASC", value: "name|||asc" },
    { name: "Name DESC", value: "name|||desc" }
  ]
};

it("renders correctly when there is a value", () => {
  const wrapper = shallow(<Sorting {...requiredProps} value={"name|||desc"} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when there is not a value", () => {
  const wrapper = shallow(<Sorting {...requiredProps} />);
  expect(wrapper).toMatchSnapshot();
});
