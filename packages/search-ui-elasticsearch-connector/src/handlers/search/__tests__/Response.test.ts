import { ResponseState } from "@elastic/search-ui";
import { SearchkitResponse } from "@searchkit/sdk";
import SearchResponse from "../Response";

describe("Search - Response", () => {
  const searchkitResponse: SearchkitResponse = {
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
            title: "hello",
            fieldOnlyHighlight: "test"
          }
        }
      ]
    },
    facets: [
      {
        identifier: "test",
        display: "RefinementList",
        label: "test",
        type: "value",
        entries: [
          { label: "labeltest", count: "10" },
          { label: "label2", count: "20" }
        ]
      }
    ]
  };

  it("should transform Searchkit ResponseState into SearchUI ResponseState", () => {
    const response: ResponseState = SearchResponse(searchkitResponse);

    expect(response).toMatchInlineSnapshot(`
      Object {
        "facets": Object {
          "test": Array [
            Object {
              "data": Array [
                Object {
                  "count": "10",
                  "value": "labeltest",
                },
                Object {
                  "count": "20",
                  "value": "label2",
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
            "fieldOnlyHighlight": Object {
              "snippet": "test",
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

  it("should transform Searchkit ResponseState Paging correctly", () => {
    let response: ResponseState = SearchResponse({
      ...searchkitResponse,
      hits: {
        ...searchkitResponse.hits,
        page: {
          ...searchkitResponse.hits.page,
          pageNumber: 1,
          size: 10
        }
      },
      summary: {
        ...searchkitResponse.summary,
        total: 100
      }
    });

    expect(response.pagingStart).toBe(11);
    expect(response.pagingEnd).toBe(20);

    response = SearchResponse({
      ...searchkitResponse,
      hits: {
        ...searchkitResponse.hits,
        page: {
          ...searchkitResponse.hits.page,
          pageNumber: 1,
          size: 10
        }
      },
      summary: {
        ...searchkitResponse.summary,
        total: 9
      }
    });

    expect(response.pagingStart).toBe(11);
    expect(response.pagingEnd).toBe(9);
  });
});
