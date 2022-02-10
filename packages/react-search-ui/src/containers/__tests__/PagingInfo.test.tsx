import React from "react";
import { shallow } from "enzyme";
import { PagingInfoContainer } from "../PagingInfo";
import { PagingInfoViewProps } from "@elastic/react-search-ui-views";

const params = {
  pagingStart: 1,
  pagingEnd: 20,
  resultSearchTerm: "test",
  totalResults: 100
};

it("supports a render prop", () => {
  const render = ({ start, end }: PagingInfoViewProps) => {
    return (
      <div>
        {start}
        {end}
      </div>
    );
  };
  const wrapper = shallow(
    <PagingInfoContainer {...params} view={render} />
  ).dive();
  expect(wrapper).toMatchSnapshot();
});

it("renders when it doesn't have any results or a result search term", () => {
  const wrapper = shallow(
    <PagingInfoContainer
      {...{
        ...params,
        resultSearchTerm: "",
        results: []
      }}
    />
  ).dive();
  expect(wrapper).toMatchSnapshot();
});

it("passes className through to the view", () => {
  let viewProps: PagingInfoViewProps;
  const className = "test-class";
  shallow(
    <PagingInfoContainer
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

it("passes data-foo through to the view", () => {
  let viewProps;
  const data = "bar";
  shallow(
    <PagingInfoContainer
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
