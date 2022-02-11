import { adaptRequest } from "../requestAdapters";

describe("adaptRequest", () => {
  it("adapts request", () => {
    expect(adaptRequest(request as any)).toEqual(adaptedRequest);
  });

  it("adapts sortList request", () => {
    expect(adaptRequest(sortListRequest as any)).toEqual(
      adaptedSortListRequest
    );
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
  sortDirection: "asc" as const,
  sortField: "title",
  filters: [
    {
      field: "initial",
      values: ["values"],
      type: "all" as const
    },
    {
      field: "initial",
      values: ["more values"],
      type: "all" as const
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
      type: "all" as const
    },
    {
      field: "initial",
      values: ["additional values", "and values", "and even more values"],
      type: "all" as const
    },
    {
      field: "initial",
      values: ["additional values", "and values", "and even more values"],
      type: "any" as const
    },
    {
      field: "whatever",
      values: ["value"]
      // TODO: is it possible to not have type here?
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

const sortListRequest = {
  ...request,
  sortList: [
    {
      field: "states",
      direction: "asc" as const
    },
    {
      field: "title",
      direction: "desc" as const
    }
  ],
  sortDirection: undefined,
  sortField: undefined
};

const adaptedSortListRequest = {
  ...adaptedRequest,
  sort: [{ states: "asc" }, { title: "desc" }]
};
