import React, { act } from "react";
import { render, waitFor, screen, RenderResult } from "@testing-library/react";
import FacetContainer from "../Facet";
import type { Filter } from "@elastic/search-ui";
import { useSearch } from "../../hooks";

jest.mock("../../hooks", () => ({
  useSearch: jest.fn()
}));

const View = () => <div />;

const filter: Filter = {
  field: "field1",
  values: ["field1value1"],
  type: "all"
};

const params = {
  view: View,
  field: "field1",
  label: "Field 1"
};

const mockSearchParams = {
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

(useSearch as jest.Mock).mockReturnValue(mockSearchParams);

beforeEach(() => {
  jest.clearAllMocks();
});

it("renders correctly", () => {
  const { container } = render(<FacetContainer {...params} />);
  expect(container).toMatchSnapshot();
});

it("should not render a Facet if there are no facets available", () => {
  (useSearch as jest.Mock).mockReturnValue({
    ...mockSearchParams,
    facets: {}
  });
  const { container } = render(<FacetContainer {...params} />);
  expect(container).toBeEmptyDOMElement();
});

describe("values view prop", () => {
  function subject(filterType?) {
    (useSearch as jest.Mock).mockReturnValue({
      ...mockSearchParams,
      filters: [
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
      ],
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
        ]
      }
    });
    let viewProps;
    const View = (props) => {
      viewProps = props;
      return <div />;
    };
    render(
      <FacetContainer
        {...params}
        field="field1"
        filterType={filterType}
        view={View}
      />
    );
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
  let viewProps;
  let renderResults: RenderResult;

  function subject(additionalProps = {}) {
    renderResults?.unmount();

    (useSearch as jest.Mock).mockReturnValue({
      ...mockSearchParams,
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
      }
    });

    const View = (props) => {
      viewProps = props;
      return <div data-testid="options-count">{props.options.length}</div>;
    };

    renderResults = render(
      <FacetContainer
        {...{
          ...params,
          field: "field1",
          view: View,
          ...additionalProps
        }}
      />
    );
  }

  beforeEach(() => {
    subject();
  });

  it("should limit options to 5 initially", () => {
    expect(screen.getByTestId("options-count")).toHaveTextContent("5");
  });

  it("should start at more than 5 initially if a show prop is passed", () => {
    const initialCount = 10;

    subject({ show: initialCount });

    expect(screen.getByTestId("options-count")).toHaveTextContent(
      initialCount.toString()
    );
  });

  it("should have a show more button", () => {
    expect(viewProps.showMore).toEqual(true);
  });

  describe("after a show more click", () => {
    beforeEach(async () => {
      await act(async () => {
        viewProps.onMoreClick();
      });
    });

    it("a11yNotify to be called with more filters", async () => {
      expect(mockSearchParams.a11yNotify).toHaveBeenCalledWith("moreFilters", {
        visibleOptionsCount: 15,
        showingAll: false
      });
    });

    it("should have 10 more options", async () => {
      await waitFor(() => {
        expect(screen.getByTestId("options-count")).toHaveTextContent("15");
      });
    });

    it("should still have a show more button", () => {
      expect(viewProps.showMore).toEqual(true);
    });
  });

  describe("after more more show more click", () => {
    beforeEach(async () => {
      await act(async () => {
        viewProps.onMoreClick();
      });

      await screen.findByText("15");

      await act(async () => {
        viewProps.onMoreClick();
      });
    });

    it("a11yNotify to be called with more filters", () => {
      expect(mockSearchParams.a11yNotify).toHaveBeenCalledWith("moreFilters", {
        visibleOptionsCount: 17,
        showingAll: true
      });
    });

    it("should be showing all options", async () => {
      await waitFor(() => {
        expect(screen.getByTestId("options-count")).toHaveTextContent("17");
      });
    });

    it("should hide the show more button", () => {
      expect(viewProps.showMore).toEqual(false);
    });
  });
});

it("will add a filter when a facet value is selected with onSelect", () => {
  let viewProps;
  const View = (props) => {
    viewProps = props;
    return <div />;
  };

  render(<FacetContainer {...params} filterType="any" view={View} />);

  viewProps.onSelect("field1value2");

  const [fieldName, fieldValue, filterType] =
    mockSearchParams.addFilter.mock.calls[0];
  expect(fieldName).toEqual("field1");
  expect(fieldValue).toEqual("field1value2");
  expect(filterType).toEqual("any");
});

it("will overwrite a filter when a facet value is selected with onChange", () => {
  let viewProps;
  const View = (props) => {
    viewProps = props;
    return <div />;
  };

  render(<FacetContainer {...params} filterType="any" view={View} />);

  viewProps.onChange("field1value2");

  const [fieldName, fieldValue, filterType] =
    mockSearchParams.setFilter.mock.calls[0];
  expect(fieldName).toEqual("field1");
  expect(fieldValue).toEqual("field1value2");
  expect(filterType).toEqual("any");
});

