import React from "react";
import PagingInfo from "../PagingInfo";
import { shallow } from "enzyme";

it("renders correctly", () => {
  const wrapper = shallow(
    <PagingInfo end={20} searchTerm="grok" start={0} totalResults={1000} />
  );
  expect(wrapper).toMatchSnapshot();
});
