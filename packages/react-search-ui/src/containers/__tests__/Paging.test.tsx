import React from "react";
import { render } from "@testing-library/react";
import PagingContainer from "../Paging";
import { useSearch } from "../../hooks";

jest.mock("../../hooks", () => ({
  useSearch: jest.fn()
}));

const params = {
  current: 1,
  resultsPerPage: 20,
  setCurrent: jest.fn(),
  totalPages: 5
};

beforeEach(() => {
  jest.clearAllMocks();

  (useSearch as jest.Mock).mockReturnValue(params);
});

it("supports a render prop", () => {
  const renderProp = ({ current = 2 }) => {
    return <div>{current}</div>;
  };
  const { container } = render(<PagingContainer view={renderProp} />);
  expect(container).toMatchSnapshot();
});

it("renders empty when there are no results", () => {
  const view = () => <div />;
  (useSearch as jest.Mock).mockReturnValue({ ...params, totalPages: 0 });
  const { container } = render(<PagingContainer view={view} />);
  expect(container).toBeEmptyDOMElement();
});

it("will call back when a the page is changed", () => {
  let viewProps;

  render(
    <PagingContainer
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  );

  const { onChange } = viewProps;
  onChange(2);

  const current = params.setCurrent.mock.calls[0][0];
  expect(current).toEqual(2);
});

it("passes className through to the view", () => {
  let viewProps;
  const className = "test-class";
  render(
    <PagingContainer
      className={className}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  );
  expect(viewProps.className).toEqual(className);
});

it("passes data-foo through to the view", () => {
  let viewProps;
  const data = "bar";
  render(
    <PagingContainer
      data-foo={data}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  );
  expect(viewProps["data-foo"]).toEqual(data);
});
