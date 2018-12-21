import React from "react";
import Facets from "../Facets";
import { shallow } from "enzyme";

it("renders correctly", () => {
  const wrapper = shallow(
    <Facets>
      <div>Children</div>
    </Facets>
  );
  expect(wrapper).toMatchSnapshot();
});
