import React from "react";
import Facet from "../Facet";
import { shallow } from "enzyme";

const requiredProps = {
  name: "Facet",
  onRemove: () => {},
  onSelect: () => {},
  options: [{ value: "1", count: 1 }, { value: "2", count: 1 }]
};

it("renders correctly when a value is selected", () => {
  const wrapper = shallow(<Facet {...requiredProps} value="value" />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when a value is not selected", () => {
  const wrapper = shallow(<Facet {...requiredProps} />);
  expect(wrapper).toMatchSnapshot();
});
