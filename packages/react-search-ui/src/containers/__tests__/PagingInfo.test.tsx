import React from "react";
import { shallow } from "enzyme";
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
  const render = ({ start, end }: PagingInfoViewProps) => {
    return (
      <div>
        {start}
        {end}
      </div>
    );
  };
  const wrapper = shallow(<PagingInfoContainer view={render} />).dive();
  expect(wrapper).toMatchSnapshot();
});

it("renders when it doesn't have any results or a result search term", () => {
  (useSearch as jest.Mock).mockReturnValue({
    ...params,
    resultSearchTerm: ""
  });
  const wrapper = shallow(<PagingInfoContainer />).dive();
  expect(wrapper).toMatchSnapshot();
});

it("passes className through to the view", () => {
  let viewProps: PagingInfoViewProps;
  const className = "test-class";
  shallow(
    <PagingInfoContainer
      className={className}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  ).dive();
  expect(viewProps.className).toEqual(className);
});

it("passes data-foo through to the view", () => {
  let viewProps;
  const data = "bar";
  shallow(
    <PagingInfoContainer
      data-foo={data}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  ).dive();
  expect(viewProps["data-foo"]).toEqual(data);
});
