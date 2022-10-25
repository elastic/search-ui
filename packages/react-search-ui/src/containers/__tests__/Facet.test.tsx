import React from "react";
import { FacetContainer } from "../Facet";
import { shallow, ShallowWrapper } from "enzyme";
import type { Filter } from "@elastic/search-ui";
import { FacetViewProps } from "@elastic/react-search-ui-views";

const View = () => <div />;

const filter: Filter = {
  field: "field1",
  values: ["field1value1"],
  type: "all"
};

const params = {
  view: View,
  field: "field1",
  label: "Field 1",
  filters: [filter],
  facets: {
    field1: [
      {
        field: "field1",
        data: [
          { count: 20, value: "field1value1" },
          { count: 10, value: "field1value2" }
        ],
        type: "value"
      }
    ],
    field2: [
      {
        field: "field2",
        data: [{ count: 10, value: "field2value1" }],
        type: "value"
      }
    ],
    field3: [
      {
        field: "field3",
        data: [],
        type: "value"
      }
    ]
  },
  addFilter: jest.fn(),
  removeFilter: jest.fn(),
  setFilter: jest.fn(),
  a11yNotify: jest.fn()
};

beforeEach(() => {
  jest.clearAllMocks();
});

it("renders correctly", () => {
  const wrapper = shallow(<FacetContainer {...params} />);
  expect(wrapper).toMatchSnapshot();
});

it("should not render a Facet if there are no facets available", () => {
  const wrapper = shallow(
    <FacetContainer
      {...{
        ...params,
        facets: {}
      }}
    />
  );

  expect(wrapper.html()).toEqual(null);
});

describe("values view prop", () => {
  function subject(filterType?) {
    let viewProps;
    const View = (props) => {
      viewProps = props;
      return <div />;
    };
    shallow(
      <FacetContainer
        {...params}
        field="field1"
        filterType={filterType}
        filters={[
          {
            field: "field2",
            values: ["field1value1"],
            type: "none"
          },
          {
            field: "field1",
            values: ["field1value1", "field1value2"],
            type: "all"
          },
          {
            field: "field1",
            values: ["field1value1"],
            type: "any"
          }
        ]}
        facets={{
          field1: [
            {
              field: "field1",
              data: [
                { count: 20, value: "field1value1" },
                { count: 10, value: "field1value2" }
              ],
              type: "value"
            }
          ]
        }}
        view={View}
      />
    ).dive();
    return viewProps;
  }
  it("should correctly calculated the selected facet options", () => {
    const { values } = subject();
    expect(values).toEqual(["field1value1", "field1value2"]);
  });

  it("should correctly calculated the selected facet options for filterType", () => {
    const { values } = subject("any");
    expect(values).toEqual(["field1value1"]);
  });
});

