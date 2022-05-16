import { Filter } from "..";
import { Rule } from "../ConditionalRules";

describe("Conditional Facet Rules", () => {
  const filters: Filter[] = [
    { field: "field1", values: ["value1"], type: "all" },
    { field: "field2", values: ["value2"], type: "all" },
    { field: "field3", values: ["value3"], type: "all" }
  ];

  describe("FilterIsSelected", () => {
    it("Facet has a filter present", () => {
      expect(Rule.FilterIsSelected("field1")({ filters })).toBe(true);
    });

    it("Facet has a filter present + value", () => {
      expect(Rule.FilterIsSelected("field1", "value1")({ filters })).toBe(true);
    });

    it("Facet does not have a filter present", () => {
      expect(Rule.FilterIsSelected("field4")({ filters })).toBe(false);
    });

    it("Facet has a filter present but not correct value", () => {
      expect(Rule.FilterIsSelected("field1", "value2")({ filters })).toBe(
        false
      );
    });
  });

  describe("FilterNotSelected", () => {
    it("Facet does not have a filter present", () => {
      expect(Rule.FilterNotSelected("field4")({ filters })).toBe(true);
      expect(Rule.FilterNotSelected("field1", "bla")({ filters })).toBe(true);
    });

    it("Facet does have a filter present", () => {
      expect(Rule.FilterNotSelected("field2")({ filters })).toBe(false);
      expect(Rule.FilterNotSelected("field1", "value1")({ filters })).toBe(
        false
      );
    });
  });

  describe("Must", () => {
    it("should satisfy all rules", () => {
      expect(
        Rule.Must([
          Rule.FilterIsSelected("field1"),
          Rule.FilterIsSelected("field2")
        ])({ filters })
      ).toBe(true);

      expect(
        Rule.Must([
          Rule.FilterIsSelected("field1"),
          Rule.FilterNotSelected("field4")
        ])({ filters })
      ).toBe(true);

      expect(
        Rule.Must([
          Rule.FilterIsSelected("field5"),
          Rule.FilterNotSelected("field4")
        ])({ filters })
      ).toBe(false);
    });
  });

  describe("Should", () => {
    it("should satisfy all rules", () => {
      expect(
        Rule.Should([
          Rule.FilterIsSelected("field1"),
          Rule.FilterIsSelected("field4")
        ])({ filters })
      ).toBe(true);

      expect(
        Rule.Should([
          Rule.FilterIsSelected("field4"),
          Rule.FilterNotSelected("field1")
        ])({ filters })
      ).toBe(false);
    });
  });
});
