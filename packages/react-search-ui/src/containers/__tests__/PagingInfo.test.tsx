import React from "react";
import { render } from "@testing-library/react";
import PagingInfoContainer from "../PagingInfo";
import { PagingInfoViewProps } from "@elastic/react-search-ui-views";
import { useSearch } from "../../hooks";

jest.mock("../../hooks", () => ({
  useSearch: jest.fn()
}));

const params = {
  pagingStart: 1,
  pagingEnd: 20,
  resultSearchTerm: "test",
  totalResults: 100
};

beforeEach(() => {
  jest.clearAllMocks();

  (useSearch as jest.Mock).mockReturnValue(params);
});

it("supports a render prop", () => {
  const renderProp = ({ start, end }: PagingInfoViewProps) => {
    return (
      <div>
        {start}
        {end}
      </div>
    );
  };
  const { container } = render(<PagingInfoContainer view={renderProp} />);
  expect(container).toMatchSnapshot();
});

it("renders when it doesn't have any results or a result search term", () => {
  (useSearch as jest.Mock).mockReturnValue({
    ...params,
    resultSearchTerm: ""
  });
  const { container } = render(<PagingInfoContainer />);
  expect(container).toMatchSnapshot();
});

it("passes className through to the view", () => {
  let viewProps: PagingInfoViewProps;
  const className = "test-class";
  render(
    <PagingInfoContainer
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
    <PagingInfoContainer
      data-foo={data}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  );
  expect(viewProps["data-foo"]).toEqual(data);
});
