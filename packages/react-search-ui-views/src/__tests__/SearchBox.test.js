import React from "react";
import SearchBox from "../SearchBox";
import { shallow } from "enzyme";

const requiredProps = {
  onChange: () => {},
  onSubmit: () => {},
  autocompletedResults: [],
  autocompletedSuggestions: {},
  value: "test"
};

it("renders correctly when `isFocused` is true", () => {
  const wrapper = shallow(<SearchBox {...requiredProps} isFocused={true} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when `isFocused` is false", () => {
  const wrapper = shallow(<SearchBox {...requiredProps} />);
  expect(wrapper).toMatchSnapshot();
});

it("passes through inputProps", () => {
  const wrapper = shallow(
    <SearchBox {...requiredProps} inputProps={{ placeholder: "test" }} />
  );
  expect(wrapper).toMatchSnapshot();
});
