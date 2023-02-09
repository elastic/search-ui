import type { RequestState, SearchQuery } from "@elastic/search-ui";
import Searchkit, { SearchkitConfig, SearchkitResponse } from "@searchkit/sdk";
import type { SearchkitRequest } from "@searchkit/sdk";
import handleRequest from "../index";
import { EngineTransporter } from "../../transporter";

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
  facets: [
    {
      identifier: "another_field.keyword",
      display: "RefinementList",
      label: "another_field",
      entries: [
        { label: "label1", count: 10 },
        { label: "label2", count: 20 }
      ],
      type: "RefinmentList"
    },
    {
      identifier: "world_heritage_site.keyword",
      display: "RefinementList",
      label: "world heritage site",
      entries: [
        { label: "label3", count: 10 },
        { label: "label4", count: 20 }
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
    default: jest.fn((config: SearchkitConfig) => {
      const sk = originalModule.default(config);
      sk.execute = jest.fn(() => mockSearchkitResponse);
      return sk;
    })
  };
});

describe("Search results", () => {
  const searchkitMock = Searchkit as jest.Mock;

  beforeEach(() => {
    searchkitMock.mockClear();
  });

  const state: RequestState = {
    searchTerm: "test",
    resultsPerPage: 10,
    current: 1
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
    disjunctiveFacets: ["another_field.keyword"],
    filters: [
      {
        type: "none",
        field: "world_heritage_site.keyword",
        values: ["label3"]
      }
    ]
  };

  it("success", async () => {
    const results = await handleRequest({
      state,
      queryConfig,
      transporter: new EngineTransporter(
        "http://localhost:9200",
        "engineName",
        "test"
      )
    });

    const instance: SearchkitRequest = searchkitMock.mock.results[0].value;
    expect(instance.execute).toBeCalledWith(
      { facets: true, hits: { from: 0, includeRawHit: true, size: 10 } },
      [
        {
          bool: {
            must_not: [{ term: { "world_heritage_site.keyword": "label3" } }]
          }
        }
      ]
    );

    expect(results).toMatchInlineSnapshot(`
      Object {
        "facets": Object {
          "another_field.keyword": Array [
            Object {
              "data": Array [
                Object {
                  "count": 10,
                  "value": "label1",
                },
                Object {
                  "count": 20,
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
                  "count": 10,
                  "value": "label3",
                },
                Object {
                  "count": 20,
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
        "totalPages": 10,
        "totalResults": 100,
        "wasSearched": false,
      }
    `);
  });
});
