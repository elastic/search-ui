import React from "react";
import { shallow } from "enzyme";
import { ResultsPerPageContainer } from "../ResultsPerPage";
import type { ResultsPerPageViewProps } from "@elastic/react-search-ui-views";
import { useSearch } from "../../hooks";

jest.mock("../../hooks", () => ({
  useSearch: jest.fn()
}));

const params = {
  resultsPerPage: 20,
  setResultsPerPage: jest.fn()
};

beforeEach(() => {
  jest.clearAllMocks();

  (useSearch as jest.Mock).mockReturnValue(params);
});

it("supports a render prop", () => {
  const render = ({ value }: ResultsPerPageViewProps) => {
    return <div>{value}</div>;
  };
  const wrapper = shallow(<ResultsPerPageContainer view={render} />).dive();
  expect(wrapper).toMatchSnapshot();
});

it("will call back when a selection is made in the view", () => {
  let viewProps;

  shallow(
    <ResultsPerPageContainer
      {...params}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  ).dive();

  const { onChange } = viewProps;
  onChange(40);

  const resultsPerPage = params.setResultsPerPage.mock.calls[0][0];
  expect(resultsPerPage).toEqual(40);
});

it("passes className through to the view", () => {
  let viewProps;
  const className = "test-class";
  shallow(
    <ResultsPerPageContainer
      {...params}
      className={className}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  ).dive();
  expect(viewProps.className).toEqual(className);
});

it("renders the component with custom page options", () => {
  const options = [5, 10, 15];
  const resultsPerPage = 10;
  (useSearch as jest.Mock).mockReturnValue({
    ...params,
    resultsPerPage
  });
  const wrapper = shallow(<ResultsPerPageContainer options={options} />).dive();

  expect(wrapper).toMatchSnapshot();
});

it("passes data-foo through to the view", () => {
  let viewProps;
  const data = "bar";
  shallow(
    <ResultsPerPageContainer
      data-foo={data}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  ).dive();
  expect(viewProps["data-foo"]).toEqual(data);
});
