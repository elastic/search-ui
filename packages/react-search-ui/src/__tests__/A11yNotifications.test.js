import defaultMessages from "../A11yNotifications";

it("outputs moreFilters correctly", () => {
  expect(
    defaultMessages.moreFilters({
      visibleOptionsCount: 15,
      showingAll: false
    })
  ).toEqual("15 options shown.");

  expect(
    defaultMessages.moreFilters({
      visibleOptionsCount: 28,
      showingAll: true
    })
  ).toEqual("All 28 options shown.");
});
