import React from "react";
import PagingInfo from "../PagingInfo";
import { shallow } from "enzyme";

const props = {
  end: 20,
  searchTerm: "grok",
  start: 0,
  totalResults: 1000
};

it("renders correctly", () => {
  const wrapper = shallow(<PagingInfo {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <PagingInfo className={customClassName} {...props} />
  );
  const { className } = wrapper.childAt(0).props();
  expect(className).toEqual("sui-paging-info test-class");
});

it("does not render a higher end than the total # of results", () => {
  const wrapper = shallow(<PagingInfo {...props} totalResults={15} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders ScreenReaderStatus with the correct message", () => {
  const announceToScreenReader = jest.fn();
  const wrapper = shallow(<PagingInfo {...props} start={41} end={80} />);

  wrapper.find("ScreenReaderStatus").prop("render")(announceToScreenReader);
  expect(announceToScreenReader).toHaveBeenCalledWith(
    'Showing 41 to 80 results out of 1000, searching for "grok".'
  );

  // Should not call out search term if one isn't present
  wrapper.setProps({ searchTerm: "" });
  wrapper.find("ScreenReaderStatus").prop("render")(announceToScreenReader);
  expect(announceToScreenReader).toHaveBeenCalledWith(
    "Showing 41 to 80 results out of 1000"
  );
});
