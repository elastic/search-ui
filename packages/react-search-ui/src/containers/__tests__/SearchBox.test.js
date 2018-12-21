import React from "react";
import { SearchBoxContainer } from "../SearchBox";
import { shallow } from "enzyme";

const params = {
  searchTerm: "test",
  setSearchTerm: jest.fn()
};

beforeEach(() => {
  params.setSearchTerm = jest.fn();
});

it("renders correctly", () => {
  const wrapper = shallow(<SearchBoxContainer {...params} />);
  expect(wrapper).toMatchSnapshot();
});

it("supports a render prop", () => {
  // eslint-disable-next-line react/prop-types
  const render = ({ value }) => {
    return <div>{value}</div>;
  };
  const wrapper = shallow(<SearchBoxContainer {...params} view={render} />);
  expect(wrapper.find(render).dive()).toMatchSnapshot();
});

it("will keep focus prop in sync with view component", () => {
  const wrapper = shallow(<SearchBoxContainer {...params} />);

  expect(wrapper.find("SearchBox").prop("isFocused")).toBe(false);

  wrapper
    .find("SearchBox")
    .prop("inputProps")
    ["onFocus"]();

  expect(wrapper.find("SearchBox").prop("isFocused")).toBe(true);

  wrapper
    .find("SearchBox")
    .prop("inputProps")
    ["onBlur"]();

  expect(wrapper.find("SearchBox").prop("isFocused")).toBe(false);
});

it("will keep value prop in sync with view component", () => {
  const wrapper = shallow(<SearchBoxContainer {...params} />);

  expect(wrapper.find("SearchBox").prop("value")).toBe("test");

  wrapper.find("SearchBox").prop("onChange")({
    currentTarget: {
      value: "new term"
    }
  });

  expect(wrapper.find("SearchBox").prop("value")).toBe("new term");
});

it("will call back when form is submitted", () => {
  const wrapper = shallow(<SearchBoxContainer {...params} />);

  wrapper.find("SearchBox").prop("onChange")({
    currentTarget: {
      value: "new term"
    }
  });

  wrapper.find("SearchBox").prop("onSubmit")({
    preventDefault: () => {}
  });

  const searchTerm = params.setSearchTerm.mock.calls[0][0];
  expect(searchTerm).toEqual("new term");
});
