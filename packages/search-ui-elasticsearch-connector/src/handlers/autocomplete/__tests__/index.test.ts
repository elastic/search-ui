import { AutocompleteQueryConfig, RequestState } from "@elastic/search-ui";
import Searchkit from "@searchkit/sdk";
import handleRequest from "../index";

const mockSearchkitResponse = [
  {
    identifier: "results",
    suggestions: ["sweaters", "sweatpants"]
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

describe("Autocomplete results", () => {
  it("success", async () => {
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
          }
        }
      }
    };
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
});
