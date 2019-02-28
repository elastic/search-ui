import adaptResponse from "../responseAdapter";

describe("adaptResponse", () => {
  describe("adaptResponse", () => {
    it("adapts response", () => {
      expect(adaptResponse(response, "national-parks")).toEqual(
        adaptedResponse
      );
    });

    it("adapts empty response", () => {
      expect(adaptResponse(emptyResponse, "national-parks")).toEqual(
        adaptedEmptyResponse
      );
    });
  });
});

const response = {
  record_count: 2,
  records: {
    "national-parks": [
      {
        nps_link: "https://www.nps.gov/acad/index.htm",
        updated_at: "2018-11-13T21:51:11+00:00",
        states: ["Maine"],
        title: "Acadia",
        external_id: "9000",
        acres: 49057.36,
        _index: "5beb4099c9f929367efa5b7d",
        _type: "5beb4099c9f929367efa5b7c",
        _score: 0.7048211,
        _version: null,
        _explanation: null,
        sort: null,
        highlight: {
          title: "<em>Acadia</em>"
        },
        id: "5beb474f8db2315427beecc7"
      }
    ]
  },
  info: {
    "national-parks": {
      query: "acadia",
      current_page: 1,
      num_pages: 10,
      per_page: 20,
      total_result_count: 100,
      facets: {
        states: {
          Maine: 2
        }
      }
    }
  },
  errors: {}
};

const adaptedResponse = {
  results: [
    {
      nps_link: {
        raw: "https://www.nps.gov/acad/index.htm"
      },
      updated_at: {
        raw: "2018-11-13T21:51:11+00:00"
      },
      states: {
        raw: ["Maine"]
      },
      title: {
        raw: "Acadia",
        snippet: "<em>Acadia</em>"
      },
      external_id: {
        raw: "9000"
      },
      acres: {
        raw: 49057.36
      },
      id: {
        raw: "5beb474f8db2315427beecc7"
      }
    }
  ],
  totalPages: 10,
  totalResults: 100,
  requestId: "",
  facets: {
    states: [
      {
        type: "value",
        field: "states",
        data: [
          {
            value: "Maine",
            count: 2
          }
        ]
      }
    ]
  }
};
const emptyResponse = {
  record_count: 0,
  records: {
    "national-parks": []
  },
  info: {
    "national-parks": {
      query: "asdfp;laaisdfasldfkas;dlfkajsdf;laskjdf",
      current_page: 1,
      num_pages: 0,
      per_page: 20,
      total_result_count: 0,
      facets: {}
    }
  },
  errors: {}
};
const adaptedEmptyResponse = {
  requestId: "",
  results: [],
  totalPages: 0,
  totalResults: 0
};
