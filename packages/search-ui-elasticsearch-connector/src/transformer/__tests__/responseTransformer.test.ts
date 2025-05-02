import {
  transformSearchResponse,
  transformHitToFieldResult
} from "../responseTransformer";
import { BaseQueryBuilder } from "../../queryBuilders/BaseQueryBuilder";
import type { ResponseBody, SearchHit } from "../../types";

class MockQueryBuilder extends BaseQueryBuilder {
  getSearchTerm(): string {
    return "test";
  }

  getSize(): number {
    return 10;
  }

  getFrom(): number {
    return 0;
  }

  build() {
    return {};
  }
}

describe("responseTransformer", () => {
  describe("transformSearchResponse", () => {
    it("should transform search response with hits", () => {
      const response: ResponseBody = {
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
              _id: "1",
              _source: {
                title: "Test Title",
                description: "Test Description"
              },
              highlight: {
                title: ["<em>Test</em> Title"]
              }
            }
          ]
        },
        aggregations: {
          facet_bucket_category: {
            category: {
              buckets: [
                { key: "electronics", doc_count: 10 },
                { key: "books", doc_count: 20 }
              ]
            }
          }
        }
      };

      const queryBuilder = new MockQueryBuilder({
        searchTerm: "test",
        current: 1,
        resultsPerPage: 10
      });
      const result = transformSearchResponse(response, queryBuilder);

      expect(result).toEqual({
        resultSearchTerm: "test",
        totalPages: 10,
        pagingStart: 1,
        pagingEnd: 10,
        wasSearched: false,
        totalResults: 100,
        facets: {
          category: [
            {
              field: "category",
              type: "value",
              data: [
                { value: "electronics", count: 10 },
                { value: "books", count: 20 }
              ]
            }
          ]
        },
        results: [
          {
            id: { raw: "1" },
            title: {
              raw: "Test Title",
              snippet: ["<em>Test</em> Title"]
            },
            description: { raw: "Test Description" },
            _meta: {
              id: "1",
              rawHit: {
                _id: "1",
                _index: "test",
                _source: {
                  title: "Test Title",
                  description: "Test Description"
                },
                highlight: {
                  title: ["<em>Test</em> Title"]
                }
              }
            }
          }
        ],
        requestId: null,
        rawResponse: null
      });
    });

    it("should handle empty search results", () => {
      const response: ResponseBody = {
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

      const queryBuilder = new MockQueryBuilder({
        searchTerm: "test",
        current: 1,
        resultsPerPage: 10
      });
      const result = transformSearchResponse(response, queryBuilder);

      expect(result).toEqual({
        resultSearchTerm: "test",
        totalPages: 0,
        pagingStart: 0,
        pagingEnd: 0,
        wasSearched: false,
        totalResults: 0,
        facets: {},
        results: [],
        requestId: null,
        rawResponse: null
      });
    });

    it("should handle pagination correctly", () => {
      const response: ResponseBody = {
        took: 1,
        timed_out: false,
        _shards: {
          total: 1,
          successful: 1,
          skipped: 0,
          failed: 0
        },
        hits: {
          total: { value: 25, relation: "eq" },
          hits: []
        },
        aggregations: {}
      };

      class PaginatedQueryBuilder extends MockQueryBuilder {
        getFrom(): number {
          return 10;
        }
      }

      const queryBuilder = new PaginatedQueryBuilder({
        searchTerm: "test",
        current: 1,
        resultsPerPage: 10
      });
      const result = transformSearchResponse(response, queryBuilder);

      expect(result).toEqual({
        resultSearchTerm: "test",
        totalPages: 3,
        pagingStart: 11,
        pagingEnd: 20,
        wasSearched: false,
        totalResults: 25,
        facets: {},
        results: [],
        requestId: null,
        rawResponse: null
      });
    });
  });

  describe("transformHitToFieldResult", () => {
    it("should transform hit with source and highlight", () => {
      const hit: SearchHit = {
        _index: "test",
        _id: "1",
        _source: {
          title: "Test Title",
          description: "Test Description"
        },
        highlight: {
          title: ["<em>Test</em> Title"]
        }
      };

      const result = transformHitToFieldResult(hit);

      expect(result).toEqual({
        id: { raw: "1" },
        title: {
          raw: "Test Title",
          snippet: ["<em>Test</em> Title"]
        },
        description: { raw: "Test Description" },
        _meta: {
          id: "1",
          rawHit: {
            _id: "1",
            _index: "test",
            _source: {
              title: "Test Title",
              description: "Test Description"
            },
            highlight: {
              title: ["<em>Test</em> Title"]
            }
          }
        }
      });
    });

    it("should transform hit with only source", () => {
      const hit: SearchHit = {
        _index: "test",
        _id: "1",
        _source: {
          title: "Test Title",
          description: "Test Description"
        }
      };

      const result = transformHitToFieldResult(hit);

      expect(result).toEqual({
        id: { raw: "1" },
        title: { raw: "Test Title" },
        description: { raw: "Test Description" },

        _meta: {
          id: "1",
          rawHit: {
            _id: "1",
            _index: "test",
            _source: {
              title: "Test Title",
              description: "Test Description"
            }
          }
        }
      });
    });

    it("should transform hit with only highlight", () => {
      const hit: SearchHit = {
        _index: "test",
        _id: "1",
        _source: {},
        highlight: {
          title: ["<em>Test</em> Title"]
        }
      };

      const result = transformHitToFieldResult(hit);

      expect(result).toEqual({
        id: { raw: "1" },
        title: { snippet: ["<em>Test</em> Title"] },
        _meta: {
          id: "1",
          rawHit: {
            _id: "1",
            _index: "test",
            _source: {},
            highlight: {
              title: ["<em>Test</em> Title"]
            }
          }
        }
      });
    });
  });
});
