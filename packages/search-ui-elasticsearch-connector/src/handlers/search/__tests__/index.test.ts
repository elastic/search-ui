import { RequestState, SearchQuery } from "@elastic/search-ui";
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
  facets: [
    {
      identifier: "another_field.keyword",
      display: "RefinementList",
      label: "another_field",
      entries: [
        { label: "label1", count: "10" },
        { label: "label2", count: "20" }
      ],
      type: "RefinmentList"
    },
    {
      identifier: "world_heritage_site.keyword",
      display: "RefinementList",
      label: "world heritage site",
      entries: [
        { label: "label3", count: "10" },
        { label: "label4", count: "20" }
      ],
      type: "RefinmentList"
    }
  ]
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

describe("Search results", () => {
  it("success", async () => {
    const state: RequestState = {
      searchTerm: "test"
    };
    const queryConfig: SearchQuery = {
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
      },
      facets: {
        "world_heritage_site.keyword": { type: "value" },
        "another_field.keyword": { type: "value" }
      },
      disjunctiveFacets: ["another_field.keyword"]
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
        "facets": Object {
          "another_field.keyword": Array [
            Object {
              "data": Array [
                Object {
                  "count": "10",
                  "value": "label1",
                },
                Object {
                  "count": "20",
                  "value": "label2",
                },
              ],
              "type": "value",
            },
          ],
          "world_heritage_site.keyword": Array [
            Object {
              "data": Array [
                Object {
                  "count": "10",
                  "value": "label3",
                },
                Object {
                  "count": "20",
                  "value": "label4",
                },
              ],
              "type": "value",
            },
          ],
        },
        "pagingEnd": 10,
        "pagingStart": 1,
        "rawResponse": null,
        "requestId": null,
        "resultSearchTerm": "test",
        "results": Array [
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
        "totalPages": 10,
        "totalResults": 100,
        "wasSearched": false,
      }
    `);
  });
});
