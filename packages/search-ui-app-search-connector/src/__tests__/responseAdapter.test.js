import { adaptResponse } from "../responseAdapter";

describe("adaptResponse", () => {
  it("adapts response", () => {
    expect(adaptResponse(response)).toEqual(adaptedResponse);
  });

  it("adapts empty response", () => {
    expect(adaptResponse(emptyResponse)).toEqual(adaptedEmptyResponse);
  });
});

const response = {
  rawResults: [],
  info: {
    facets: {
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
            }
          ]
        }
      ]
    },
    meta: {
      request_id: "1234",
      page: {
        total_results: 100,
        total_pages: 10
      }
    }
  }
};

const emptyResponse = {
  rawResults: [],
  info: {
    meta: {
      request_id: "1234"
    }
  }
};

const adaptedResponse = {
  results: [],
  totalPages: 10,
  totalResults: 100,
  requestId: "1234",
  facets: {
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
          }
        ]
      }
    ]
  }
};

const adaptedEmptyResponse = { requestId: "1234", results: [] };
