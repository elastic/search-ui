import { AutocompleteQueryConfig, RequestState } from "@elastic/search-ui";
import Searchkit, { SearchkitResponse } from "@searchkit/sdk";
import handleRequest from "../index";

const mockSearchkitResponse: SearchkitResponse = {
  summary: {
    query: "test",
    total: 100,
    appliedFilters: [],
    disabledFilters: [],
    sortOptions: []
  },
  hits: {
    page: {
      pageNumber: 0,
      size: 10,
      totalPages: 10,
      total: 100,
      from: 0
    },
    items: [
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
  },
  facets: []
};

jest.mock("@searchkit/sdk", () => {
  const originalModule = jest.requireActual("@searchkit/sdk");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    default: jest.fn((config) => {
      const sk = originalModule.default(config);
      sk.execute = jest.fn(() => mockSearchkitResponse);
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
    expect(searchkitRequestInstance.execute).toBeCalledWith({
      facets: false,
      hits: { from: 0, includeRawHit: true, size: 5 }
    });

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
        "autocompletedSuggestions": undefined,
      }
    `);
  });
});
