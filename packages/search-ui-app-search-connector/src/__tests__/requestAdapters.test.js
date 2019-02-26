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
      field: "initial",
      values: ["additional values", "and values", "and even more values"],
      type: "any"
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
        all: [{ initial: "values" }]
      },
      {
        all: [{ initial: "more values" }]
      },
      {
        all: [
          {
            test: {
              to: 100,
              from: 0
            }
          }
        ]
      },
      {
        all: [
          { initial: "additional values" },
          { initial: "and values" },
          { initial: "and even more values" }
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
        any: [{ whatever: "value" }]
      }
    ]
  }
};

const adaptedEmptyRequest = {
  query: "",
  page: {},
  filters: {}
};
