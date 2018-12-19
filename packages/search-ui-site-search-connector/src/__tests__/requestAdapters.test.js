import { adaptFacetConfig, adaptFilterConfig } from "../requestAdapters";

const valueFacet = {
  states: {
    type: "value",
    size: 30
  }
};

const rangeFacet = {
  acres: {
    type: "range",
    disjunctive: true,
    ranges: [
      {
        from: -1,
        name: "Any"
      },
      {
        from: 0,
        to: 1000,
        name: "Small"
      },
      {
        from: 1001,
        to: 100000,
        name: "Medium"
      },
      {
        from: 100001,
        name: "Large"
      }
    ]
  }
};

const filterConfig = {
  all: [
    { states: "Maine" },
    { states: "Georgia" },
    { national_landmark: "true" }
  ]
};

describe("requestAdapters", () => {
  describe("adaptFacetConfig", () => {
    it("adapts app config to site search facet config", () => {
      expect(adaptFacetConfig({ ...valueFacet })).toEqual(["states"]);
    });

    it("drops non value facets", () => {
      expect(adaptFacetConfig({ ...valueFacet, ...rangeFacet })).toEqual([
        "states"
      ]);
    });

    it("returns undefined if there are no facets after filtering", () => {
      expect(adaptFacetConfig({ ...rangeFacet })).toEqual(undefined);
    });
  });

  describe("adaptFilterConfig", () => {
    it("adapts app config to site search filter config", () => {
      expect(adaptFilterConfig(filterConfig)).toEqual({
        states: {
          type: "and",
          values: ["Maine", "Georgia"]
        },
        national_landmark: {
          type: "and",
          values: ["true"]
        }
      });
    });
  });
});
