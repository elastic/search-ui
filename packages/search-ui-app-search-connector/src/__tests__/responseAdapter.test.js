import { adaptResponse } from "../responseAdapter";

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
      location: [
        {
          type: "range",
          data: [
            {
              to: 100,
              from: 0,
              name: "Nearby",
              count: 0
            },
            {
              to: 500,
              from: 100,
              name: "A longer drive.",
              count: 4
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

const responseWithEmptyFacetValue = {
  rawResults: [],
  info: {
    facets: {
      states: [
        {
          type: "value",
          data: [
            {
              value: "",
              count: 5
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

const responseWithZeroFacetValue = {
  rawResults: [],
  info: {
    facets: {
      states: [
        {
          type: "value",
          data: [
            {
              value: 0,
              count: 5
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
    location: [
      {
        type: "range",
        field: "location",
        data: [
          {
            count: 0,
            value: {
              to: 100,
              from: 0,
              name: "Nearby"
            }
          },
          {
            count: 4,
            value: {
              to: 500,
              from: 100,
              name: "A longer drive."
            }
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

const adaptedResponseWithEmptyFacetValue = {
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
            value: "",
            count: 5
          }
        ]
      }
    ]
  }
};

const adaptedResponseWithZeroFacetValue = {
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
            value: 0,
            count: 5
          }
        ]
      }
    ]
  }
};

const geoOptions = {
  additionalFacetValueFields: {
    location: {
      center: "73.102, -78.120",
      unit: "u"
    }
  }
};

describe("adaptResponse", () => {
  it("adapts response", () => {
    expect(adaptResponse(response)).toEqual(adaptedResponse);
  });

  it("adapts empty response", () => {
    expect(adaptResponse(emptyResponse)).toEqual(adaptedEmptyResponse);
  });

  it("adapts facets with empty values", () => {
    expect(adaptResponse(responseWithEmptyFacetValue)).toEqual(
      adaptedResponseWithEmptyFacetValue
    );
  });

  it("adapts facets with zero values", () => {
    expect(adaptResponse(responseWithZeroFacetValue)).toEqual(
      adaptedResponseWithZeroFacetValue
    );
  });

  it("will accept additional facet value fields to inject into response", () => {
    expect(adaptResponse(response, geoOptions).facets.location).toEqual([
      {
        type: "range",
        field: "location",
        data: [
          {
            count: 0,
            value: {
              center: "73.102, -78.120",
              unit: "u",
              to: 100,
              from: 0,
              name: "Nearby"
            }
          },
          {
            count: 4,
            value: {
              center: "73.102, -78.120",
              unit: "u",
              to: 500,
              from: 100,
              name: "A longer drive."
            }
          }
        ]
      }
    ]);
  });
});
