import React from "react";
import { shallow } from "enzyme";

import LayoutSidebar from "../../layouts/LayoutSidebar";

beforeEach(() => {
  // This polyfill is required because enzyme/jsdom doesn't render innerText
  // @see https://github.com/jsdom/jsdom/issues/1245
  Object.defineProperty(global.Element.prototype, "innerText", {
    get() {
      return this.textContent;
    },
    configurable: true
  });
});

it("renders correctly", () => {
  const wrapper = shallow(
    <LayoutSidebar className="sui-layout-sidebar">Hello world!</LayoutSidebar>
  );
  expect(wrapper).toMatchSnapshot();
});

it("renders toggled class based on state", () => {
  const wrapper = shallow(
    <LayoutSidebar className="sui-layout-sidebar">Hello world!</LayoutSidebar>
  );
  wrapper.setState({ isSidebarToggled: true });

  expect(wrapper.find(".sui-layout-sidebar--toggled")).toHaveLength(1);
});

it("updates isSidebarToggled state on button click", () => {
  const wrapper = shallow(
    <LayoutSidebar className="sui-layout-sidebar">Hello world!</LayoutSidebar>
  );
  expect(wrapper.state("isSidebarToggled")).toEqual(false);
  const buttons = wrapper.find(".sui-layout-sidebar-toggle");

  buttons.first().simulate("click");
  expect(wrapper.state("isSidebarToggled")).toEqual(true);

  buttons.last().simulate("click");
  expect(wrapper.state("isSidebarToggled")).toEqual(false);
});

it("does not show the toggle buttons if there is no sidebar content", () => {
  // Completely empty sidebar
  const wrapper = shallow(<LayoutSidebar className="sui-layout-sidebar" />);
  expect(wrapper.find(".sui-layout-sidebar-toggle")).toHaveLength(0);

  // Effectively empty sidebar
  wrapper.setProps({ children: <span /> });
  expect(wrapper.find(".sui-layout-sidebar-toggle")).toHaveLength(0);
});
