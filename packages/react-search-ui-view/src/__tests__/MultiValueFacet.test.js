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

it("will render 'more' button if more param is true", () => {
  const wrapper = shallow(
    <MultiValueFacet
      {...{
        ...params,
        showMore: true
      }}
    />
  );
  expect(wrapper.find(".sui-multi-value-facet__view-more")).toHaveLength(1);
});

it("won't render 'more' button if more param is false", () => {
  const wrapper = shallow(
    <MultiValueFacet
      {...{
        ...params,
        showMore: false
      }}
    />
  );
  expect(wrapper.find(".sui-multi-value-facet__view-more")).toHaveLength(0);
});
