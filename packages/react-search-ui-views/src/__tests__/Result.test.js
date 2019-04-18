import React from "react";
import Result from "../Result";
import { shallow } from "enzyme";

const TITLE_FIELD = "title";
const URL_FIELD = "url";
const TITLE_RESULT_VALUE = "Title";
const URL_RESULT_VALUE = "http://www.example.com";

const requiredProps = {
  result: { field: { raw: "value" } },
  onClickLink: () => {}
};

it("renders correctly when there is not a URL or title", () => {
  const wrapper = shallow(<Result {...requiredProps} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when there is a title", () => {
  const wrapper = shallow(
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
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when there is a titleField but it is not defined in result", () => {
  const wrapper = shallow(
    <Result {...{ ...requiredProps, titleField: TITLE_FIELD }} />
  );
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when there is a URL", () => {
  const wrapper = shallow(
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
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when there is a urlField but it is not defined in result", () => {
  const wrapper = shallow(
    <Result {...{ ...requiredProps, urlField: URL_FIELD }} />
  );
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when there is a title and url", () => {
  const wrapper = shallow(
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
  expect(wrapper).toMatchSnapshot();
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <Result className={customClassName} {...requiredProps} />
  );
  const { className } = wrapper.props();
  expect(className).toEqual("sui-result test-class");
});
