import React from "react";
import { render } from "@testing-library/react";
import ResultsPerPageContainer from "../ResultsPerPage";
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
  const renderProp = ({ value }: ResultsPerPageViewProps) => {
    return <div>{value}</div>;
  };
  const { container } = render(<ResultsPerPageContainer view={renderProp} />);
  expect(container).toMatchSnapshot();
});

it("will call back when a selection is made in the view", () => {
  let viewProps;

  render(
    <ResultsPerPageContainer
      {...params}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  );

  const { onChange } = viewProps;
  onChange(40);

  const resultsPerPage = params.setResultsPerPage.mock.calls[0][0];
  expect(resultsPerPage).toEqual(40);
});

it("passes className through to the view", () => {
  let viewProps;
  const className = "test-class";
  render(
    <ResultsPerPageContainer
      {...params}
      className={className}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  );
  expect(viewProps.className).toEqual(className);
});

it("renders the component with custom page options", () => {
  const options = [5, 10, 15];
  const resultsPerPage = 10;
  (useSearch as jest.Mock).mockReturnValue({
    ...params,
    resultsPerPage
  });
  const { container } = render(<ResultsPerPageContainer options={options} />);
  expect(container).toMatchSnapshot();
});

it("passes data-foo through to the view", () => {
  let viewProps;
  const data = "bar";
  render(
    <ResultsPerPageContainer
      data-foo={data}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  );
  expect(viewProps["data-foo"]).toEqual(data);
});
