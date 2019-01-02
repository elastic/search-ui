import React from "react";
import Results from "../Results";
import { shallow } from "enzyme";

it("renders correctly", () => {
  const wrapper = shallow(
    <Results>
      <div>Children</div>
    </Results>
  );
  expect(wrapper).toMatchSnapshot();
});
