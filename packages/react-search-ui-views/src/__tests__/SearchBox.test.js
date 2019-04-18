import React from "react";
import SearchBox from "../SearchBox";
import { shallow } from "enzyme";

const requiredProps = {
  completeSuggestion: () => {},
  onChange: () => {},
  onSubmit: () => {},
  allAutocompletedItemsCount: 0,
  autocompletedResults: [],
  autocompletedSuggestions: {},
  autocompletedSuggestionsCount: 0,
  notifyAutocompleteSelected: () => {},
  value: "test"
};

it("renders correctly", () => {
  const wrapper = shallow(<SearchBox {...requiredProps} />);
  expect(wrapper).toMatchSnapshot();
});

it("applies 'focused' class when `isFocused` is true", () => {
  const wrapper = shallow(<SearchBox {...requiredProps} isFocused={true} />);
  const downshift = wrapper.dive("Downshift");
  const input = downshift.find(".sui-search-box__text-input");
  expect(input.hasClass("focus")).toBe(true);
});

it("passes through inputProps", () => {
  const wrapper = shallow(
    <SearchBox {...requiredProps} inputProps={{ placeholder: "test" }} />
  );
  expect(wrapper).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <SearchBox {...requiredProps} className={customClassName} />
  );

  const { className } = wrapper
    .dive()
    .find(".sui-search-box")
    .props();
  expect(className).toEqual("sui-search-box test-class");
});
