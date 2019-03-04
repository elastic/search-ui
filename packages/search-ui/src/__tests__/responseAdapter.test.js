import { adaptFacets } from "../responseAdapter";

describe("adaptFacets", () => {
  it("adapts facets", () => {
    expect(adaptFacets(facets)).toEqual(adaptedFacets);
  });

  it("does not adapt if no facets", () => {
    expect(adaptFacets(undefined)).toEqual(undefined);
  });

  it("does not adapt if an empty facets map", () => {
    expect(adaptFacets({})).toEqual({});
  });
});

const facets = {
  states: [
    {
      type: "value",
      data: [
        {
          value: "Alaska",
          count: 5
        }
      ]
    }
  ],
  acres: [
    {
      type: "range",
      data: [
        {
          from: -1,
          name: "Any",
          count: 5
        },
        {
          to: 1000,
          from: 0,
          name: "Small",
          count: 0
        },
        {
          to: 100000,
          from: 1001,
          name: "Medium",
          count: 0
        },
        {
          from: 100001,
          name: "Large",
          count: 5
        }
      ]
    }
  ]
};

const adaptedFacets = {
  states: [
    {
      type: "value",
      field: "states",
      data: [
        {
          value: "Alaska",
          count: 5
        }
      ]
    }
  ],
  acres: [
    {
      type: "range",
      field: "acres",
      data: [
        {
          count: 5,
          value: {
            from: -1,
            name: "Any"
          }
        },
        {
          count: 0,
          value: {
            to: 1000,
            from: 0,
            name: "Small"
          }
        },
        {
          count: 0,
          value: {
            to: 100000,
            from: 1001,
            name: "Medium"
          }
        },
        {
          count: 5,
          value: {
            from: 100001,
            name: "Large"
          }
        }
      ]
    }
  ]
};
