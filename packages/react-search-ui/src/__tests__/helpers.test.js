import { accentFold } from "../helpers";

describe("accentFold", () => {
  it("should remove accents marks from string", () => {
    expect(accentFold("ǟc̈ŗÄh")).toBe("acrAh");
    expect(accentFold("abc")).toBe("abc");
    expect(accentFold("ABC")).toBe("ABC");
  });
});
