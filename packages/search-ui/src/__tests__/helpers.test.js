import { helpers } from "..";
const doFilterValuesMatch = helpers.doFilterValuesMatch;

describe("doFilterValuesMatch", () => {
  describe("when matching simple values", () => {
    it("will match string", () => {
      expect(doFilterValuesMatch("filterValue", "filterValue")).toBe(true);
    });

    it("will not match different string", () => {
      expect(doFilterValuesMatch("filterValue", "filterValue1")).toBe(false);
    });

    it("will match number", () => {
      expect(doFilterValuesMatch(1, 1)).toBe(true);
    });

    it("will match different number", () => {
      expect(doFilterValuesMatch(1, 2)).toBe(false);
    });
  });

  describe("when matching falsey values", () => {
    it("will match empty string", () => {
      expect(doFilterValuesMatch("", "")).toBe(true);
    });

    it("will match 0", () => {
      expect(doFilterValuesMatch(0, 0)).toBe(true);
    });

    it("will match null", () => {
      expect(doFilterValuesMatch(null, null)).toBe(true);
    });

    it("will match undefined", () => {
      expect(doFilterValuesMatch(undefined, undefined)).toBe(true);
    });

    it("will not match different falsey values - 0 and ''", () => {
      expect(doFilterValuesMatch(0, "")).toBe(false);
    });
  });

  describe("when matching object based filter values", () => {
    it("will match objects", () => {
      const filterValue1 = { from: 1, to: 10 };
      const filterValue2 = { from: 1, to: 10 };
      expect(doFilterValuesMatch(filterValue1, filterValue2)).toBe(true);
    });

    it("will not match objects if they are different", () => {
      const filterValue1 = { from: 1, to: 10 };
      const filterValue2 = { from: 1, to: 12 };
      expect(doFilterValuesMatch(filterValue1, filterValue2)).toBe(false);
    });

    it("will not match objects if leafs are falsey matches", () => {
      const filterValue1 = { from: 1, to: 0 };
      const filterValue2 = { from: 1, to: "" };
      expect(doFilterValuesMatch(filterValue1, filterValue2)).toBe(false);
    });

    it("will not match objects through coercion", () => {
      const filterValue1 = { from: 1, to: 0 };
      const filterValue2 = { from: 1, to: "0" };
      expect(doFilterValuesMatch(filterValue1, filterValue2)).toBe(false);
    });

    it("will do a short-circuit match if 'name' matches", () => {
      const filterValue1 = { name: "The first option" };
      const filterValue2 = { from: 1, to: 10, name: "The first option" };
      expect(doFilterValuesMatch(filterValue1, filterValue2)).toBe(true);
    });

    it("will do a short-circuit match if 'name' matches as well as attributes", () => {
      const filterValue1 = { from: 1, to: 10, name: "The first option" };
      const filterValue2 = { from: 1, to: 10, name: "The first option" };
      expect(doFilterValuesMatch(filterValue1, filterValue2)).toBe(true);
    });

    it("will not do a short-circuit match if 'name' doesn't matches", () => {
      const filterValue1 = { name: "The first option" };
      const filterValue2 = { from: 1, to: 10, name: "The second option" };
      expect(doFilterValuesMatch(filterValue1, filterValue2)).toBe(false);
    });

    it("will not do a short-circuit match if 'name' isn't present", () => {
      const filterValue1 = { from: 1 };
      const filterValue2 = { from: 1, to: 10 };
      expect(doFilterValuesMatch(filterValue1, filterValue2)).toBe(false);
    });

    it("will match empty objects", () => {
      const filterValue1 = {};
      const filterValue2 = {};
      expect(doFilterValuesMatch(filterValue1, filterValue2)).toBe(true);
    });
  });
});
