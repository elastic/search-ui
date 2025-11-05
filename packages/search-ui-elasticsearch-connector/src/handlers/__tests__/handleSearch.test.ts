import type { RequestState, SearchQuery } from "@elastic/search-ui";
import type { ResponseBody, SearchResponseWithError } from "../../types";
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
        "rawResponse": {
          "_shards": {
            "failed": 0,
            "skipped": 0,
            "successful": 1,
            "total": 1,
          },
          "aggregations": {
            "facet_bucket_another_field.keyword": {
              "another_field.keyword": {
                "buckets": [
                  {
                    "doc_count": 10,
                    "key": "label1",
                  },
                  {
                    "doc_count": 20,
                    "key": "label2",
                  },
                ],
              },
            },
            "facet_bucket_world_heritage_site.keyword": {
              "world_heritage_site.keyword": {
                "buckets": [
                  {
                    "doc_count": 10,
                    "key": "label3",
                  },
                  {
                    "doc_count": 20,
                    "key": "label4",
                  },
                ],
              },
            },
          },
          "hits": {
            "hits": [
              {
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
            ],
            "total": {
              "relation": "eq",
              "value": 100,
            },
          },
          "timed_out": false,
          "took": 1,
        },
        "requestId": "",
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

  describe("Elasticsearch error handling", () => {
    it("should throw error with root_cause reason when available", async () => {
      const errorResponse: SearchResponseWithError = {
        ...mockResponse,
        error: {
          root_cause: [
            {
              type: "query_shard_exception",
              reason:
                "failed to create query: field:[test] was indexed without position data; cannot run PhraseQuery",
              index_uuid: "index_uuid",
              index: "index"
            }
          ],
          type: "search_phase_execution_exception",
          reason: "all shards failed",
          phase: "query",
          grouped: true,
          failed_shards: [
            {
              shard: 0,
              index: "index",
              node: "node",
              reason: {
                type: "query_shard_exception",
                reason:
                  "failed to create query: field:[test] was indexed without position data; cannot run PhraseQuery",
                index_uuid: "index_uuid",
                index: "index",
                caused_by: {
                  type: "illegal_state_exception",
                  reason:
                    "field:[test] was indexed without position data; cannot run PhraseQuery"
                }
              }
            }
          ]
        }
      };

      class ElasticsearchErrorApiClient extends MockApiClientTransporter {
        async performRequest(): Promise<SearchResponseWithError> {
          return errorResponse;
        }
      }

      const errorPromise = handleSearch(
        state,
        queryConfig,
        new ElasticsearchErrorApiClient()
      );

      await expect(errorPromise).rejects.toThrow(
        "failed to create query: field:[test] was indexed without position data; cannot run PhraseQuery"
      );

      await expect(errorPromise).rejects.toMatchObject({
        elasticsearchError: errorResponse.error
      });

      const error = await errorPromise.catch((e) => e);
      expect(error.elasticsearchError.root_cause).toHaveLength(1);
      expect(error.elasticsearchError.root_cause?.[0].type).toBe(
        "query_shard_exception"
      );
      expect(error.elasticsearchError.failed_shards).toHaveLength(1);
      expect(error.elasticsearchError.failed_shards?.[0].shard).toBe(0);
    });

    it("should fall back to main error reason when root_cause is not available", async () => {
      const errorResponse: SearchResponseWithError = {
        ...mockResponse,
        error: {
          type: "parsing_exception",
          reason: "Unknown query [invalid_query]"
        }
      };

      class ElasticsearchErrorApiClient extends MockApiClientTransporter {
        async performRequest(): Promise<SearchResponseWithError> {
          return errorResponse;
        }
      }

      const errorPromise = handleSearch(
        state,
        queryConfig,
        new ElasticsearchErrorApiClient()
      );

      await expect(errorPromise).rejects.toThrow(
        "Unknown query [invalid_query]"
      );

      await expect(errorPromise).rejects.toMatchObject({
        elasticsearchError: errorResponse.error
      });

      const error = await errorPromise.catch((e) => e);
      expect(error.elasticsearchError.type).toBe("parsing_exception");
    });

    it("should use default error message when no reason is available", async () => {
      const errorResponse: SearchResponseWithError = {
        ...mockResponse,
        error: {
          type: "unknown_exception"
        } as any
      };

      class ElasticsearchErrorApiClient extends MockApiClientTransporter {
        async performRequest(): Promise<SearchResponseWithError> {
          return errorResponse;
        }
      }

      const errorPromise = handleSearch(
        state,
        queryConfig,
        new ElasticsearchErrorApiClient()
      );

      await expect(errorPromise).rejects.toThrow("Elasticsearch search failed");

      await expect(errorPromise).rejects.toMatchObject({
        elasticsearchError: errorResponse.error
      });
    });

    it("should handle complex nested error structure", async () => {
      const complexErrorResponse: SearchResponseWithError = {
        ...mockResponse,
        error: {
          root_cause: [
            {
              type: "query_shard_exception",
              reason: "failed to create query",
              index_uuid: "abc123",
              index: "test_index",
              caused_by: {
                type: "illegal_state_exception",
                reason: "field was indexed without position data"
              }
            }
          ],
          type: "search_phase_execution_exception",
          reason: "all shards failed",
          phase: "query",
          grouped: true,
          failed_shards: [
            {
              shard: 0,
              index: "test_index",
              node: "node1",
              reason: {
                type: "query_shard_exception",
                reason: "failed to create query",
                index_uuid: "abc123",
                index: "test_index"
              }
            },
            {
              shard: 1,
              index: "test_index",
              node: "node2",
              reason: {
                type: "query_shard_exception",
                reason: "failed to create query",
                index_uuid: "abc123",
                index: "test_index"
              }
            }
          ]
        }
      };

      class ComplexErrorApiClient extends MockApiClientTransporter {
        async performRequest(): Promise<SearchResponseWithError> {
          return complexErrorResponse;
        }
      }

      const errorPromise = handleSearch(
        state,
        queryConfig,
        new ComplexErrorApiClient()
      );

      await expect(errorPromise).rejects.toThrow("failed to create query");

      const error = await errorPromise.catch((e) => e);
      expect(error.elasticsearchError.failed_shards).toHaveLength(2);
      expect(error.elasticsearchError.root_cause?.[0].caused_by?.type).toBe(
        "illegal_state_exception"
      );
    });
  });
});
