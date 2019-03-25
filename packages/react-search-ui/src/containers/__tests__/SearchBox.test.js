import React from "react";
import { SearchBoxContainer } from "../SearchBox";
import { shallow } from "enzyme";

const params = {
  autocompletedResults: [],
  autocompletedSuggestions: {},
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

describe("useAutocomplete", () => {
  it("will be true  if autocompleteResults configuration has been provided", () => {
    const wrapper = shallow(
      <SearchBoxContainer
        {...params}
        autocompleteResults={{
          titleField: "title",
          urlField: "nps_link"
        }}
      />
    );
    wrapper.find("SearchBox").prop("onChange")("new term");
    expect(wrapper.find("SearchBox").prop("useAutocomplete")).toBe(true);
  });

  it("will be false if no autocomplete config has been provided", () => {
    const wrapper = shallow(<SearchBoxContainer {...params} />);
    wrapper.find("SearchBox").prop("onChange")("new term");
    expect(wrapper.find("SearchBox").prop("useAutocomplete")).toBe(false);
  });
});

it("will call back to setSearchTerm with refresh: false when input is changed", () => {
  const wrapper = shallow(<SearchBoxContainer {...params} />);

  expect(wrapper.find("SearchBox").prop("value")).toBe("test");

  wrapper.find("SearchBox").prop("onChange")("new term");

  const call = params.setSearchTerm.mock.calls[0];
  expect(call).toEqual([
    "new term",
    { refresh: false, autocompleteResults: false }
  ]);
});

it("will call back to setSearchTerm with refresh: true when input is changed and searchAsYouType is true", () => {
  const wrapper = shallow(
    <SearchBoxContainer {...params} searchAsYouType={true} />
  );

  expect(wrapper.find("SearchBox").prop("value")).toBe("test");

  wrapper.find("SearchBox").prop("onChange")("new term");

  const call = params.setSearchTerm.mock.calls[0];
  expect(call).toEqual([
    "new term",
    { refresh: true, debounce: 200, autocompleteResults: false }
  ]);
});

it("will call back to setSearchTerm with a specific debounce when input is changed and searchAsYouType is true and a debounce is provided", () => {
  const wrapper = shallow(
    <SearchBoxContainer
      {...params}
      searchAsYouType={true}
      debounceLength={500}
    />
  );

  expect(wrapper.find("SearchBox").prop("value")).toBe("test");

  wrapper.find("SearchBox").prop("onChange")("new term");

  const call = params.setSearchTerm.mock.calls[0];
  expect(call).toEqual([
    "new term",
    { refresh: true, debounce: 500, autocompleteResults: false }
  ]);
});

it("will call back to setSearchTerm with a specific debounce when input is changed and autocompleteResults is true and a debounce is provided", () => {
  const wrapper = shallow(
    <SearchBoxContainer
      {...params}
      autocompleteResults={{
        titleField: "title",
        urlField: "nps_link"
      }}
      debounceLength={500}
    />
  );

  expect(wrapper.find("SearchBox").prop("value")).toBe("test");

  wrapper.find("SearchBox").prop("onChange")("new term");

  const call = params.setSearchTerm.mock.calls[0];
  expect(call).toEqual([
    "new term",
    { refresh: false, debounce: 500, autocompleteResults: true }
  ]);
});

it("will call back setSearchTerm with refresh: true when form is submitted", () => {
  const wrapper = shallow(
    <SearchBoxContainer {...params} searchTerm="a term" />
  );

  wrapper.find("SearchBox").prop("onSubmit")({
    preventDefault: () => {}
  });

  const call = params.setSearchTerm.mock.calls[0];
  expect(call).toEqual(["a term"]);
});
