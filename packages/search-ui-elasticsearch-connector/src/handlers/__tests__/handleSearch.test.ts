import type { RequestState, SearchQuery } from "@elastic/search-ui";
import type { ResponseBody } from "../../types";
import { handleSearch } from "../handleSearch";
import { IApiClientTransporter } from "../../transporter/ApiClientTransporter";

const mockResponse: ResponseBody = {
  took: 1,
  timed_out: false,
  _shards: {
    total: 1,
    successful: 1,
    skipped: 0,
    failed: 0
  },
  hits: {
    total: { value: 100, relation: "eq" },
    hits: [
      {
        _index: "test",
        _id: "test",
        _source: {
          title: "hello",
          description: "test"
        },
        highlight: {
          title: ["hello"]
        }
      }
    ]
  },
  aggregations: {
    "facet_bucket_another_field.keyword": {
      "another_field.keyword": {
        buckets: [
          { key: "label1", doc_count: 10 },
          { key: "label2", doc_count: 20 }
        ]
      }
    },
    "facet_bucket_world_heritage_site.keyword": {
      "world_heritage_site.keyword": {
        buckets: [
          { key: "label3", doc_count: 10 },
          { key: "label4", doc_count: 20 }
        ]
      }
    }
  }
};

class MockApiClientTransporter implements IApiClientTransporter {
  headers: Record<string, string> = {};

  async performRequest(): Promise<ResponseBody> {
    return mockResponse;
  }
}

describe("Search results", () => {
  let apiClient: MockApiClientTransporter;

  beforeEach(() => {
    apiClient = new MockApiClientTransporter();
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

  it("should return transformed search results", async () => {
    const postProcessRequestBodyFn = jest.fn(
      (body, requestState, queryConfig) => {
        expect(body).toBeDefined();
        expect(requestState.searchTerm).toBe("test");
        expect(queryConfig).toBeDefined();
        return body;
      }
    );

    const results = await handleSearch(
      state,
      queryConfig,
      apiClient,
      undefined,
      undefined,
      postProcessRequestBodyFn
    );

    expect(postProcessRequestBodyFn).toHaveBeenCalled();
    expect(results).toMatchInlineSnapshot(`
      {
        "facets": {
          "another_field.keyword": [
            {
              "data": [
                {
                  "count": 10,
                  "value": "label1",
                },
                {
                  "count": 20,
                  "value": "label2",
                },
              ],
              "field": "another_field.keyword",
              "type": "value",
            },
          ],
          "world_heritage_site.keyword": [
            {
              "data": [
                {
                  "count": 10,
                  "value": "label3",
                },
                {
                  "count": 20,
                  "value": "label4",
                },
              ],
              "field": "world_heritage_site.keyword",
              "type": "value",
            },
          ],
        },
        "pagingEnd": 10,
        "pagingStart": 1,
        "rawResponse": null,
        "requestId": null,
        "resultSearchTerm": "test",
        "results": [
          {
            "_meta": {
              "id": "test",
              "rawHit": {
                "_id": "test",
                "_index": "test",
                "_source": {
                  "description": "test",
                  "title": "hello",
                },
                "highlight": {
                  "title": [
                    "hello",
                  ],
                },
              },
            },
            "description": {
              "raw": "test",
            },
            "id": {
              "raw": "test",
            },
            "title": {
              "raw": "hello",
              "snippet": [
                "hello",
              ],
            },
          },
        ],
        "totalPages": 10,
        "totalResults": 100,
        "wasSearched": false,
      }
    `);
  });

  it("should handle empty search results", async () => {
    const emptyResponse: ResponseBody = {
      took: 1,
      timed_out: false,
      _shards: {
        total: 1,
        successful: 1,
        skipped: 0,
        failed: 0
      },
      hits: {
        total: { value: 0, relation: "eq" },
        hits: []
      },
      aggregations: {}
    };

    class EmptyResponseApiClient extends MockApiClientTransporter {
      async performRequest(): Promise<ResponseBody> {
        return emptyResponse;
      }
    }

    const results = await handleSearch(
      state,
      queryConfig,
      new EmptyResponseApiClient()
    );

    expect(results.results).toHaveLength(0);
    expect(results.totalResults).toBe(0);
    expect(results.totalPages).toBe(0);
  });

  it("should handle search errors", async () => {
    class ErrorApiClient extends MockApiClientTransporter {
      async performRequest(): Promise<ResponseBody> {
        throw new Error("Search failed");
      }
    }

    await expect(
      handleSearch(state, queryConfig, new ErrorApiClient())
    ).rejects.toThrow("Search failed");
  });

  it("should handle different facet types", async () => {
    const rangeFacetResponse: ResponseBody = {
      ...mockResponse,
      aggregations: {
        "facet_bucket_price_range.keyword": {
          "price_range.keyword": {
            buckets: [
              { key: "0-100", doc_count: 10 },
              { key: "100-200", doc_count: 20 }
            ]
          }
        }
      }
    };

    class RangeFacetApiClient extends MockApiClientTransporter {
      async performRequest(): Promise<ResponseBody> {
        return rangeFacetResponse;
      }
    }

    const rangeQueryConfig: SearchQuery = {
      ...queryConfig,
      facets: {
        "price_range.keyword": {
          type: "range",
          ranges: [
            { from: 0, to: 100, name: "0-100" },
            { from: 100, to: 200, name: "100-200" }
          ]
        }
      }
    };

    const results = await handleSearch(
      state,
      rangeQueryConfig,
      new RangeFacetApiClient()
    );

    expect(results.facets["price_range.keyword"]).toEqual([
      {
        data: [
          {
            count: 10,
            value: {
              from: 0,
              name: "0-100",
              to: 100
            }
          },
          {
            count: 20,
            value: {
              from: 100,
              name: "100-200",
              to: 200
            }
          }
        ],
        field: "price_range.keyword",
        type: "value"
      }
    ]);
  });

  it("should handle pagination correctly", async () => {
    const paginatedState: RequestState = {
      ...state,
      current: 2,
      resultsPerPage: 5
    };

    const results = await handleSearch(paginatedState, queryConfig, apiClient);

    expect(results.pagingStart).toBe(6);
    expect(results.pagingEnd).toBe(10);
  });

  it("should modify request body using custom interceptSearchRequest", async () => {
    const modifiedRequestBody = {
      query: {
        match_all: {}
      }
    };

    const mockPerformRequest = jest.fn().mockResolvedValue(mockResponse);
    const customApiClient = {
      ...apiClient,
      performRequest: mockPerformRequest
    };

    const customInterceptSearchRequest = jest.fn((_, next) => {
      return next(modifiedRequestBody);
    });

    await handleSearch(
      state,
      queryConfig,
      customApiClient,
      customInterceptSearchRequest
    );

    expect(customInterceptSearchRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        requestBody: expect.any(Object),
        requestState: state,
        queryConfig
      }),
      expect.any(Function)
    );
    expect(mockPerformRequest).toHaveBeenCalledWith(modifiedRequestBody);
  });
});
