import React from "react";
import MultiValueFacet from "../MultiValueFacet";
import { shallow } from "enzyme";

const params = {
  label: "A Facet",
  onMoreClick: jest.fn(),
  onRemove: jest.fn(),
  onSelect: jest.fn(),
  options: [
    {
      value: "fieldValue1",
      count: 10
    },
    {
      value: "fieldValue2",
      count: 5
    }
  ],
  showMore: true,
  values: ["fieldValue2"]
};

it("renders", () => {
  const wrapper = shallow(<MultiValueFacet {...params} />);
  expect(wrapper).toMatchSnapshot();
});

it("won't render more if more param is false", () => {
  const wrapper = shallow(
    <MultiValueFacet
      {...{
        ...params,
        showMore: false
      }}
    />
  );
  expect(wrapper).toMatchSnapshot();
});
