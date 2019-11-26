import React from "react";
import SingleLinksFacet from "../SingleLinksFacet";
import { shallow } from "enzyme";

const params = {
  label: "Facet",
  onRemove: () => {},
  onSelect: () => {},
  options: [
    { value: "1", count: 1, selected: false },
    { value: "2", count: 1, selected: false }
  ]
};

it("renders correctly", () => {
  const wrapper = shallow(<SingleLinksFacet {...params} />);
  expect(wrapper).toMatchSnapshot();
});

describe("determining selected option", () => {
  it("will correctly determine which of the options is selected", () => {
    const wrapper = shallow(
      <SingleLinksFacet
        {...params}
        options={[
          { value: "1", count: 1, selected: true },
          { value: "2", count: 1, selected: false }
        ]}
      />
    );
    expect(wrapper.find("li").length).toBe(1);
    expect(wrapper.find("li").text()).toBe("1 (Remove)");
  });

  // This shouldn't ever happen, but if it does, it should use the first selected value
  it("will used the first selected option when multiple options are selected", () => {
    const wrapper = shallow(
      <SingleLinksFacet
        {...params}
        options={[
          { value: "1", count: 1, selected: true },
          { value: "2", count: 1, selected: true }
        ]}
      />
    );
    expect(wrapper.find("li").length).toBe(1);
    expect(wrapper.find("li").text()).toBe("1 (Remove)");
  });

  it("will correctly determine when no value is selected", () => {
    const wrapper = shallow(
      <SingleLinksFacet
        {...params}
        options={[
          { value: "1", count: 1, selected: false },
          { value: "2", count: 1, selected: false }
        ]}
      />
    );
    expect(wrapper.find("li").length).toBe(2);
  });
});

it("renders with className prop applied", () => {
  const customClassName = "test-class";
  const wrapper = shallow(
    <SingleLinksFacet {...params} className={customClassName} />
  );
  const { className } = wrapper.props();
  expect(className).toEqual("sui-facet test-class");
});
