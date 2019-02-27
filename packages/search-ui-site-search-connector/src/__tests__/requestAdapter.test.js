import adaptRequest from "../requestAdapter";

describe("adaptRequest", () => {
  it("adapts request", () => {
    expect(adaptRequest(request, queryConfig, "national-parks")).toEqual(
      adaptedRequest
    );
  });

  it("adapts empty request", () => {
    expect(adaptRequest(emptyRequest, {})).toEqual(adaptedEmptyRequest);
  });
});

const emptyRequest = {
  searchTerm: ""
};

const adaptedEmptyRequest = {
  q: ""
};

const queryConfig = {
  facets: {
    states: {
      type: "value",
      size: 30
    }
  },
  result_fields: {
    title: { raw: {}, snippet: { size: 20, fallback: true } }
  },
  search_fields: {
    title: {},
    description: {},
    states: {}
  }
};

const request = {
  searchTerm: "test",
  resultsPerPage: 10,
  current: 4,
  sortDirection: "asc",
  sortField: "title",
  result_fields: {
    title: { raw: {}, snippet: { size: 20, fallback: true } }
  },
  search_fields: {
    title: {},
    description: {},
    states: {}
  },
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
      field: "another",
      values: ["additional values", "and values", "and even more values"],
      type: "any"
    },
    {
      field: "whatever",
      values: ["value"]
    },
    {
      type: "none",
      field: "nunya",
      values: ["busi", "ness"]
    }
  ]
};

const adaptedRequest = {
  q: "test",
  page: 4,
  per_page: 10,
  fetch_fields: {
    "national-parks": ["title"]
  },
  search_fields: {
    "national-parks": ["title", "description", "states"]
  },
  highlight_fields: {
    "national-parks": {
      title: { size: 20, fallback: true }
    }
  },
  sort_direction: {
    "national-parks": "asc"
  },
  sort_field: {
    "national-parks": "title"
  },
  facets: { "national-parks": ["states"] },
  filters: {
    "national-parks": {
      initial: {
        type: "and",
        values: ["values"]
      },
      test: {
        type: "range",
        from: 0,
        to: 100
      },
      whatever: {
        type: "and",
        values: ["value"]
      }
    }
  }
};
