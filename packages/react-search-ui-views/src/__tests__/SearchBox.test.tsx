import React from "react";
import { render } from "@testing-library/react";
import SearchBox from "../SearchBox";
import { SearchBoxViewProps } from "../SearchBox";

const requiredProps: SearchBoxViewProps = {
  completeSuggestion: () => ({}),
  onChange: () => ({}),
  onSubmit: () => ({}),
  allAutocompletedItemsCount: 0,
  autocompletedResults: [],
  autocompletedSuggestions: {},
  autocompletedSuggestionsCount: 0,
  notifyAutocompleteSelected: () => ({}),
  value: "test",
  inputProps: {
    onFocus: () => {},
    onBlur: () => {}
  },
  isFocused: false,
  onSelectAutocomplete: jest.fn(),
  useAutocomplete: true
};

it("renders correctly", () => {
  const { container } = render(<SearchBox {...requiredProps} />);
  expect(container).toMatchSnapshot();
});

it("renders correctly with single autocompleteSuggestion configuration", () => {
  const { container } = render(
    <SearchBox
      {...requiredProps}
      autocompleteSuggestions={{ sectionTitle: "test" }}
    />
  );
  expect(container).toMatchSnapshot();
});

it("applies 'focused' class when `isFocused` is true", () => {
  const { container } = render(
    <SearchBox {...requiredProps} isFocused={true} />
  );
  const input = container.querySelector(".sui-search-box__text-input");
  expect(input).toHaveClass("focus");
});

it("passes through downshiftProps", () => {
  const { container } = render(
    <SearchBox
      {...requiredProps}
      inputProps={{
        placeholder: "test",
        onBlur: jest.fn(),
        onFocus: jest.fn()
      }}
    />
  );
  const input = container.querySelector(".sui-search-box__text-input");
  expect(input).toBeInTheDocument();
});

it("passes through inputProps", () => {
  const { container } = render(
    <SearchBox {...requiredProps} inputProps={{ placeholder: "test" }} />
  );
  const input = container.querySelector(".sui-search-box__text-input");
  expect(input).toHaveAttribute("placeholder", "test");
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const { container } = render(
    <SearchBox {...requiredProps} className={customClassName} />
  );
  expect(container.querySelector(".sui-search-box")).toHaveClass(
    "sui-search-box",
    "test-class"
  );
});

it("applies className from inputProps to input element", () => {
  const customClassName = "test-class";
  const { container } = render(
    <SearchBox {...requiredProps} inputProps={{ className: customClassName }} />
  );
  const input = container.querySelector(".sui-search-box__text-input");
  expect(input).toHaveClass("sui-search-box__text-input", "test-class");
});

describe("inputView prop", () => {
  let container, input, button;

  function setup() {
    const result = render(
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
    container = result.container;
    input = container.querySelector("input.some_custom_input_class");
    button = container.querySelector("input.some_custom_button_class");
  }

  it("will render a custom view just for the input section", () => {
    setup();
    expect(
      container.querySelector(".some_custom_wrapper_class")
    ).toBeInTheDocument();
  });

  describe("when getInputProps is used", () => {
    it("will render custom props on input", () => {
      setup();
      expect(input).toHaveClass("some_custom_input_class");
    });

    it("will not overwrite the base class on input", () => {
      setup();
      expect(input).toHaveClass("sui-search-box__text-input");
    });

    it("will render base props on input", () => {
      setup();
      expect(input).toHaveAttribute("placeholder", "Search");
    });
  });

  describe("when getButtonProps is used", () => {
    it("will render custom props on button", () => {
      setup();
      expect(button).toHaveClass("some_custom_button_class");
    });

    it("will not overwrite the base class on button", () => {
      setup();
      expect(button).toHaveClass("sui-search-box__submit");
    });

    it("will render base props on button", () => {
      setup();
      expect(button).toHaveAttribute("type", "submit");
    });
  });
});
