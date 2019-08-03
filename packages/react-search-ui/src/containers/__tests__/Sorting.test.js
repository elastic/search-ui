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

it("supports a render prop", () => {
  // eslint-disable-next-line react/prop-types
  const render = ({ value }) => {
    return <div>{value}</div>;
  };
  const wrapper = shallow(<SortingContainer {...params} view={render} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders when it doesn't have results or a search term", () => {
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
  let viewProps;

  shallow(<SortingContainer {...params} view={props => (viewProps = props)} />);

  const { onChange } = viewProps;
  onChange("field|||desc");

  const [sortField, sortDirection] = params.setSort.mock.calls[0];
  expect(sortField).toEqual("field");
  expect(sortDirection).toEqual("desc");
});

it("passes className through to the view", () => {
  let viewProps;
  const className = "test-class";
  shallow(
    <SortingContainer
      {...params}
      className={className}
      view={props => (viewProps = props)}
    />
  );
  expect(viewProps.className).toEqual(className);
});

it("passes data-foo through to the view", () => {
  let viewProps;
  const data = "bar";
  shallow(
    <SortingContainer
      {...params}
      data-foo={data}
      view={props => (viewProps = props)}
    />
  );
  expect(viewProps["data-foo"]).toEqual(data);
});
