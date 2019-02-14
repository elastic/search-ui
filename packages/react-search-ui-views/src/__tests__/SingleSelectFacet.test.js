import React from "react";
import SingleSelectFacet from "../SingleSelectFacet";
import { shallow } from "enzyme";

const params = {
  label: "A Facet",
  onChange: jest.fn(),
  options: [
    {
      from: 1,
      to: 10,
      count: 20,
      name: "Range 1"
    },
    {
      from: 11,
      to: 20,
      count: 10,
      name: "Range 2"
    }
  ],
  values: [
    {
      from: 1,
      to: 10
    }
  ]
};

it("renders", () => {
  const wrapper = shallow(<SingleSelectFacet {...params} />);
  expect(wrapper).toMatchSnapshot();
});
