import { adaptFilters } from "../requestAdapters";

describe("adaptFilters", () => {
  it("adapts filters", () => {
    expect(adaptFilters(filters)).toEqual(adaptedFilters);
  });

  it("does not adapt if no filters", () => {
    expect(adaptFilters(undefined)).toEqual({});
  });

  it("does not adapt if an empty filters array", () => {
    expect(adaptFilters([])).toEqual({});
  });
});

const filters = [
  {
    field: "initial",
    values: ["values"],
    type: "all"
  },
  {
    field: "initial",
    values: ["more values"],
    type: "all"
  },
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
  },
  {
    field: "initial",
    values: ["additional values", "and values", "and even more values"],
    type: "all"
  },
  {
    field: "ord",
    values: ["value"],
    type: "or"
  },
  {
    field: "ord",
    values: ["value"]
  }
];

const adaptedFilters = {
  all: [
    {
      initial: ["values"]
    },
    {
      initial: ["more values"]
    },
    {
      test: {
        to: 100,
        from: 0
      }
    },
    {
      initial: ["additional values", "and values", "and even more values"]
    }
  ]
};
