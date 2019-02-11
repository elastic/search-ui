import { doesStateHaveResponseData } from "../test/helpers";

export function itResetsCurrent(fn) {
  const state = fn();
  it("resets current", () => {
    expect(state.current).toEqual(1);
  });
}

export function itResetsFilters(fn) {
  const state = fn();
  it("resets filters", () => {
    expect(state.filters).toEqual([]);
  });
}

export function itFetchesResults(fn) {
  it("fetches results", () => {
    const state = fn();
    expect(doesStateHaveResponseData(state)).toBe(true);
  });
}
