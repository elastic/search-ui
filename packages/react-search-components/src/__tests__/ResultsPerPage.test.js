import React from "react";
import ResultsPerPage from "../ResultsPerPage";
import { shallow } from "enzyme";

const requiredProps = {
  onChange: () => {},
  options: [20, 40]
};

it("renders correctly when there is a selected value", () => {
  const wrapper = shallow(<ResultsPerPage {...requiredProps} value={40} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when there is not a selected value", () => {
  const wrapper = shallow(<ResultsPerPage {...requiredProps} />);
  expect(wrapper).toMatchSnapshot();
});