describe("show more", () => {
  let wrapper;

  function subject(additionalProps = {}) {
    return shallow(
      <FacetContainer
        {...{
          ...params,
          field: "field1",
          facets: {
            field1: [
              {
                field: "field1",
                data: [
                  { count: 20, value: "field1value1" },
                  { count: 10, value: "field1value2" },
                  { count: 9, value: "field1value3" },
                  { count: 8, value: "field1value4" },
                  { count: 7, value: "field1value5" },
                  { count: 6, value: "field1value6" },
                  { count: 5, value: "field1value7" },
                  { count: 4, value: "field1value8" },
                  { count: 3, value: "field1value9" },
                  { count: 2, value: "field1value10" },
                  { count: 1, value: "field1value11" },
                  { count: 1, value: "field1value12" },
                  { count: 1, value: "field1value13" },
                  { count: 1, value: "field1value14" },
                  { count: 1, value: "field1value15" },
                  { count: 1, value: "field1value16" },
                  { count: 1, value: "field1value17" }
                ],
                type: "value"
              }
            ]
          },
          ...additionalProps
        }}
      />
    );
  }

  beforeAll(() => {
    wrapper = subject();
  });

  it("should limit options to 5 initially", () => {
    expect(wrapper.find(View).prop("options").length).toEqual(5);
  });

  it("should start at more than 5 initially if a show prop is passed", () => {
    const initialCount = 10;
    const newWrapper = subject({ show: initialCount });
    expect(newWrapper.find(View).prop<[]>("options").length).toEqual(
      initialCount
    );
  });

  it("should have a show more button", () => {
    expect(wrapper.find(View).prop("showMore")).toEqual(true);
  });

  describe("after a show more click", () => {
    it("a11yNotify to be called with more filters", () => {
      wrapper.find(View).prop("onMoreClick")();
      expect(params.a11yNotify).toHaveBeenCalledWith("moreFilters", {
        visibleOptionsCount: 15,
        showingAll: false
      });
    });

    it("should have 10 more options", () => {
      expect(wrapper.find(View).prop("options").length).toEqual(15);
    });

    it("should still have a show more button", () => {
      expect(wrapper.find(View).prop("showMore")).toEqual(true);
    });
  });

  describe("after more more show more click", () => {
    it("a11yNotify to be called with more filters", () => {
      wrapper.find(View).prop("onMoreClick")();
      expect(params.a11yNotify).toHaveBeenCalledWith("moreFilters", {
        visibleOptionsCount: 17,
        showingAll: true
      });
    });

    it("should be showing all options", () => {
      expect(wrapper.find(View).prop("options").length).toEqual(17);
    });

    it("should hide the show more button", () => {
      expect(wrapper.find(View).prop("showMore")).toEqual(false);
    });
  });
});

it("will add a filter when a facet value is selected with onSelect", () => {
  const wrapper = shallow(<FacetContainer {...params} filterType="any" />);

  wrapper.find<FacetViewProps>(View).prop("onSelect")("field1value2");

  const [fieldName, fieldValue, filterType] = params.addFilter.mock.calls[0];
  expect(fieldName).toEqual("field1");
  expect(fieldValue).toEqual("field1value2");
  expect(filterType).toEqual("any");
});

it("will overwrite a filter when a facet value is selected with onChange", () => {
  const wrapper = shallow(<FacetContainer {...params} filterType="any" />);

  wrapper.find<FacetViewProps>(View).prop("onChange")("field1value2");

  const [fieldName, fieldValue, filterType] = params.setFilter.mock.calls[0];
  expect(fieldName).toEqual("field1");
  expect(fieldValue).toEqual("field1value2");
  expect(filterType).toEqual("any");
});

it("will remove a filter when a facet value removed", () => {
  const wrapper = shallow(<FacetContainer {...params} filterType="any" />);

  wrapper.find<FacetViewProps>(View).prop("onRemove")("field1value2");

  const [fieldName, fieldValue, filterType] = params.removeFilter.mock.calls[0];
  expect(fieldName).toEqual("field1");
  expect(fieldValue).toEqual("field1value2");
  expect(filterType).toEqual("any");
});

it("will remove a filter when a facet value removed, defaulting filterType to all", () => {
  const wrapper = shallow(<FacetContainer {...params} />);

  wrapper.find<FacetViewProps>(View).prop("onRemove")("field1value2");

  const [fieldName, fieldValue, filterType] = params.removeFilter.mock.calls[0];
  expect(fieldName).toEqual("field1");
  expect(fieldValue).toEqual("field1value2");
  expect(filterType).toEqual("all");
});

it("passes className through to the view", () => {
  let viewProps;
  const className = "test-class";
  const View = (props) => {
    viewProps = props;
    return <div />;
  };
  shallow(
    <FacetContainer {...params} className={className} view={View} />
  ).dive();
  expect(viewProps.className).toEqual(className);
});

it("passes data-foo through to the view", () => {
  let viewProps;
  const data = "bar";
  const View = (props) => {
    viewProps = props;
    return <div />;
  };
  shallow(<FacetContainer {...params} data-foo={data} view={View} />).dive();
  expect(viewProps["data-foo"]).toEqual(data);
});

