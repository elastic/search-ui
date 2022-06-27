import { formatResult } from "../../view-helpers";

describe("formatResult", () => {
  it("should return the result", () => {
    expect(formatResult("test")).toEqual("test");
  });
});
