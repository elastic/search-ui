import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Result from "../Result";

const TITLE_FIELD = "title";
const URL_FIELD = "url";
const TITLE_RESULT_VALUE = "Title";
const URL_RESULT_VALUE = "http://www.example.com";
const ARBITRARY_FIELD = { _meta: "data" };

const requiredProps = {
  result: { field: { raw: "value" } },
  onClickLink: jest.fn()
};

it("renders correctly when there is not a URL or title", () => {
  const { container } = render(<Result {...requiredProps} />);
  expect(container).toMatchSnapshot();
});

it("renders correctly when there is a title", () => {
  const { container } = render(
    <Result
      {...{
        ...requiredProps,
        result: {
          ...requiredProps.result,
          [TITLE_FIELD]: { raw: TITLE_RESULT_VALUE }
        },
        titleField: TITLE_FIELD
      }}
    />
  );
  expect(container).toMatchSnapshot();
  expect(container.querySelector(".sui-result__title")).toHaveTextContent(
    TITLE_RESULT_VALUE
  );
});

it("renders correctly when there is a titleField but it is not defined in result", () => {
  const { container } = render(
    <Result {...{ ...requiredProps, titleField: TITLE_FIELD }} />
  );
  expect(container).toMatchSnapshot();
  expect(container.querySelector(".sui-result__title")).not.toBeInTheDocument();
});

it("renders correctly when there is a URL", () => {
  const { container } = render(
    <Result
      {...{
        ...requiredProps,
        result: {
          ...requiredProps.result,
          [URL_FIELD]: { raw: URL_RESULT_VALUE }
        },
        urlField: URL_FIELD
      }}
    />
  );
  expect(container).toMatchSnapshot();
  const link = container.querySelector(".sui-result__title-link");
  expect(link).toHaveAttribute("href", URL_RESULT_VALUE);
});

it("renders correctly when there is a urlField but it is not defined in result", () => {
  const { container } = render(
    <Result {...{ ...requiredProps, urlField: URL_FIELD }} />
  );
  expect(container).toMatchSnapshot();
  expect(
    container.querySelector(".sui-result__title-link")
  ).not.toBeInTheDocument();
});

it("renders correctly when there is a title and url", () => {
  const { container } = render(
    <Result
      {...{
        ...requiredProps,
        result: {
          ...requiredProps.result,
          [TITLE_FIELD]: { raw: TITLE_RESULT_VALUE },
          [URL_FIELD]: { raw: URL_RESULT_VALUE }
        },
        titleField: TITLE_FIELD,
        urlField: URL_FIELD
      }}
    />
  );
  expect(container).toMatchSnapshot();
  const link = container.querySelector(".sui-result__title-link");
  expect(link).toHaveAttribute("href", URL_RESULT_VALUE);
  expect(link).toHaveTextContent(TITLE_RESULT_VALUE);
});

it("filters out arbitrary fields from results, and does not render them", () => {
  const { container } = render(
    <Result
      {...{
        ...requiredProps,
        result: {
          ...requiredProps.result,
          ...ARBITRARY_FIELD
        }
      }}
    />
  );
  expect(container).toMatchSnapshot();
  expect(container.querySelector(".sui-result__key")).not.toHaveTextContent(
    "_meta"
  );
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const { container } = render(
    <Result className={customClassName} {...requiredProps} />
  );
  expect(container.firstChild).toHaveClass("sui-result", "test-class");
});

it("renders correctly when there is a malicious URL", () => {
  const { container } = render(
    <Result
      {...{
        ...requiredProps,
        result: {
          ...requiredProps.result,
          [URL_FIELD]: { raw: "javascript://test%0aalert(document.domain)" }
        },
        urlField: URL_FIELD
      }}
    />
  );
  expect(container).toMatchSnapshot();
  expect(
    container.querySelector(".sui-result__title-link")
  ).not.toBeInTheDocument();
});

it("calls onClickLink when clicking on the link", () => {
  const { container } = render(
    <Result
      {...{
        ...requiredProps,
        result: {
          ...requiredProps.result,
          [TITLE_FIELD]: { raw: TITLE_RESULT_VALUE },
          [URL_FIELD]: { raw: URL_RESULT_VALUE }
        },
        titleField: TITLE_FIELD,
        urlField: URL_FIELD
      }}
    />
  );
  const link = container.querySelector(".sui-result__title-link");
  fireEvent.click(link);
  expect(requiredProps.onClickLink).toHaveBeenCalled();
});
