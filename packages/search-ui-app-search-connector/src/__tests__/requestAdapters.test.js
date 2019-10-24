import { adaptRequest } from "../requestAdapters";

describe("adaptRequest", () => {
  it("adapts request", () => {
    expect(adaptRequest(request)).toEqual(adaptedRequest);
  });

  it("adapts empty request", () => {
    expect(adaptRequest(emptyRequest)).toEqual(adaptedEmptyRequest);
  });
});

const emptyRequest = {
  searchTerm: ""
};

const request = {
  searchTerm: "test",
  resultsPerPage: 10,
  current: 4,
  sortDirection: "asc",
  sortField: "title",
  filters: [
    {
      field: "initial",
      values: ["values"],
      type: "all",
      innerType: "any"
    },
    {
      field: "initial",
      values: ["more values"],
      type: "all",
      innerType: "any"
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
      type: "all",
      innerType: "any"
    },
    {
      field: "initial",
      values: ["additional values", "and values", "and even more values"],
      type: "all",
      innerType: "any"
    },
    {
      field: "initial",
      values: ["additional values", "and values", "and even more values"],
      type: "any",
      innerType: "any"
    },
    {
      field: "whatever",
      values: ["value"]
    }
  ]
};

const adaptedRequest = {
  query: "test",
  page: {
    size: 10,
    current: 4
  },
  sort: {
    title: "asc"
  },
  filters: {
    all: [
      {
        any: [{ initial: "values" }]
      },
      {
        any: [{ initial: "more values" }]
      },
      {
        any: [
          {
            test: {
              to: 100,
              from: 0
            }
          }
        ]
      },
      {
        any: [
          { initial: "additional values" },
          { initial: "and values" },
          { initial: "and even more values" }
        ]
      },
      {
        all: [{ whatever: "value" }]
      }
    ],
    any: [
      {
        any: [
          { initial: "additional values" },
          { initial: "and values" },
          { initial: "and even more values" }
        ]
      }
    ]
  }
};

const adaptedEmptyRequest = {
  query: "",
  page: {},
  filters: {}
};
