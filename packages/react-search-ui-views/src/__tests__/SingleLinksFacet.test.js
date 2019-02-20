import React from "react";
import SingleLinksFacet from "../SingleLinksFacet";
import { shallow } from "enzyme";

const params = {
  label: "Facet",
  onRemove: () => {},
  onSelect: () => {},
  options: [{ value: "1", count: 1 }, { value: "2", count: 1 }],
  values: []
};

const rangeOptions = [
  {
    count: 1,
    value: {
      from: 1,
      to: 10,
      name: "The first option"
    }
  },
  {
    count: 11,
    value: {
      from: 11,
      to: 20,
      name: "The second option"
    }
  }
];

it("renders correctly", () => {
  const wrapper = shallow(<SingleLinksFacet {...params} />);
  expect(wrapper).toMatchSnapshot();
});

describe("determining selected option from values", () => {
  it("will correctly determine which of the options is selected based on the provided value", () => {
    const wrapper = shallow(<SingleLinksFacet {...params} values={["1"]} />);
    expect(wrapper.find("li").length).toBe(1);
    expect(wrapper.find("li").text()).toBe("1 (Remove)");
  });

  it("will correctly determine when no value is selected", () => {
    const wrapper = shallow(<SingleLinksFacet {...params} />);
    expect(wrapper.find("li").length).toBe(2);
  });

  it("will correctly determine which of the options is selected when using range filters", () => {
    const wrapper = shallow(
      <SingleLinksFacet
        {...params}
        options={rangeOptions}
        values={[
          {
            from: 1,
            to: 10,
            name: "The first option"
          }
        ]}
      />
    );
    expect(wrapper.find("li").length).toBe(1);
    expect(wrapper.find("li").text()).toBe("The first option (Remove)");
  });

  it("will correctly determine which of the options is selected even if the provided value has differently ordered props", () => {
    const wrapper = shallow(
      <SingleLinksFacet
        {...params}
        options={rangeOptions}
        values={[
          {
            to: 10, // Reversed
            from: 1, // Reversed
            name: "The first option"
          }
        ]}
      />
    );
    expect(wrapper.find("li").length).toBe(1);
    expect(wrapper.find("li").text()).toBe("The first option (Remove)");
  });
});
