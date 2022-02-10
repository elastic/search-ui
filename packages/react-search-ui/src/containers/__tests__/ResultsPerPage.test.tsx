import React from "react";
import { shallow } from "enzyme";
import { ResultsPerPageContainer } from "../ResultsPerPage";
import { ResultsPerPageViewProps } from "@elastic/react-search-ui-views";

const params = {
  results: [{}, {}],
  resultsPerPage: 20,
  searchTerm: "test",
  setResultsPerPage: jest.fn()
};

beforeEach(() => {
  params.setResultsPerPage = jest.fn();
});

it("supports a render prop", () => {
  const render = ({ value }: ResultsPerPageViewProps) => {
    return <div>{value}</div>;
  };
  const wrapper = shallow(
    <ResultsPerPageContainer {...params} view={render} />
  ).dive();
  expect(wrapper).toMatchSnapshot();
});

it("renders when it doesn't have any results or a search term", () => {
  const wrapper = shallow(
    <ResultsPerPageContainer
      {...{
        ...params,
        searchTerm: "",
        results: []
      }}
    />
  ).dive();
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
  const wrapper = shallow(
    <ResultsPerPageContainer {...{ ...params, resultsPerPage, options }} />
  ).dive();

  expect(wrapper).toMatchSnapshot();
});

it("passes data-foo through to the view", () => {
  let viewProps;
  const data = "bar";
  shallow(
    <ResultsPerPageContainer
      {...params}
      data-foo={data}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  ).dive();
  expect(viewProps["data-foo"]).toEqual(data);
});
