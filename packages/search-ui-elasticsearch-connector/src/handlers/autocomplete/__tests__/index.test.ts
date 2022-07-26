import type { AutocompleteQueryConfig, RequestState } from "@elastic/search-ui";
import Searchkit from "@searchkit/sdk";
import handleRequest from "../index";

const mockSearchkitResponse = [
  {
    identifier: "suggestions-completion-results",
    suggestions: ["sweaters", "sweatpants"]
  },
  {
    identifier: "suggestions-hits-popularQueries",
    hits: [
      {
        id: "acadia",
        fields: {
          query: "hello"
        },
        highlight: {
          query: "hello"
        },
        rawHit: {
          _id: "test"
        }
      }
    ]
  },
  {
    identifier: "hits-suggestions",
    hits: [
      {
        id: "test",
        fields: {
          title: "hello",
          description: "test"
        },
        highlight: {
          title: "hello"
        },
        rawHit: {
          _id: "test"
        }
      }
    ]
  }
];

jest.mock("@searchkit/sdk", () => {
  const originalModule = jest.requireActual("@searchkit/sdk");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    default: jest.fn((config) => {
      const sk = originalModule.default(config);
      sk.executeSuggestions = jest.fn(() => mockSearchkitResponse);
      return sk;
    })
  };
});

const state: RequestState = {
  searchTerm: "test"
};
const queryConfig: AutocompleteQueryConfig = {
  results: {
    resultsPerPage: 5,
    search_fields: {
      title: {
        weight: 2
      }
    },
    result_fields: {
      title: {
        snippet: {
          size: 100,
          fallback: true
        }
      },
      nps_link: {
        raw: {}
      }
    }
  },
  suggestions: {
    types: {
      results: {
        fields: ["title"]
      },
      popularQueries: {
        queryType: "results",
        search_fields: {
          title: {}
        },
        result_fields: {
          title: {
            raw: {}
          }
        }
      }
    }
  }
};

describe("Autocomplete results", () => {
  it("success", async () => {
    const results = await handleRequest({
      state,
      queryConfig,
      host: "http://localhost:9200",
      index: "test",
      connectionOptions: {
        apiKey: "test"
      }
    });

    const searchkitRequestInstance = (Searchkit as jest.Mock).mock.results[0]
      .value;
    expect(searchkitRequestInstance.executeSuggestions).toBeCalledWith("test");

    expect(results).toMatchInlineSnapshot(`
      Object {
        "autocompletedResults": Array [
          Object {
            "_meta": Object {
              "id": "test",
              "rawHit": Object {
                "_id": "test",
              },
            },
            "description": Object {
              "raw": "test",
            },
            "id": Object {
              "raw": "test",
            },
            "title": Object {
              "raw": "hello",
              "snippet": "hello",
            },
          },
        ],
        "autocompletedSuggestions": Object {
          "popularQueries": Array [
            Object {
              "queryType": "results",
              "result": Object {
                "_meta": Object {
                  "id": "test",
                  "rawHit": Object {
                    "_id": "test",
                  },
                },
                "id": Object {
                  "raw": "acadia",
                },
                "query": Object {
                  "raw": "hello",
                  "snippet": "hello",
                },
              },
            },
          ],
          "results": Array [
            Object {
              "suggestion": "sweaters",
            },
            Object {
              "suggestion": "sweatpants",
            },
          ],
        },
      }
    `);
  });

  it("should pass cloud configuration to searchkit", async () => {
    (Searchkit as jest.Mock).mockClear();
    const results = await handleRequest({
      state,
      queryConfig,
      cloud: {
        id: "cloudId"
      },
      index: "test",
      connectionOptions: {
        apiKey: "test"
      }
    });

    const searchkitRequestInstance = (Searchkit as jest.Mock).mock.results[0]
      .value;

    expect(searchkitRequestInstance.config.cloud).toEqual({
      id: "cloudId"
    });

    expect(searchkitRequestInstance.config.host).toBeUndefined();
  });

  it("should pass additional headers to searchkit", async () => {
    (Searchkit as jest.Mock).mockClear();
    const results = await handleRequest({
      state,
      queryConfig,
      host: "http://localhost:9200",
      index: "test",
      connectionOptions: {
        apiKey: "test",
        headers: {
          Authorization: "Bearer 123"
        }
      }
    });

    const searchkitRequestInstance = (Searchkit as jest.Mock).mock.results[0]
      .value;

    expect(searchkitRequestInstance.config.connectionOptions).toEqual({
      apiKey: "test",
      headers: {
        Authorization: "Bearer 123"
      }
    });
  });
});
