import React from "react";
import { shallow } from "enzyme";
import { SortingContainer } from "../Sorting";
import { useSearch } from "../../hooks";

jest.mock("../../hooks", () => ({
  useSearch: jest.fn()
}));

const params = {
  results: [{}],
  searchTerm: "test",
  setSort: jest.fn(),
  sortDirection: "asc" as const,
  sortField: "field"
};

const sortListParams = {
  ...params,
  sortList: [
    {
      field: "states",
      direction: "asc" as const
    },
    {
      field: "title",
      direction: "desc" as const
    }
  ]
};
const props = {
  sortOptions: [
    {
      name: "name",
      value: "field",
      direction: "asc" as const
    },
    {
      name: "name",
      value: "field",
      direction: "desc" as const
    }
  ]
};

beforeEach(() => {
  jest.clearAllMocks();

  (useSearch as jest.Mock).mockReturnValue(params);
});

it("supports a render prop", () => {
  const render = ({ value }) => {
    return <div>{value}</div>;
  };
  const wrapper = shallow(<SortingContainer {...props} view={render} />).dive();
  expect(wrapper).toMatchSnapshot();
});

it("will call back when sort is changed in view", () => {
  let viewProps;

  shallow(
    <SortingContainer
      {...props}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  ).dive();

  const { onChange } = viewProps;
  onChange("field|||desc");

  const [sortField, sortDirection] = params.setSort.mock.calls[0];
  expect(sortField).toEqual("field");
  expect(sortDirection).toEqual("desc");
});

it("will call back when sort is changed in view with sortList", () => {
  let viewProps;
  (useSearch as jest.Mock).mockReturnValue(sortListParams);

  shallow(
    <SortingContainer
      {...props}
      sortOptions={[
        {
          name: "name",
          value: "field",
          direction: "asc" as const
        },
        {
          name: "name",
          value: "field",
          direction: "desc" as const
        },
        {
          name: "multiple",
          value: [
            {
              field: "states",
              direction: "asc" as const
            },
            {
              field: "title",
              direction: "desc" as const
            }
          ]
        }
      ]}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
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
      {...props}
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
    <SortingContainer
      {...props}
      data-foo={data}
      view={(props) => {
        viewProps = props;
        return <div />;
      }}
    />
  ).dive();
  expect(viewProps["data-foo"]).toEqual(data);
});
