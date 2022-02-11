import {
  adaptFacetConfig,
  adaptFilterConfig,
  adaptResultFieldsConfig,
  adaptSearchFieldsConfig
} from "../requestAdapters";

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

describe("adaptFacetConfig", () => {
  it("adapts config to site search facet config", () => {
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
  it("adapts a single value all filter", () => {
    expect(
      adaptFilterConfig([
        {
          field: "test",
          values: ["values"],
          type: "all"
        }
      ])
    ).toEqual({
      test: {
        type: "and",
        values: ["values"]
      }
    });
  });

  it("adapts a multi-value all filter", () => {
    expect(
      adaptFilterConfig([
        {
          field: "test",
          values: ["values, more values"],
          type: "all"
        }
      ])
    ).toEqual({
      test: {
        type: "and",
        values: ["values, more values"]
      }
    });
  });

  it("adapts a single value range filter", () => {
    expect(
      adaptFilterConfig([
        {
          field: "test",
          values: [
            {
              to: 100,
              from: 0,
              name: "test"
            }
          ],
          type: "all"
        }
      ])
    ).toEqual({
      test: {
        type: "range",
        from: 0,
        to: 100
      }
    });
  });

  it("will adapt to an 'and' filter if type is missing", () => {
    expect(
      adaptFilterConfig([
        {
          field: "test",
          values: ["values"]
        }
      ])
    ).toEqual({
      test: {
        type: "and",
        values: ["values"]
      }
    });
  });

  it("will adapt 'any' filters", () => {
    expect(
      adaptFilterConfig([
        {
          field: "test",
          values: ["values"],
          type: "any"
        }
      ])
    ).toEqual({
      test: {
        values: ["values"]
      }
    });
  });

  it("will ignore 'none' filters", () => {
    expect(
      adaptFilterConfig([
        {
          field: "test",
          values: ["values"],
          type: "none"
        }
      ])
    ).toEqual({});
  });

  it("will ignore unknown filter types", () => {
    expect(
      adaptFilterConfig([
        {
          field: "test",
          values: ["values"],
          type: "whatever"
        }
      ])
    ).toEqual({});
  });

  it("will not process range filters that have more than 1 value", () => {
    expect(
      adaptFilterConfig([
        {
          field: "test",
          values: [
            {
              to: 100,
              from: 0,
              name: "test"
            },
            {
              to: 18,
              from: 20,
              name: "test"
            }
          ],
          type: "all"
        }
      ])
    ).toEqual({});
  });

  it("will not pass through unknown filter value types", () => {
    expect(
      adaptFilterConfig([
        {
          field: "test",
          values: [
            {
              invalid: "thing"
            }
          ],
          type: "all"
        }
      ])
    ).toEqual({});
  });

  it("will ignore filters if there is already a filter applied to a field", () => {
    expect(
      adaptFilterConfig([
        {
          field: "test",
          values: ["values"],
          type: "all"
        },
        {
          field: "test",
          values: ["more values"],
          type: "all"
        }
      ])
    ).toEqual({
      test: {
        type: "and",
        values: ["values"]
      }
    });
  });
});

describe("adaptResultFieldsConfig", () => {
  it("adapts config to site search fetch and highlight config", () => {
    expect(
      adaptResultFieldsConfig({
        title: { raw: {}, snippet: { size: 20, fallback: true } },
        description: { raw: {} }
      })
    ).toEqual([
      ["title", "description"],
      { title: { size: 20, fallback: true } }
    ]);
  });
});

describe("adaptSearchFieldsConfig", () => {
  it("adapts config to site search search fields config", () => {
    expect(
      adaptSearchFieldsConfig({
        title: {},
        description: {},
        states: {}
      })
    ).toEqual(["title", "description", "states"]);
  });
});
