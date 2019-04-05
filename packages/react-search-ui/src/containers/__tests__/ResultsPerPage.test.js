import React from "react";
import { shallow } from "enzyme";
import { ResultsPerPageContainer } from "../ResultsPerPage";

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
  // eslint-disable-next-line react/prop-types
  const render = ({ value }) => {
    return <div>{value}</div>;
  };
  const wrapper = shallow(
    <ResultsPerPageContainer {...params} view={render} />
  );
  expect(wrapper).toMatchSnapshot();
});

it("renders empty when it doesn't have enough data", () => {
  const wrapper = shallow(
    <ResultsPerPageContainer
      {...{
        ...params,
        searchTerm: "",
        results: []
      }}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

it("will call back when a selection is made in the view", () => {
  let viewProps;

  shallow(
    <ResultsPerPageContainer {...params} view={props => (viewProps = props)} />
  );

  const { onChange } = viewProps;
  onChange(40);

  const resultsPerPage = params.setResultsPerPage.mock.calls[0][0];
  expect(resultsPerPage).toEqual(40);
});
