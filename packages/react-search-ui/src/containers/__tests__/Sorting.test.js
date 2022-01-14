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

const sortListParams = {
  ...params,
  sortList: [
    {
      field: "states",
      direction: "asc"
    },
    {
      field: "title",
      direction: "desc"
    }
  ],
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
    }),
    {
      name: "multiple",
      value: [
        {
          field: "states",
          direction: "asc"
        },
        {
          field: "title",
          direction: "desc"
        }
      ]
    }
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
  const wrapper = shallow(
    <SortingContainer {...params} view={render} />
  ).dive();
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
  ).dive();
  expect(wrapper).toMatchSnapshot();
});

it("will call back when sort is changed in view", () => {
  let viewProps;

  shallow(
    <SortingContainer {...params} view={props => (viewProps = props)} />
  ).dive();

  const { onChange } = viewProps;
  onChange("field|||desc");

  const [sortField, sortDirection] = params.setSort.mock.calls[0];
  expect(sortField).toEqual("field");
  expect(sortDirection).toEqual("desc");
});

it("will call back when sort is changed in view with sortList", () => {
  let viewProps;

  shallow(
    <SortingContainer {...sortListParams} view={props => (viewProps = props)} />
  ).dive();

  const { onChange } = viewProps;
  onChange(
    '[{"field":"states","direction":"asc"},{"field":"title","direction":"desc"}]'
  );

  expect(sortListParams.setSort).toHaveBeenCalledWith(
    [
      { direction: "asc", field: "states" },
      { direction: "desc", field: "title" }
    ],
    undefined
  );
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
  ).dive();
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
  ).dive();
  expect(viewProps["data-foo"]).toEqual(data);
});