it("will remove a filter when a facet value removed", () => {
  let viewProps;
  const View = (props) => {
    viewProps = props;
    return <div />;
  };

  render(<FacetContainer {...params} filterType="any" view={View} />);

  viewProps.onRemove("field1value2");

  const [fieldName, fieldValue, filterType] =
    mockSearchParams.removeFilter.mock.calls[0];
  expect(fieldName).toEqual("field1");
  expect(fieldValue).toEqual("field1value2");
  expect(filterType).toEqual("any");
});

it("will remove a filter when a facet value removed, defaulting filterType to all", () => {
  let viewProps;
  const View = (props) => {
    viewProps = props;
    return <div />;
  };

  render(<FacetContainer {...params} view={View} />);

  viewProps.onRemove("field1value2");

  const [fieldName, fieldValue, filterType] =
    mockSearchParams.removeFilter.mock.calls[0];
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
  render(<FacetContainer {...params} className={className} view={View} />);
  expect(viewProps.className).toEqual(className);
});

it("passes data-foo through to the view", () => {
  let viewProps;
  const data = "bar";
  const View = (props) => {
    viewProps = props;
    return <div />;
  };
  render(<FacetContainer {...params} data-foo={data} view={View} />);
  expect(viewProps["data-foo"]).toEqual(data);
});

describe("search facets", () => {
  let viewProps;
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
    (useSearch as jest.Mock).mockReturnValue({
      ...mockSearchParams,
      facets: {
        field1: [
          {
            field,
            data,
            type: "value"
          }
        ]
      }
    });

    const View = (props) => {
      viewProps = props;
      return <div />;
    };

    return render(
      <FacetContainer
        {...{
          ...params,
          field,
          label,
          isFilterable: true,
          view: View,
          ...additionalProps
        }}
      />
    );
  }

  beforeEach(() => {
    subject();
  });

  it("should have a search input", () => {
    expect(viewProps.showSearch).toEqual(true);
  });

  it("should use the field name as a search input placeholder", () => {
    expect(viewProps.searchPlaceholder).toBe(`Filter ${label}`);
  });

  describe("after a search is performed", () => {
    it("should match Facet options that have an object value with name property", async () => {
      await act(async () => {
        viewProps.onSearch("0 to");
      });

      const filteredOptions = viewProps.options;

      expect(filteredOptions.length).toEqual(1);
      expect(filteredOptions.map((opt) => opt.value)).toEqual([
        {
          from: 0,
          to: 9,
          name: "0 to 9"
        }
      ]);
    });

    it("should match Facet options with/without accented characters", async () => {
      await act(async () => {
        viewProps.onSearch("ra");
      });

      const filteredOptions = viewProps.options;

      expect(filteredOptions.length).toEqual(2);
      expect(filteredOptions.map((opt) => opt.value)).toEqual([
        "Virat",
        "bumŗÄh"
      ]);
    });

    it("should not render Facet options if search value not matched", async () => {
      await act(async () => {
        viewProps.onSearch("MENT");
      });

      expect(viewProps.options.length).toEqual(0);
    });

    it("should ignore case sensitive when matching", async () => {
      const data = [
        { count: 20, value: "APPLE" },
        { count: 10, value: "appointment" },
        { count: 9, value: "entertainMEnt" }
      ];
      subject({}, data);

      // action => lowercase
      await act(async () => {
        viewProps.onSearch("app");
      });

      const options1 = viewProps.options;

      expect(options1.length).toEqual(2);
      expect(options1.map((opt) => opt.value)).toEqual([
        "APPLE",
        "appointment"
      ]);

      // action => uppercase
      await act(async () => {
        viewProps.onSearch("MENT");
      });

      const options2 = viewProps.options;

      expect(options1.length).toEqual(2);
      expect(options2.map((opt) => opt.value)).toEqual([
        "appointment",
        "entertainMEnt"
      ]);
    });
  });

  it("should not render Facet options if data value is not string", async () => {
    const data = [
      { count: 20, value: { a: 1, b: 1 } },
      { count: 10, value: [1, 2] },
      { count: 9, value: 123 },
      { count: 8, value: null }
    ];
    subject({}, data);

    await act(async () => {
      viewProps.onSearch("app");
    });
    const options = viewProps.options;

    expect(options.length).toEqual(0);
  });

  it("should hide the search input", () => {
    subject({ isFilterable: false });

    expect(viewProps.showSearch).toEqual(false);
  });

  it("should not clear persistent filters on select", () => {
    subject({
      persistent: true
    });

    viewProps.onSelect("field1value2");

    expect(mockSearchParams.addFilter).toHaveBeenCalledWith(
      "field1",
      "field1value2",
      "all",
      true
    );
    expect(mockSearchParams.setFilter).not.toHaveBeenCalled();
  });

  it("should not clear persistent filters on change", () => {
    subject({
      persistent: true
    });

    viewProps.onChange("field1value2");

    expect(mockSearchParams.setFilter).toHaveBeenCalledWith(
      "field1",
      "field1value2",
      "all",
      true
    );
    expect(mockSearchParams.addFilter).not.toHaveBeenCalled();
  });
});
