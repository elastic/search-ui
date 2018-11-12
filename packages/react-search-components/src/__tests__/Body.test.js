import React from "react";
import Body from "../Body";
import { shallow } from "enzyme";

const params = {
  sideContent: <div>Side</div>,
  bodyHeader: <div>Header</div>,
  bodyFooter: <div>Footer</div>
};

it("renders correctly", () => {
  const wrapper = shallow(
    <Body {...params}>
      <div>Main Content</div>
    </Body>
  );
  expect(wrapper).toMatchSnapshot();
});
