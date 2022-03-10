import { AutocompleteQuery, RequestState } from "@elastic/search-ui";
import { SearchkitResponse } from "@searchkit/sdk";
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
    default: (config) => {
      const sk = originalModule.default(config);
      sk.execute = jest.fn(() => mockSearchkitResponse);
      return sk;
    }
  };
});

describe("Autocomplete results", () => {
  it("success", async () => {
    const state: RequestState = {
      searchTerm: "test"
    };
    const queryConfig: AutocompleteQuery = {
      results: {
        resultsPerPage: 5,
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
      },
      queryFields: ["title", "description"]
    });

    expect(results).toMatchInlineSnapshot(`
      Object {
        "autocompletedResults": Array [
          Object {
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
