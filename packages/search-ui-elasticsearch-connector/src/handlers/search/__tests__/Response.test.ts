import type { ResponseState } from "@elastic/search-ui";
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
            description: "test",
            boolean_f: false,
            boolean_t: true,
            number_f: 0,
            number_t: 1,
            string_f: "",
            string_t: "badger"
          },
          highlight: {
            title: "hello",
            fieldOnlyHighlight: "test"
          },
          rawHit: {
            _id: "test"
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
          { label: "labeltest", count: 10 },
          { label: "label2", count: 20 }
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
                  "count": 10,
                  "value": "labeltest",
                },
                Object {
                  "count": 20,
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
            "_meta": Object {
              "id": "test",
              "rawHit": Object {
                "_id": "test",
              },
            },
            "boolean_f": Object {
              "raw": false,
            },
            "boolean_t": Object {
              "raw": true,
            },
            "description": Object {
              "raw": "test",
            },
            "fieldOnlyHighlight": Object {
              "snippet": "test",
            },
            "id": Object {
              "raw": "test",
            },
            "number_f": Object {
              "raw": 0,
            },
            "number_t": Object {
              "raw": 1,
            },
            "string_f": Object {
              "raw": "",
            },
            "string_t": Object {
              "raw": "badger",
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

  it("should transform Searchkit ResponseState when no facets are configured", () => {
    const response: ResponseState = SearchResponse({
      ...searchkitResponse,
      facets: null
    });

    expect(response.facets).toEqual({});
  });

  describe("paginStart", () => {
    it("should set 0 when total results are 0", () => {
      const response: ResponseState = SearchResponse({
        ...searchkitResponse,
        summary: {
          ...searchkitResponse.summary,
          total: 0
        }
      } as SearchkitResponse);

      expect(response.pagingStart).toEqual(0);
    });

    it("should calculate values when total results gt 0", () => {
      const response: ResponseState = SearchResponse({
        ...searchkitResponse,
        hits: {
          ...searchkitResponse.hits,
          page: {
            ...searchkitResponse.hits.page,
            pageNumber: 4,
            size: 10
          }
        }
      });

      expect(response.pagingStart).toEqual(41);
    });
  });
});