describe("search facets", () => {
  let wrapper: ShallowWrapper;
  const field = "field1";
  const label = "field label";
  const fieldData = [
    { count: 20, value: "Virat" },
    { count: 9, value: "LÒpez" },
    { count: 8, value: "bumŗÄh" },
    { count: 7, value: { a: 1, b: 1 } },
    { count: 6, value: [1, 2] },
    { count: 5, value: 123 },
    { count: 4, value: null },
    {
      count: 4,
      value: {
        from: 0,
        to: 9,
        name: "0 to 9"
      }
    }
  ];

  function subject(additionalProps = {}, data = fieldData) {
    return shallow(
      <FacetContainer
        {...{
          ...params,
          field,
          label,
          facets: {
            field1: [
              {
                field,
                data,
                type: "value"
              }
            ]
          },
          isFilterable: true,
          ...additionalProps
        }}
      />
    );
  }

  beforeAll(() => {
    wrapper = subject();
  });

  it("should have a search input", () => {
    expect(wrapper.find(View).prop("showSearch")).toEqual(true);
  });

  it("should use the field name as a search input placeholder", () => {
    expect(wrapper.find(View).prop("searchPlaceholder")).toBe(
      `Filter ${label}`
    );
  });

  describe("after a search is performed", () => {
    it("should match Facet options that have an object value with name property", () => {
      wrapper.find<FacetViewProps>(View).prop("onSearch")("0 to");

      const filteredOptions = wrapper
        .find<FacetViewProps>(View)
        .prop("options");

      expect(filteredOptions.length).toEqual(1);
      expect(filteredOptions.map((opt) => opt.value)).toEqual([
        {
          from: 0,
          to: 9,
          name: "0 to 9"
        }
      ]);
    });

    it("should match Facet options with/without accented characters", () => {
      wrapper.find<FacetViewProps>(View).prop("onSearch")("ra");

      const filteredOptions = wrapper
        .find<FacetViewProps>(View)
        .prop("options");

      expect(filteredOptions.length).toEqual(2);
      expect(filteredOptions.map((opt) => opt.value)).toEqual([
        "Virat",
        "bumŗÄh"
      ]);
    });

    it("should ignore case sensitive when matching", () => {
      const data = [
        { count: 20, value: "APPLE" },
        { count: 10, value: "appointment" },
        { count: 9, value: "entertainMEnt" }
      ];
      const wrapper = subject({}, data);

      // action => lowercase
      wrapper.find<FacetViewProps>(View).prop("onSearch")("app");

      const options1 = wrapper.find<FacetViewProps>(View).prop("options");

      expect(options1.length).toEqual(2);
      expect(options1.map((opt) => opt.value)).toEqual([
        "APPLE",
        "appointment"
      ]);

      // action => uppercase
      wrapper.find<FacetViewProps>(View).prop("onSearch")("MENT");

      const options2 = wrapper.find<FacetViewProps>(View).prop("options");

      expect(options1.length).toEqual(2);
      expect(options2.map((opt) => opt.value)).toEqual([
        "appointment",
        "entertainMEnt"
      ]);
    });

    it("should not render Facet options if search value not matched", () => {
      wrapper.find<FacetViewProps>(View).prop("onSearch")("MENT");

      expect(wrapper.find<FacetViewProps>(View).prop("options").length).toEqual(
        0
      );
    });
  });

  it("should not render Facet options if data value is not string", () => {
    const data = [
      { count: 20, value: { a: 1, b: 1 } },
      { count: 10, value: [1, 2] },
      { count: 9, value: 123 },
      { count: 8, value: null }
    ];
    const wrapper = subject({}, data);

    wrapper.find<FacetViewProps>(View).prop("onSearch")("app");
    const options = wrapper.find<FacetViewProps>(View).prop("options");

    expect(options.length).toEqual(0);
  });

  it("should hide the search input", () => {
    const newWrapper = subject({ isFilterable: false });

    expect(newWrapper.find(View).prop("showSearch")).toEqual(false);
  });
});
