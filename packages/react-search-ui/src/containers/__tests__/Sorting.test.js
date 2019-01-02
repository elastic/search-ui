import React from "react";
import { shallow } from "enzyme";
import { SortingContainer } from "../Sorting";
import { SortOption } from "../../types";

const params = {
  results: [{}],
  searchTerm: "test",
  setSort: jest.fn(),
  sortDirection: "asc",
  sortField: "field",
  sortOptions: [
    SortOption.create({
      name: "name",
      value: "field",
      direction: "asc"
    }),
    SortOption.create({
      name: "name",
      value: "field",
      direction: "desc"
    })
  ]
};

beforeEach(() => {
  params.setSort = jest.fn();
});

it("renders correctly", () => {
  const wrapper = shallow(<SortingContainer {...params} />);
  expect(wrapper).toMatchSnapshot();
});

it("supports a render prop", () => {
  // eslint-disable-next-line react/prop-types
  const render = ({ value }) => {
    return <div>{value}</div>;
  };
  const wrapper = shallow(<SortingContainer {...params} view={render} />);
  expect(wrapper.find(render).dive()).toMatchSnapshot();
});

it("renders empty when it doesn't have enough data", () => {
  const wrapper = shallow(
    <SortingContainer
      {...{
        ...params,
        searchTerm: "",
        results: []
      }}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

it("will call back when sort is changed in view", () => {
  const wrapper = shallow(<SortingContainer {...params} />);

  wrapper.find("Sorting").prop("onChange")("field|||desc");

  const [sortField, sortDirection] = params.setSort.mock.calls[0];
  expect(sortField).toEqual("field");
  expect(sortDirection).toEqual("desc");
});
