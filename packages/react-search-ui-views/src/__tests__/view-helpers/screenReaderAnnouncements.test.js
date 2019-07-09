import React from "react";
import { shallow } from "enzyme";
import { ScreenReaderStatus } from "../../view-helpers";

// Test helper
const getLiveRegion = document =>
  document.getElementById("search-ui-screen-reader-announcements");

it("creates a live screen reader region", () => {
  // Before init
  expect(getLiveRegion(document)).toBeNull();

  shallow(<ScreenReaderStatus render={() => null} />);

  // After init
  const region = getLiveRegion(document);
  expect(region).not.toBeNull();
  expect(region.getAttribute("role")).toEqual("status");
  expect(region.getAttribute("aria-live")).toEqual("polite");
  expect(region.style._values.overflow).toEqual("hidden");
});

it("renders children correctly", () => {
  const wrapper = shallow(
    <ScreenReaderStatus render={() => <div>Hello world</div>} />
  );

  expect(wrapper.text()).toEqual("Hello world");
});

it("updates the live region correctly via announceToScreenReader", () => {
  const wrapper = shallow(
    <ScreenReaderStatus
      render={announceToScreenReader => (
        <button onClick={() => announceToScreenReader("Hello world!")}>
          Foo
        </button>
      )}
    />
  );

  // Before update
  expect(getLiveRegion(document).innerText).toBeUndefined();

  wrapper.find("button").simulate("click");

  // After update
  expect(getLiveRegion(document).innerText).toEqual("Hello world!");
});
