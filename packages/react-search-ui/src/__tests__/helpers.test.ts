import { accentFold } from "../helpers";

describe("accentFold", () => {
  it("should remove accents marks from string", () => {
    expect(accentFold("ǟc̈ŗÄh")).toBe("acrAh");
    expect(accentFold("abc")).toBe("abc");
    expect(accentFold("ABC")).toBe("ABC");
    // anything other than string passed as argument should return empty string
    expect(accentFold(123)).toBe("");
    expect(accentFold({ a: 1, b: 2 })).toBe("");
    expect(accentFold([1, 2])).toBe("");
    expect(accentFold(null)).toBe("");
  });
});
