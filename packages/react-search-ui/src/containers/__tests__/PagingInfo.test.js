import React from "react";
import { shallow } from "enzyme";
import { PagingInfoContainer } from "../PagingInfo";

const params = {
  current: 1,
  results: [{}, {}],
  resultsPerPage: 20,
  resultSearchTerm: "test",
  totalResults: 100
};

it("supports a render prop", () => {
  // eslint-disable-next-line react/prop-types
  const render = ({ start, end }) => {
    return (
      <div>
        {start}
        {end}
      </div>
    );
  };
  const wrapper = shallow(<PagingInfoContainer {...params} view={render} />);
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
  );
  expect(wrapper).toMatchSnapshot();
});

it("passes className through to the view", () => {
  let viewProps;
  const className = "test-class";
  shallow(
    <PagingInfoContainer
      {...params}
      className={className}
      view={props => (viewProps = props)}
    />
  );
  expect(viewProps.className).toEqual(className);
});
