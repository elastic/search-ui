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
  const downshift = wrapper
    .dive("Downshift")
    .find("SearchInput")
    .shallow();
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

it("applies className from inputProps to input element", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <SearchBox {...requiredProps} inputProps={{ className: customClassName }} />
  );

  const downshift = wrapper
    .dive("Downshift")
    .find("SearchInput")
    .shallow();
  const input = downshift.find(".sui-search-box__text-input");
  expect(input.props().className).toBe("sui-search-box__text-input test-class");
});

describe("inputView prop", () => {
  let wrapper, input, button;

  function setup() {
    wrapper = shallow(
      <SearchBox
        {...requiredProps}
        inputView={({ getAutocomplete, getInputProps, getButtonProps }) => {
          return (
            <>
              <div className="some_custom_wrapper_class">
                <input
                  {...getInputProps({
                    className: "some_custom_input_class"
                  })}
                />
                {getAutocomplete()}
                <input
                  {...getButtonProps({
                    className: "some_custom_button_class"
                  })}
                />
              </div>
            </>
          );
        }}
      />
    );

    input = wrapper
      .dive("Downshift")
      .find("inputView")
      .shallow()
      .find("input")
      .at(0);

    button = wrapper
      .dive("Downshift")
      .find("inputView")
      .shallow()
      .find("input")
      .at(1);
  }

  it("will render a custom view just for the input section", () => {
    setup();
    expect(
      wrapper
        .dive("Downshift")
        .find("inputView")
        .shallow()
        .find(".some_custom_wrapper_class")
    ).toHaveLength(1);
  });

  describe("when getInputProps is used", () => {
    it("will render custom props on input", () => {
      setup();
      expect(input.hasClass("some_custom_input_class")).toBe(true);
    });

    it("will not overwrite the base class on input", () => {
      setup();
      expect(input.hasClass("sui-search-box__text-input")).toBe(true);
    });

    it("will render base props on input", () => {
      setup();
      expect(input.props().placeholder).toBe("Search");
    });
  });

  describe("when getButtonProps is used", () => {
    it("will render custom props on button", () => {
      setup();
      expect(button.hasClass("some_custom_button_class")).toBe(true);
    });

    it("will not overwrite the base class on button", () => {
      setup();
      expect(button.hasClass("sui-search-box__submit")).toBe(true);
    });

    it("will render base props on button", () => {
      setup();
      expect(button.props().type).toBe("submit");
    });
  });
});
