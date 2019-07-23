/**
 * @jest-environment jsdom
 */
import {
  getLiveRegion,
  announceToScreenReader,
  defaultMessages
} from "../A11yNotifications";

it("creates a live screen reader region", () => {
  // Before init
  let region = document.getElementById("search-ui-screen-reader-notifications");
  expect(region).toBeNull();

  // After init
  region = getLiveRegion();
  expect(region).not.toBeNull();
  expect(region.getAttribute("role")).toEqual("status");
  expect(region.getAttribute("aria-live")).toEqual("polite");
  expect(region.style._values.overflow).toEqual("hidden");
});

it("updates the live region correctly via announceToScreenReader", () => {
  announceToScreenReader("Hello world!");

  const region = document.getElementById(
    "search-ui-screen-reader-notifications"
  );
  expect(region.textContent).toEqual("Hello world!");
});

describe("defaultMessages", () => {
  it("outputs searchResults correctly", () => {
    expect(
      defaultMessages.searchResults({
        start: 1,
        end: 20,
        totalResults: 50,
        searchTerm: "foo"
      })
    ).toEqual('Showing 1 to 20 results out of 50, searching for "foo".');

    expect(
      defaultMessages.searchResults({
        start: 0,
        end: 0,
        totalResults: 0,
        searchTerm: ""
      })
    ).toEqual("Showing 0 to 0 results out of 0");
  });
});
