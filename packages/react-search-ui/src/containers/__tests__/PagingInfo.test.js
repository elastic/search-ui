import React from "react";
import { shallow } from "enzyme";
import { PagingInfoContainer } from "../PagingInfo";

const params = {
  current: 1,
  results: [{}, {}],
  resultsPerPage: 20,
  resultSearchTerm: "test",
  totalResults: 100
};

it("renders correctly", () => {
  const wrapper = shallow(<PagingInfoContainer {...params} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders empty when it doesn't have enough data", () => {
  const wrapper = shallow(
    <PagingInfoContainer
      {...{
        ...params,
        resultSearchTerm: "",
        results: []
      }}
    />
  );
  expect(wrapper).toMatchSnapshot();
});
