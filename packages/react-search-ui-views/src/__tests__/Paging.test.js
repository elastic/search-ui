import React from "react";
import Paging from "../Paging";
import { shallow } from "enzyme";

const params = {
  current: 1,
  onChange: () => {},
  resultsPerPage: 10,
  totalPages: 100
};

it("renders correctly", () => {
  const wrapper = shallow(<Paging {...params} />);
  expect(wrapper).toMatchSnapshot();
});
