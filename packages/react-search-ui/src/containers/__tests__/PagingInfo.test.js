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

it("does not render more than the total # of results", () => {
  const wrapper = shallow(<PagingInfoContainer {...params} totalResults={5} />);
  expect(wrapper.text()).toEqual("Showing 1 - 5 out of 5 for: test");

  wrapper.setProps({ current: 3, resultsPerPage: 5, totalResults: 12 });
  expect(wrapper.text()).toEqual("Showing 11 - 12 out of 12 for: test");

  wrapper.setProps({ totalResults: 15 });
  expect(wrapper.text()).toEqual("Showing 11 - 15 out of 15 for: test");

  wrapper.setProps({ totalResults: 0 });
  expect(wrapper.text()).toEqual("Showing 0 - 0 out of 0 for: test");
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
