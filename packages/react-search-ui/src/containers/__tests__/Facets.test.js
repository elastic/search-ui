import React from "react";
import { shallow } from "enzyme";
import { FacetsContainer } from "../Facets";

const params = {
  addFilter: jest.fn(),
  filters: [{ field: ["value"] }],
  facets: {
    field: [
      {
        data: [],
        type: "value"
      }
    ],
    another: [
      {
        data: [{ count: 10, value: "anotherValue" }],
        type: "value"
      }
    ],
    empty: [
      {
        data: [],
        type: "value"
      }
    ]
  },
  removeFilter: jest.fn()
};

beforeEach(() => {
  params.addFilter = jest.fn();
  params.removeFilter = jest.fn();
});

it("renders correctly", () => {
  const wrapper = shallow(<FacetsContainer {...params} />);
  expect(wrapper).toMatchSnapshot();
});

it("should not render a Facet if there are no options available", () => {
  const wrapper = shallow(<FacetsContainer {...params} />);
  // There are three facets
  expect(Object.keys(params.facets).length).toEqual(3);
  // But only 2 are rendered
  expect(wrapper.find("Facet").length).toEqual(2);
});

it("will call back when a facet value is selected", () => {
  const wrapper = shallow(<FacetsContainer {...params} />);

  wrapper
    .find("Facet")
    .at(1)
    .prop("onSelect")({
    clickEvent: {
      preventDefault: () => {}
    },
    value: "anotherValue"
  });

  const [fieldName, fieldValue] = params.addFilter.mock.calls[0];
  expect(fieldName).toEqual("another");
  expect(fieldValue).toEqual("anotherValue");
});

it("will call back when a facet value is removed", () => {
  const wrapper = shallow(<FacetsContainer {...params} />);

  wrapper
    .find("Facet")
    .at(0)
    .prop("onRemove")({
    clickEvent: {
      preventDefault: () => {}
    },
    value: "value"
  });

  const [fieldName, fieldValue] = params.removeFilter.mock.calls[0];
  expect(fieldName).toEqual("field");
  expect(fieldValue).toEqual("value");
});
