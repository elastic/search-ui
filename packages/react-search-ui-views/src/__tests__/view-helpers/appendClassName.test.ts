import { appendClassName } from "../../view-helpers";

it("will append a className", () => {
  expect(appendClassName("a", "b")).toBe("a b");
});

it("will handle an empty base className", () => {
  expect(appendClassName("", "b")).toBe("b");
});

it("will handle an empty new className", () => {
  expect(appendClassName("a")).toBe("a");
});

it("will handle a missing new className", () => {
  expect(appendClassName()).toBe("");
});

it("will accept an array", () => {
  expect(appendClassName("a", ["b", null, "", "c"])).toBe("a b c");
});
