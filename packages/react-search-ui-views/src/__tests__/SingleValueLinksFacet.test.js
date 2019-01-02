import React from "react";
import SingleValueLinksFacet from "../SingleValueLinksFacet";
import { shallow } from "enzyme";

const requiredProps = {
  label: "Facet",
  onRemove: () => {},
  onSelect: () => {},
  options: [{ value: "1", count: 1 }, { value: "2", count: 1 }]
};

it("renders correctly when a value is selected", () => {
  const wrapper = shallow(
    <SingleValueLinksFacet {...requiredProps} value="value" />
  );
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when a value is not selected", () => {
  const wrapper = shallow(<SingleValueLinksFacet {...requiredProps} />);
  expect(wrapper).toMatchSnapshot();
});
